'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Loader2, ShieldAlert, GraduationCap, Newspaper, Search, X, Layers, Clock } from 'lucide-react';
import { NewsCard } from './NewsCard';
import { LegalDirectoryView } from './LegalDirectoryView';
import { ZeroStorageItem } from '@/lib/news/zero-storage-crawler';

export function NewsBoard() {
  // Default to 'legal' tab
  const [activeCategory, setActiveCategory] = useState<string>('legal');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableTopics, setAvailableTopics] = useState<{ id: string; label: string; count: number }[]>([]);

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

  const loadingRef = useRef(false);

  const fetchFeed = useCallback(
    async (
      cat: string,
      p: number,
      currentSeed: number,
      isRefresh = false,
      topic = 'all',
      search = ''
    ) => {
      if (cat === 'legal') return; // Legal tab renders from static government directory component
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        const queryParams = new URLSearchParams({
          category: cat,
          page: p.toString(),
          limit: '9',
          seed: currentSeed.toString(),
        });
        if (topic && topic !== 'all') {
          queryParams.set('topic', topic);
        }
        if (search.trim()) {
          queryParams.set('search', search.trim());
        }

        const res = await fetch(`/api/news/feed?${queryParams.toString()}`);
        const json = await res.json();

        if (json.success) {
          if (isRefresh || p === 1) {
            setItems(json.items || []);
          } else {
            setItems((prev) => [...prev, ...(json.items || [])]);
          }
          setHasMore(json.hasMore);
          if (json.topics && json.topics.length > 0) {
            setAvailableTopics(json.topics);
          }
        }
      } catch (err) {
        console.error('Fetch Feed Error:', err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  const handleSelectCategory = (catId: string) => {
    if (catId === activeCategory) return;
    setActiveCategory(catId);
    setPage(1);
    setSelectedTopic('all');
    setSearchQuery('');
    if (catId !== 'legal') {
      fetchFeed(catId, 1, seed, true, 'all', '');
    }
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopic(topicId);
    setPage(1);
    fetchFeed(activeCategory, 1, seed, true, topicId, searchQuery);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
    if (activeCategory !== 'legal') {
      fetchFeed(activeCategory, 1, newSeed, true, selectedTopic, searchQuery);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFeed(activeCategory, 1, seed, true, selectedTopic, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
    fetchFeed(activeCategory, 1, seed, true, selectedTopic, '');
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading && activeCategory !== 'legal') {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFeed(activeCategory, nextPage, seed, false, selectedTopic, searchQuery);
      }
    },
    [hasMore, loading, page, activeCategory, seed, selectedTopic, searchQuery, fetchFeed]
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
            <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Sắp xếp theo thời gian thực (Mới nhất lên đầu)
            </span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Cập nhật luồng tin
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
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-950/50 scale-100'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Sub-Filters & Search Bar for General News */}
      {activeCategory === 'general' && (
        <div className="mb-6 space-y-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Live Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tin theo từ khóa (VD: Nội Bài, TP.HCM, DJI, nông nghiệp...)"
                className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Hiển thị {items.length} tin bài
            </span>
          </div>

          {/* Topic Sub-filter Pills */}
          {availableTopics.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
              {availableTopics.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic.id)}
                    className={`text-xs px-3 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{topic.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-400'}`}>
                      {topic.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

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
              <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                <p className="text-base font-semibold">Không tìm thấy tin tức phù hợp với bộ lọc hiện tại.</p>
                <p className="text-xs text-slate-500 mt-1">Hãy thử xóa bộ lọc tìm kiếm hoặc chọn &quot;Tất cả chủ đề&quot;.</p>
              </div>
            )
          )}

          {/* Infinite Scroll Loader */}
          <div ref={observerTarget} className="mt-8 py-6 flex justify-center items-center">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-cyan-400 font-semibold bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải thêm tin tức mới...
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <p className="text-xs text-slate-500 font-mono">Đã hiển thị toàn bộ tin tức mới nhất cho mục này</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
