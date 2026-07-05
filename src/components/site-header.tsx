import { ArrowRight, Cpu } from "lucide-react";
import Link from "next/link";

type LinkItem = {
  label: string;
  href: string;
};

type SiteHeaderProps = {
  brandName: string;
  navigation: LinkItem[];
  primaryCta: LinkItem;
  languageSwitch?: LinkItem;
};

export function SiteHeader({
  brandName,
  navigation,
  primaryCta,
  languageSwitch,
}: SiteHeaderProps) {
  const primaryCtaIsExternal = primaryCta.href.startsWith("http");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1117]/92 text-white backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 text-sm font-semibold"
          aria-label={brandName}
        >
          <span className="grid size-10 place-items-center rounded-lg border border-[#00D1C1]/35 bg-[#00D1C1]/10 text-[#00D1C1] shadow-[0_0_30px_rgba(0,209,193,0.18)]">
            <Cpu aria-hidden="true" size={20} />
          </span>
          <span className="text-base tracking-normal">{brandName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D1C1]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {languageSwitch ? (
            <Link
              href={languageSwitch.href}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/12 px-3 text-sm font-semibold text-slate-200 transition hover:border-[#00D1C1]/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D1C1]"
            >
              {languageSwitch.label}
            </Link>
          ) : null}
          <Link
            href={primaryCta.href}
            aria-label={primaryCta.label}
            target={primaryCtaIsExternal ? "_blank" : undefined}
            rel={primaryCtaIsExternal ? "noopener noreferrer" : undefined}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#00D1C1] px-4 text-sm font-semibold text-[#0B1117] transition hover:bg-[#27EFE3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="hidden sm:inline">{primaryCta.label}</span>
            <span aria-hidden="true" className="sm:hidden">
              {primaryCta.label.includes("Contact") ? "Contact" : "Tư vấn"}
            </span>
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
      <nav
        className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto border-t border-white/8 px-5 py-2 md:hidden"
        aria-label="Điều hướng mobile"
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-[#00D1C1]/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D1C1]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
