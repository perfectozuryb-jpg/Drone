'use client';

import type { ComponentType } from 'react';
import { ExternalLink, AlertTriangle, FileText, MapPin, FileCheck, UserCheck, Building2, Download, Wrench, Search } from 'lucide-react';

interface LegalDoc {
  title: string;
  agency: string;
  url: string;
  note?: string;
}

interface LegalGroup {
  groupName: string;
  icon: ComponentType<{ className?: string }>;
  docs: LegalDoc[];
}

const LEGAL_GROUPS: LegalGroup[] = [
  {
    groupName: "Văn bản pháp luật",
    icon: FileText,
    docs: [
      {
        title: "Luật Phòng không nhân dân số 49/2024/QH15",
        agency: "Quốc hội",
        url: "https://vanban.chinhphu.vn/?docid=212477&pageid=27160",
      },
      {
        title: "Nghị định số 288/2025/NĐ-CP của Chính phủ – Quy định về quản lý tàu bay không người lái và phương tiện bay khác",
        agency: "Chính phủ",
        url: "https://vanban.chinhphu.vn/?classid=1&docid=215810&pageid=27160&typegroupid=4",
      },
      {
        title: "Thông tư số 146/2025/TT-BQP",
        agency: "Bộ Quốc phòng",
        url: "https://vanban.chinhphu.vn/?docid=216587&pageid=27160",
      },
      {
        title: "Thông tư số 39/2025/TT-BQP",
        agency: "Bộ Quốc phòng",
        url: "https://vanban.chinhphu.vn/?classid=1&docid=214031&pageid=27160",
      },
      {
        title: "Nghị định số 36/2008/NĐ-CP",
        agency: "Chính phủ",
        note: "Văn bản lịch sử",
        url: "https://vanban.chinhphu.vn/default.aspx?docid=62937&pageid=27160",
      },
      {
        title: "Nghị định số 79/2011/NĐ-CP",
        agency: "Chính phủ",
        note: "Sửa đổi Nghị định 36/2008/NĐ-CP",
        url: "https://vanban.chinhphu.vn/default.aspx?docid=151535&pageid=27160",
      },
      {
        title: "Thông tư số 35/2017/TT-BQP",
        agency: "Bộ Quốc phòng",
        note: "Văn bản lịch sử",
        url: "https://vanban.chinhphu.vn/default.aspx?docid=189273&pageid=27160",
      },
      {
        title: "Chỉ thị số 02/CT-TTg",
        agency: "Thủ tướng Chính phủ",
        url: "https://vanban.chinhphu.vn/default.aspx?docid=198854&pageid=27160",
      },
    ],
  },
  {
    groupName: "Vùng cấm / hạn chế bay",
    icon: MapPin,
    docs: [
      {
        title: "Cổng tra cứu khu vực cấm bay, hạn chế bay",
        agency: "Bộ Quốc phòng",
        url: "https://cambay.mod.gov.vn/",
      },
      {
        title: "Hướng dẫn thực hiện thủ tục cấp phép bay và tra cứu khu vực cấm/hạn chế bay",
        agency: "Cổng Thông tin điện tử Chính phủ",
        url: "https://xaydungchinhsach.chinhphu.vn/huong-dan-thuc-hien-thu-tuc-cap-phep-bay-doi-voi-tau-bay-khong-nguoi-lai-va-cac-phuong-tien-bay-khac-119250616123043064.htm",
      },
    ],
  },
  {
    groupName: "Thủ tục cấp phép bay",
    icon: FileCheck,
    docs: [
      {
        title: "Thủ tục cấp phép bay đối với tàu bay không người lái và các phương tiện bay siêu nhẹ",
        agency: "Cổng Dịch vụ công Quốc gia",
        url: "https://dichvucong.gov.vn/p/home/dvc-tthc-thu-tuc-hanh-chinh-chi-tiet.html?ma_thu_tuc=369083",
      },
    ],
  },
  {
    groupName: "Giấy phép điều khiển",
    icon: UserCheck,
    docs: [
      {
        title: "Thủ tục cấp Giấy phép điều khiển tàu bay không người lái và phương tiện bay khác",
        agency: "Cổng Dịch vụ công Quốc gia",
        url: "https://thutuc.dichvucong.gov.vn/p/home/dvc-tthc-thu-tuc-hanh-chinh-chi-tiet.html?ma_thu_tuc=424492",
      },
      {
        title: "Thủ tục cấp đổi, cấp lại Giấy phép điều khiển tàu bay không người lái và phương tiện bay khác",
        agency: "Cổng Dịch vụ công Quốc gia",
        url: "https://dichvucong.gov.vn/p/home/dvc-tthc-thu-tuc-hanh-chinh-chi-tiet.html?ma_thu_tuc=424445",
      },
    ],
  },
  {
    groupName: "Doanh nghiệp / sản xuất / kinh doanh",
    icon: Building2,
    docs: [
      {
        title: "Thủ tục cấp đổi, cấp lại Giấy chứng nhận đủ điều kiện kinh doanh tàu bay không người lái và phương tiện bay khác",
        agency: "Cổng Dịch vụ công Quốc gia",
        url: "https://vpcp.dichvucong.gov.vn/p/home/dvc-tthc-thu-tuc-hanh-chinh-chi-tiet.html?ma_thu_tuc=424400",
      },
      {
        title: "Thủ tục cấp Giấy chứng nhận đủ điều kiện cơ sở nghiên cứu, chế tạo, sản xuất, sửa chữa, bảo dưỡng, thử nghiệm UAV",
        agency: "Cổng Dịch vụ công Quốc gia",
        url: "https://vpcp.dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-nganh-doc.html?ma_thu_tuc=1.014683",
      },
    ],
  },
  {
    groupName: "Nhập khẩu",
    icon: Download,
    docs: [
      {
        title: "Thủ tục chấp thuận điều kiện nhập khẩu tàu bay không người lái và phương tiện bay khác",
        agency: "Cổng Dịch vụ công Quốc gia",
        url: "https://dichvucong.gov.vn/p/home/dvc-tthc-thu-tuc-hanh-chinh-chi-tiet.html?ma_thu_tuc=424493",
      },
    ],
  },
  {
    groupName: "Cơ sở thử nghiệm / sản xuất / bảo dưỡng",
    icon: Wrench,
    docs: [
      {
        title: "Thủ tục cấp phép cơ sở thử nghiệm tàu bay không người lái và thiết bị của tàu bay không người lái",
        agency: "Cổng Dịch vụ công Quốc gia",
        url: "https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-nganh-doc.html?ma_thu_tuc=1.008278",
      },
      {
        title: "Thủ tục cấp đổi giấy phép cơ sở thiết kế, sản xuất, sửa chữa, bảo dưỡng, thử nghiệm UAV",
        agency: "Cổng Dịch vụ công Quốc gia",
        url: "https://dichvucong.gov.vn/p/home/dvc-tthc-thu-tuc-hanh-chinh-chi-tiet.html?ma_thu_tuc=227137",
      },
      {
        title: "Thủ tục cấp lại giấy phép cơ sở thiết kế, sản xuất, sửa chữa, bảo dưỡng, thử nghiệm UAV",
        agency: "Cổng Dịch vụ công Quốc gia",
        url: "https://dichvucong.gov.vn/p/home/dvc-tthc-thu-tuc-hanh-chinh-chi-tiet.html?ma_thu_tuc=227157",
      },
    ],
  },
  {
    groupName: "Nguồn tổng để tiếp tục rà soát",
    icon: Search,
    docs: [
      {
        title: "Hệ thống văn bản quy phạm pháp luật",
        agency: "Cổng Thông tin điện tử Chính phủ",
        url: "https://vanban.chinhphu.vn/he-thong-van-ban?classid=1&mode=1",
      },
    ],
  },
];

