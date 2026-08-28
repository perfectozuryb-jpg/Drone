'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Loader2, ShieldAlert, GraduationCap, Newspaper } from 'lucide-react';
import { NewsCard } from './NewsCard';
import { LegalDirectoryView } from './LegalDirectoryView';
import { ZeroStorageItem } from '@/lib/news/zero-storage-crawler';

export function NewsBoard() {
  // Default to 'legal' tab
  const [activeCategory, setActiveCategory] = useState<string>('legal');
  const [items, setItems] = useState<ZeroStorageItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1000000));
  const observerTarget = useRef<HTMLDivElement>(null);

  // Exactly 3 Categories ONLY (No "Tất cả luồng tin")
  const categories = [
    { id: 'legal', label: 'Pháp lý & Quy chế bay', icon: ShieldAlert },
    { id: 'stem', label: 'STEM & Chế tạo', icon: GraduationCap },
    { id: 'general', label: 'Tin tức tổng hợp', icon: Newspaper },
  ];

  const fetchFeed = useCallback(
    async (cat: string, p: number, currentSeed: number, isRefresh = false) => {
      if (cat === 'legal') return; // Legal tab renders from static government directory component
      if (loading) return;
      setLoading(true);

      try {
        const res = await fetch(`/api/news/feed?category=${cat}&page=${p}&limit=9&seed=${currentSeed}`);
        const json = await res.json();

        if (json.success) {
          if (isRefresh || p === 1) {
            setItems(json.items);
          } else {
            setItems((prev) => [...prev, ...json.items]);
          }
          setHasMore(json.hasMore);
        }
      } catch (err) {
        console.error('Fetch Feed Error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    setPage(1);
    if (activeCategory !== 'legal') {
      fetchFeed(activeCategory, 1, seed, true);
    }
  }, [activeCategory, seed]);

  const handleRefresh = () => {
    setRefreshing(true);
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading && activeCategory !== 'legal') {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFeed(activeCategory, nextPage, seed, false);
      }
    },
    [hasMore, loading, page, activeCategory, seed, fetchFeed]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '200px',
    });

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [handleObserver]);

  return (
    <div className="w-full mt-6 mb-16 rounded-2xl bg-[#0F141C] p-4 md:p-8 text-white border border-slate-800 shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <h2 className="text-xl md:text-2xl font-black text-white tracking-wide flex items-center gap-2">
            DRONE NEWS STREAM <span className="text-xs font-mono text-cyan-400 font-semibold px-2 py-0.5 bg-cyan-950/80 rounded border border-cyan-500/30">LIVE FEED</span>
          </h2>
        </div>

        {activeCategory !== 'legal' && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Tự động cào tin mới trực tiếp khi làm mới
            </span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Làm mới luồng tin
            </button>
          </div>
        )}
      </div>

      {/* Exactly 3 Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-slate-800/60">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold rounded-full transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Content Rendering: Legal Tab vs STEM/General News Tabs */}
      {activeCategory === 'legal' ? (
        <LegalDirectoryView />
      ) : (
        <>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, idx) => (
                <NewsCard key={`${item.id}-${idx}`} item={item} />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="py-16 text-center text-slate-400">
                <p className="text-base font-semibold">Chưa có tin tức cho mục này.</p>
              </div>
            )
          )}

          {/* Infinite Scroll Loader */}
          <div ref={observerTarget} className="mt-8 py-6 flex justify-center items-center">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-cyan-400 font-semibold bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải thêm tin tức...
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <p className="text-xs text-slate-500 font-mono">Đã hiển thị toàn bộ tin tức cho mục này</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
