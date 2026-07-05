import { ArrowRight, Gauge, GraduationCap } from "lucide-react";
import Link from "next/link";
import type { DroneModel } from "@/lib/content/schema";

type DroneCardProps = {
  drone: DroneModel;
  detailBasePath?: string;
  ctaLabel?: string;
};

export function DroneCard({
  drone,
  detailBasePath = "/san-pham",
  ctaLabel = "Xem chi tiết",
}: DroneCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#00D1C1]/50 hover:shadow-xl hover:shadow-cyan-950/10">
      <div className="relative min-h-44 overflow-hidden bg-[#0B1117]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,209,193,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,209,193,0.1)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute inset-x-8 top-10 h-20 rounded-full border border-[#00D1C1]/25 bg-[#00D1C1]/10 blur-sm" />
        <div className="relative z-10 flex h-44 items-center justify-center">
          <div className="grid size-24 place-items-center rounded-full border border-[#00D1C1]/35 bg-[#00D1C1]/12 text-[#00D1C1]">
            <Gauge aria-hidden="true" size={36} />
          </div>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white">
          {drone.level}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-[#006D66]">
          <GraduationCap aria-hidden="true" size={17} />
          <span>{drone.useCases[0]}</span>
        </div>
        <h3 className="text-xl font-semibold text-[#0B1117]">{drone.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
          {drone.summary}
        </p>

        <dl className="mt-5 grid gap-2">
          {drone.specs.slice(0, 2).map((spec) => (
            <div key={spec.label} className="flex items-center justify-between gap-3 text-sm">
              <dt className="text-slate-500">{spec.label}</dt>
              <dd className="font-medium text-slate-800">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <Link
          href={`${detailBasePath}/${drone.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#006D66] transition group-hover:text-[#004B47]"
        >
          {ctaLabel}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </article>
  );
}
