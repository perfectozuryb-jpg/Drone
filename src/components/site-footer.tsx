import { RadioTower } from "lucide-react";
import Link from "next/link";

type LinkItem = {
  label: string;
  href: string;
};

type SiteFooterProps = {
  brandName: string;
  tagline: string;
  navigation: LinkItem[];
};

export function SiteFooter({ brandName, tagline, navigation }: SiteFooterProps) {
  return (
    <footer className="bg-[#071017] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[#00D1C1]/12 text-[#00D1C1]">
              <RadioTower aria-hidden="true" size={20} />
            </span>
            <div>
              <p className="font-semibold">{brandName}</p>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                Drone education lab
              </p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-300">{tagline}</p>
        </div>

        <nav className="grid gap-3 sm:grid-cols-2" aria-label="Liên kết cuối trang">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition hover:text-[#00D1C1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00D1C1]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
