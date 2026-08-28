import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell } from "@/components/section-shell";
import { getArticles } from "@/lib/content";
import { NewsBoard } from "@/components/news/NewsBoard";

export const metadata: Metadata = {
  title: "News and resources | MSN Drone Feed",
  description:
    "Real-time dynamic drone information stream: Legal regulations, firmware releases, technical discussions, and STEM guides.",
};

export default function EnglishNewsPage() {
  const articles = getArticles("en");

  return (
    <SectionShell
      eyebrow="Live Drone Stream & Knowledge base"
      title="Drone Information System"
      description="Stay updated with a dynamic live stream of drone regulations, firmware releases, hardware reviews, and FPV community discussions."
    >
      {/* MSN Edge-Style Dynamic News Stream */}
      <NewsBoard />

      <h3 className="mt-12 mb-6 text-xl font-bold text-[#0B1117] border-b pb-2">Archived Articles</h3>
      <div className="grid gap-5 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/en/news/${article.slug}`}
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-[#00D1C1]/60 hover:shadow-xl hover:shadow-cyan-950/10"
          >
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#006D66]">
              <CalendarDays aria-hidden="true" size={14} />
              {article.date} · {article.readingTime}
            </p>
            <h2 className="text-2xl font-semibold text-[#0B1117]">{article.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{article.summary}</p>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
