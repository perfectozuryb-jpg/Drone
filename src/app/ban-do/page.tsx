import type { Metadata } from "next";
import { SectionShell } from "@/components/section-shell";

export const metadata: Metadata = {
  title: "Bản đồ tra cứu vùng cấm bay drone Việt Nam (WebGIS)",
  description:
    "Hệ thống tra cứu và kiểm tra xung đột vùng cấm bay, vùng hạn chế bay drone tại Việt Nam với công cụ GIS tương tác, tìm kiếm hành chính và kiểm tra tọa độ/tuyến bay.",
};

export default function MapPage() {
  return (
    <SectionShell
      eyebrow="WebGIS Tra Cứu Vùng Bay"
      title="Bản đồ tra cứu & kiểm tra vùng cấm bay drone Việt Nam"
      description="Tra cứu vùng cấm bay (No-Fly Zone), vùng hạn chế bay, tra cứu theo Tỉnh/Huyện/Xã, địa điểm, vẽ đường/vùng bay để kiểm tra an toàn hàng không trước khi cất cánh."
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white">
        <iframe
          src="/map.html?lang=vi"
          title="Bản đồ tra cứu vùng cấm bay drone Việt Nam"
          className="w-full h-[calc(100vh-140px)] min-h-[720px] border-0"
          allow="geolocation"
        />
      </div>
    </SectionShell>
  );
}
