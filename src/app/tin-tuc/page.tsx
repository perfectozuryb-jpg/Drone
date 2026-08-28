import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell } from "@/components/section-shell";
import { getArticles } from "@/lib/content";
import { NewsBoard } from "@/components/news/NewsBoard";

export const metadata: Metadata = {
  title: "Tin tức và học liệu | MSN Drone Feed",
  description:
    "Cổng thông tin drone tự động cập nhật liên tục: Quy chế pháp lý, bản tin firmware, thảo luận kỹ thuật và bài viết STEM.",
};

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <SectionShell
      eyebrow="Live Drone Stream & Knowledge base"
      title="Hệ thống Thông tin Drone Việt Nam"
      description="Luồng tin tức drone tự động cập nhật liên tục từ các nguồn nhà nước, cộng đồng FPV, nhà phát triển firmware và linh kiện phần cứng."
    >
      {/* MSN Edge-Style Dynamic News Stream */}
      <NewsBoard />

      <h3 className="mt-12 mb-6 text-xl font-bold text-[#0B1117] border-b pb-2">Bài viết học liệu lưu trữ</h3>
      <div className="grid gap-5 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/tin-tuc/${article.slug}`}
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
