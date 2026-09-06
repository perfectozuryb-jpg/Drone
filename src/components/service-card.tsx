import { CheckCircle2, Wrench } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/lib/content/schema";

type ServiceCardProps = {
  service: Service;
  locale?: "vi" | "en";
};

export function ServiceCard({ service, locale = "vi" }: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-white/10 bg-white/8 p-5 text-white backdrop-blur">
      <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#00D1C1]/12 text-[#00D1C1]">
        <Wrench aria-hidden="true" size={21} />
      </div>
      <h3 className="text-xl font-semibold">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">
        {service.summary}
      </p>
      <ul className="mt-5 space-y-2 text-sm text-slate-200">
        {service.deliverables.slice(0, 3).map((deliverable) => (
          <li key={deliverable} className="flex gap-2">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-[#00D1C1]" size={16} />
            <span>{deliverable}</span>
          </li>
        ))}
      </ul>
      <Link
        href={locale === "en" ? `/en/services#${service.slug}` : `/dich-vu#${service.slug}`}
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B1117] transition hover:bg-[#00D1C1]"
      >
        {service.ctaLabel}
      </Link>
    </article>
  );
}
