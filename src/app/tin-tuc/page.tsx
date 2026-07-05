import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell } from "@/components/section-shell";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tin tức và học liệu",
  description:
    "Bài viết và học liệu về drone cho nghiên cứu, giáo dục, STEM, giáo trình và triển khai phòng lab drone.",
};

export default async function ArticlesPage() {
  const articles = getArticles();

  return (
    <SectionShell
      eyebrow="Knowledge base"
      title="Tin tức và học liệu"
      description="Nội dung được lưu bằng Markdown trong repo để dễ chỉnh sửa trước khi có admin/database."
    >
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