export function LegalDirectoryView() {
  return (
    <div className="space-y-8">
      {/* Official Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs md:text-sm flex items-start gap-3 shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-300">Lưu ý quan trọng:</span> Thông tin lấy từ nguồn chính phủ có thể chưa đầy đủ đối với người đọc nên chỉ dùng để tham khảo. Xin vui lòng đối chiếu văn bản gốc tại cổng thông tin điện tử của Cơ quan Nhà nước.
        </div>
      </div>

      {/* Directory Groups */}
      <div className="space-y-8">
        {LEGAL_GROUPS.map((group, gIdx) => {
          const Icon = group.icon;
          return (
            <div key={gIdx} className="rounded-xl border border-slate-800 bg-[#141A24] p-5 md:p-6 shadow-xl">
              {/* Group Title Header */}
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
                <Icon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
                  {group.groupName}
                </h3>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {group.docs.map((doc, dIdx) => (
                  <div key={dIdx} className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
                    {/* Title – Agency Line */}
                    <div className="text-sm md:text-base font-bold text-white mb-1.5 flex flex-wrap items-center gap-2">
                      <span>{doc.title}</span>
                      <span className="text-slate-400 font-normal">–</span>
                      <span className="text-cyan-400 font-semibold">{doc.agency}</span>
                      {doc.note && (
                        <span className="text-xs font-normal text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                          {doc.note}
                        </span>
                      )}
                    </div>

                    {/* Direct Government URL */}
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-cyan-500" />
                      <span>{doc.url}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
