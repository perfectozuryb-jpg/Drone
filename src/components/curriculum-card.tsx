import { BookOpenCheck, FileText } from "lucide-react";
import Link from "next/link";
import type { CurriculumItem } from "@/lib/content/schema";

type CurriculumCardProps = {
  item: CurriculumItem;
};

export function CurriculumCard({ item }: CurriculumCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#FFB020]/60 hover:shadow-xl hover:shadow-amber-950/10">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#FFB020]/12 px-3 py-1 text-sm font-medium text-[#805300]">
          <BookOpenCheck aria-hidden="true" size={16} />
          {item.level}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
          {item.status}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-[#0B1117]">{item.title}</h3>
      <p className="mt-2 text-sm font-medium text-[#006D66]">{item.format}</p>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
        {item.summary}
      </p>
      <ul className="mt-5 space-y-2 text-sm text-slate-700">
        {item.modules.slice(0, 3).map((module) => (
          <li key={module} className="flex gap-2">
            <FileText aria-hidden="true" className="mt-0.5 shrink-0 text-[#00A99C]" size={15} />
            <span>{module}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/giao-trinh#${item.slug}`}
        className="mt-5 inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-[#0B1117] transition hover:border-[#FFB020] hover:bg-[#FFB020]/10"
      >
        {item.downloadLabel}
      </Link>
    </article>
  );
}
