import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
  children: ReactNode;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  tone = "light",
  children,
}: SectionShellProps) {
  const isDark = tone === "dark";

  return (
    <section
      className={
        isDark
          ? "bg-[#0B1117] py-20 text-white sm:py-24"
          : "bg-[#F7FAFC] py-20 text-[#24313D] sm:py-24"
      }
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-10 max-w-3xl">
          {eyebrow ? (
            <p
              className={
                isDark
                  ? "mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[#00D1C1]"
                  : "mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[#006D66]"
              }
            >
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p
              className={
                isDark
                  ? "mt-4 max-w-2xl text-base leading-7 text-slate-300"
                  : "mt-4 max-w-2xl text-base leading-7 text-slate-600"
              }
            >
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
