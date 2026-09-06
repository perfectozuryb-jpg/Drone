import type { Locale } from "@/lib/content";

const routePairs = [
  ["/", "/en"],
  ["/ban-do", "/en/map"],
  ["/giai-phap", "/en/solutions"],
  ["/san-pham", "/en/products"],
  ["/giao-trinh", "/en/curriculum"],
  ["/dich-vu", "/en/services"],
  ["/tin-tuc", "/en/news"],
  ["/tin-tuc/drone-giao-duc-stem", "/en/news/drone-stem-research"],
  ["/tin-tuc/giao-trinh-drone-theo-cap-hoc", "/en/news/drone-curriculum-levels"],
] as const;

const viToEn = new Map<string, string>(routePairs);
const enToVi = new Map<string, string>(routePairs.map(([vi, en]) => [en, vi]));

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "vi";
}

export function getAlternateLocaleHref(pathname: string, locale: Locale): string {
  const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (locale === "vi") {
    if (viToEn.has(cleanPath)) {
      return viToEn.get(cleanPath)!;
    }
    if (cleanPath.startsWith("/san-pham/")) {
      const slug = cleanPath.slice("/san-pham/".length);
      return `/en/products/${slug}`;
    }
    return "/en";
  }

  if (enToVi.has(cleanPath)) {
    return enToVi.get(cleanPath)!;
  }
  if (cleanPath.startsWith("/en/products/")) {
    const slug = cleanPath.slice("/en/products/".length);
    return `/san-pham/${slug}`;
  }
  return "/";
}

export function getLanguageSwitchLabel(locale: Locale): string {
  return locale === "vi" ? "EN" : "VI";
}

