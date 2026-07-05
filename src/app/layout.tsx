import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocalizedChrome } from "@/components/localized-chrome";
import { sourceContentEn, sourceContentVi } from "@/content/data/site";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Drone Việt | Drone nghiên cứu & giáo dục",
    template: "%s | Drone Việt",
  },
  description:
    "Drone Việt cung cấp giải pháp drone cho nghiên cứu và giáo dục từ cấp 1 đến đại học: thiết bị, giáo trình, nền tảng thử nghiệm và dịch vụ triển khai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = {
    vi: sourceContentVi.site,
    en: sourceContentEn.site,
  };

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocalizedChrome content={content}>{children}</LocalizedChrome>
      </body>
    </html>
  );
}
