/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { ExternalLink, Radio, Sparkles } from 'lucide-react';
import { ZeroStorageItem } from '@/lib/news/zero-storage-crawler';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80";

export function NewsCard({ item }: { item: ZeroStorageItem }) {
  const [imgSrc, setImgSrc] = useState<string>(item.imageUrl || FALLBACK_IMAGE);
  const [logoSrc, setLogoSrc] = useState<string | undefined>(item.sourceLogo);

  const getBadgeStyle = () => {
    switch (item.topic) {
      case 'regulation':
        return 'bg-amber-500/90 text-amber-50 border-amber-400/40';
      case 'agriculture':
        return 'bg-emerald-500/90 text-emerald-50 border-emerald-400/40';
      case 'product':
        return 'bg-blue-500/90 text-blue-50 border-blue-400/40';
      case 'rescue':
        return 'bg-rose-500/90 text-rose-50 border-rose-400/40';
      case 'ai_autonomous':
        return 'bg-purple-500/90 text-purple-50 border-purple-400/40';
      case 'stem':
        return 'bg-cyan-500/90 text-cyan-50 border-cyan-400/40';
      default:
        return 'bg-slate-700/90 text-slate-100 border-slate-600/40';
    }
  };

  const displayTag = item.topicLabel || item.categoryLabel;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-[#181F2A] transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-950/50 min-h-[300px]"
    >
      {/* Visual Image Banner */}
      <div className="relative w-full overflow-hidden h-44 bg-slate-900">
        <img
          src={imgSrc}
          alt={item.title}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181F2A] via-[#181F2A]/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[80%]">
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full shadow-md backdrop-blur-md border ${getBadgeStyle()}`}>
            {displayTag}
          </span>
          {item.isFresh && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-red-600/90 text-white shadow-md border border-red-400/50 animate-pulse">
              <Sparkles className="w-2.5 h-2.5" />
              Mới
            </span>
          )}
        </div>

        <ExternalLink className="absolute top-3 right-3 w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-0.5 rounded" />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 pt-2">
        <div>
          {/* Source Logo + Name & Time */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5 font-medium">
            <div className="flex items-center gap-2 max-w-[65%]">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={item.source}
                  onError={() => setLogoSrc(undefined)}
                  className="w-4 h-4 rounded-full object-contain bg-white/10 p-0.5 shrink-0"
                />
              ) : (
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              )}
              <span className="text-cyan-300 font-semibold truncate">{item.source}</span>
            </div>
            <span className="text-slate-400 text-xs shrink-0 font-mono">{item.relativeTime || 'Mới nhất'}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors text-sm md:text-base mb-2.5 line-clamp-2">
            {item.title}
          </h3>

          {/* Contextual Abstract */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {item.abstract}
          </p>
        </div>
      </div>
    </a>
  );
}
