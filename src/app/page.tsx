import { Box, CheckCircle2, Rocket } from "lucide-react";
import { DroneLabShowroom } from "@/components/drone-lab-showroom";
import { SectionShell } from "@/components/section-shell";
import {
  getDroneModels,
  getServices,
  getSiteContent,
  type Locale,
} from "@/lib/content";

export function HomePageContent({ locale = "vi" }: { locale?: Locale }) {
  const site = getSiteContent(locale);
  const featuredDrones = getDroneModels(locale).filter((drone) => drone.featured);
  const services = getServices(locale);
  const compactServices = services.slice(0, 3);

  return (
    <>
      <DroneLabShowroom
        eyebrow={site.hero.eyebrow}
        title={site.hero.title}
        description={site.hero.description}
        primaryCta={site.hero.primaryCta}
        secondaryCta={site.hero.secondaryCta}
        drones={getDroneModels(locale)}
      />

      <SectionShell
        eyebrow="Solution catalog"
        title="5 cấu hình drone trọng điểm"
        description="Từ lớp học cấp 1 đến lab nghiên cứu đại học."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredDrones.map((drone, index) => (
            <article
              key={drone.slug}
              className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#00D1C1]/60 hover:shadow-2xl hover:shadow-cyan-950/10"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[#00D1C1]" />
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-[#0B1117] px-3 py-1 font-mono text-xs text-white">
                  {drone.level}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  0{index + 1}
                </span>
              </div>
              <div className="mb-5 grid size-14 place-items-center rounded-lg bg-[#00D1C1]/10 text-[#006D66]">
                <Box aria-hidden="true" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#0B1117]">{drone.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {drone.summary}
              </p>
              <div className="mt-5 space-y-2">
                {drone.learningOutcomes.slice(0, 2).map((outcome) => (
                  <p key={outcome} className="flex gap-2 text-sm text-slate-700">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#00D1C1]" />
                    <span>{outcome}</span>
                  </p>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {drone.useCases.slice(0, 2).map((useCase) => (
                  <span
                    key={useCase}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Services"
        title="Triển khai nhanh, đúng mục tiêu"
        description="Thiết bị, lab, giáo trình và nền tảng nghiên cứu."
        tone="dark"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {compactServices.map((service) => (
            <article
              key={service.slug}
              className="rounded-lg border border-white/10 bg-white/8 p-5 text-white backdrop-blur transition hover:border-[#00D1C1]/50 hover:bg-white/12"
            >
              <div className="mb-5 grid size-12 place-items-center rounded-lg bg-[#00D1C1]/12 text-[#00D1C1]">
                <CheckCircle2 aria-hidden="true" size={22} />
              </div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {service.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.deliverables.slice(0, 3).map((deliverable) => (
                  <span
                    key={deliverable}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200"
                  >
                    {deliverable}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Deployment"
        title="3 bước đưa drone vào lớp học và lab"
        description="Rõ mục tiêu, đúng thiết bị, vận hành được ngay."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {site.process.map((step, index) => (
            <article
              key={step.title}
              className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="absolute -right-8 -top-8 size-24 rounded-full bg-[#00D1C1]/10" />
              <p className="font-mono text-sm text-[#006D66]">0{index + 1}</p>
              <div className="mt-5 grid size-11 place-items-center rounded-lg bg-[#0B1117] text-[#00D1C1]">
                <Rocket aria-hidden="true" size={20} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#0B1117]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.summary}</p>
            </article>
          ))}
        </div>
      </SectionShell>
    </>
  );
}

export default function Home() {
  return <HomePageContent locale="vi" />;
}
