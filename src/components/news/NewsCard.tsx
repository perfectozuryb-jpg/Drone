'use client';

import { useState } from 'react';
import { ExternalLink, Radio } from 'lucide-react';
import { ZeroStorageItem } from '@/lib/news/zero-storage-crawler';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80";

export function NewsCard({ item }: { item: ZeroStorageItem }) {
  const [imgSrc, setImgSrc] = useState<string>(item.imageUrl || FALLBACK_IMAGE);
  const [logoSrc, setLogoSrc] = useState<string | undefined>(item.sourceLogo);

  const timeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Vừa xong';

      const rtf = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });
      const diff = date.getTime() - new Date().getTime();

      const days = Math.round(diff / (1000 * 60 * 60 * 24));
      if (Math.abs(days) > 0) return rtf.format(days, 'day');

      const hours = Math.round(diff / (1000 * 60 * 60));
      if (Math.abs(hours) > 0) return rtf.format(hours, 'hour');

      const minutes = Math.round(diff / (1000 * 60));
      return rtf.format(minutes, 'minute');
    } catch {
      return 'Mới nhất';
    }
  };

  const badgeClass = item.category === 'stem'
    ? 'bg-cyan-600/90 text-white'
    : 'bg-emerald-600/90 text-white';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-[#181F2A] transition-all hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-950/40 min-h-[280px]"
    >
      {/* Visual Image Banner */}
      <div className="relative w-full overflow-hidden h-40">
        <img
          src={imgSrc}
          alt={item.title}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181F2A] via-[#181F2A]/40 to-transparent" />

        {/* Category Pill Tag */}
        <span className={`absolute top-3 left-3 px-2.5 py-0.5 text-xs font-semibold rounded-full shadow-md backdrop-blur-md ${badgeClass}`}>
          {item.categoryLabel}
        </span>

        <ExternalLink className="absolute top-3 right-3 w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 pt-1">
        <div>
          {/* Source Logo + Name & Time */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <div className="flex items-center gap-2">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={item.source}
                  onError={() => setLogoSrc(undefined)}
                  className="w-4 h-4 rounded-full object-contain bg-white/10 p-0.5"
                />
              ) : (
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              )}
              <span className="text-cyan-300 font-semibold">{item.source}</span>
            </div>
            <span>{timeAgo(item.publishedAt)}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors text-sm md:text-base mb-2 line-clamp-2">
            {item.title}
          </h3>

          {/* Abstract */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {item.abstract}
          </p>
        </div>
      </div>
    </a>
  );
}
