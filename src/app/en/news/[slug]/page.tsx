import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionShell } from "@/components/section-shell";
import { getArticleBySlug, getArticles } from "@/lib/content";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getArticles("en").map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug, "en");

  if (!article) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function EnglishArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug, "en");

  if (!article) {
    notFound();
  }

  return (
    <SectionShell
      eyebrow={`${article.category} · ${article.readingTime}`}
      title={article.title}
      description={article.summary}
    >
      <article className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
          {article.date}
        </p>
        <div className="space-y-5 text-base leading-8 text-slate-700">
          {article.content.split(/\n{2,}/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </SectionShell>
  );
}

