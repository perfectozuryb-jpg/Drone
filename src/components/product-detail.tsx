import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import type { DroneModel } from "@/lib/content/schema";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildProductJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo";
import { getServices } from "@/lib/content";

type ProductDetailProps = {
  drone: DroneModel;
  locale: "vi" | "en";
};

function getCopy(locale: "vi" | "en") {
  return locale === "vi"
    ? {
        home: "Trang chủ",
        products: "Sản phẩm",
        eyebrow: "Drone product",
        outcomes: "Đầu ra học tập / nghiên cứu",
        specs: "Thông số triển khai",
        useCases: "Ứng dụng phù hợp",
        faqTitle: "Câu hỏi thường gặp",
        cta: "Liên hệ tư vấn ngay",
        related: "Dịch vụ liên quan",
        faq: [
          {
            question: "Bộ drone này phù hợp với đơn vị nào?",
            answer:
              "Bộ drone được chọn theo cấp học, năng lực kỹ thuật, không gian bay và mục tiêu triển khai của từng trường, trung tâm hoặc lab.",
          },
          {
            question: "Drone Việt có hỗ trợ giáo trình và tập huấn không?",
            answer:
              "Có. Drone Việt cung cấp giáo trình, checklist an toàn, rubric đánh giá và chương trình tập huấn giáo viên hoặc giảng viên.",
          },
          {
            question: "Có thể tùy biến cho lab nghiên cứu không?",
            answer:
              "Có. Các cấu hình có thể mở rộng bằng cảm biến, camera, telemetry và protocol thử nghiệm cho đề tài nghiên cứu.",
          },
        ],
      }
    : {
        home: "Home",
        products: "Products",
        eyebrow: "Drone product",
        outcomes: "Learning / research outcomes",
        specs: "Deployment specs",
        useCases: "Best-fit use cases",
        faqTitle: "Frequently asked questions",
        cta: "Contact us now",
        related: "Related services",
        faq: [
          {
            question: "Who is this drone kit for?",
            answer:
              "Each kit is matched to learner level, technical capability, flight space, and deployment goals for schools, centers, or labs.",
          },
          {
            question: "Does Drone Viet support curriculum and training?",
            answer:
              "Yes. Drone Viet provides curriculum, safety checklists, assessment rubrics, and teacher or instructor training.",
          },
          {
            question: "Can it be customized for research labs?",
            answer:
              "Yes. Configurations can be extended with sensors, cameras, telemetry, and experiment protocols for research topics.",
          },
        ],
      };
}

export function ProductDetail({ drone, locale }: ProductDetailProps) {
  const copy = getCopy(locale);
  const productPath =
    locale === "vi" ? `/san-pham/${drone.slug}` : `/en/products/${drone.slug}`;
  const productsPath = locale === "vi" ? "/san-pham" : "/en/products";
  const services = getServices(locale).slice(0, 3);

  return (
    <>
      <JsonLd data={buildProductJsonLd(drone, locale)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: copy.home, url: locale === "vi" ? "/" : "/en" },
          { name: copy.products, url: productsPath },
          { name: drone.name, url: productPath },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(copy.faq)} />
      {services.map((service) => (
        <JsonLd key={service.slug} data={buildServiceJsonLd(service, locale)} />
      ))}

      <section className="bg-[#0B1117] text-white">
        <div className="mx-auto grid min-h-[calc(100svh-72px)] w-full max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#00D1C1]">
              {copy.eyebrow}
            </p>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-6xl">
              {drone.name}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {drone.summary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://zalo.me/0384070636"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#00D1C1] px-5 text-sm font-semibold text-[#0B1117] transition hover:bg-[#27EFE3]"
              >
                {copy.cta}
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link
                href={productsPath}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/14 px-5 text-sm font-semibold text-white transition hover:bg-white/8"
              >
                {copy.products}
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <div className="relative min-h-72 overflow-hidden rounded-lg bg-[#071017]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,209,193,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,209,193,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="absolute inset-x-10 top-16 h-32 rounded-full border border-[#00D1C1]/25 bg-[#00D1C1]/10 blur-sm" />
              <div className="relative z-10 flex min-h-72 items-center justify-center">
                <div className="grid size-40 place-items-center rounded-full border border-[#00D1C1]/40 bg-[#00D1C1]/10">
                  <div className="size-24 rounded-[2rem] border border-[#00D1C1]/50 bg-[#0B1117] shadow-[0_0_60px_rgba(0,209,193,0.35)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7FAFC] py-20 text-[#24313D]">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0B1117]">{copy.outcomes}</h2>
            <div className="mt-5 space-y-3">
              {drone.learningOutcomes.map((outcome) => (
                <p key={outcome} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#006D66]" size={17} />
                  <span>{outcome}</span>
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0B1117]">{copy.specs}</h2>
            <dl className="mt-5 space-y-3">
              {drone.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                  <dt className="text-slate-500">{spec.label}</dt>
                  <dd className="font-semibold text-slate-800">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0B1117]">{copy.useCases}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {drone.useCases.map((useCase) => (
                <span
                  key={useCase}
                  className="rounded-full bg-[#00D1C1]/10 px-3 py-1 text-sm font-medium text-[#006D66]"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[#006D66]">
              FAQ
            </p>
            <h2 className="text-3xl font-semibold text-[#0B1117]">{copy.faqTitle}</h2>
          </div>
          <div className="space-y-3">
            {copy.faq.map((item) => (
              <article key={item.question} className="rounded-lg border border-slate-200 p-5">
                <h3 className="font-semibold text-[#0B1117]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1117] py-20 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[#00D1C1]">
            {copy.related}
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.slug} className="rounded-lg border border-white/10 bg-white/8 p-5">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{service.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

