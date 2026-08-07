import type { Metadata } from "next";
import { SectionShell } from "@/components/section-shell";

export const metadata: Metadata = {
  title: "Vietnam Drone No-Fly Zone Map (WebGIS)",
  description:
    "Interactive WebGIS map to search and check no-fly zones, restricted airspace, administrative areas, and flight route safety in Vietnam.",
};

export default function EnglishMapPage() {
  return (
    <SectionShell
      eyebrow="WebGIS Flight Zone Map"
      title="Vietnam Drone No-Fly & Restricted Zone Checker"
      description="Look up no-fly and restricted zones, administrative boundaries, coordinates, and custom flight paths to ensure aviation safety before takeoff."
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white">
        <iframe
          src="/map.html?lang=en"
          title="Vietnam Drone No-Fly Zone Map"
          className="w-full h-[calc(100vh-140px)] min-h-[720px] border-0"
          allow="geolocation"
        />
      </div>
    </SectionShell>
  );
}
