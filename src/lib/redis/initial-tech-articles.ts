export interface InitialTechArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  tier: 1 | 2 | 3;
  tag: 'Firmware' | 'Industry' | 'Community';
  publishedAt: string;
  abstract: string;
}

export const INITIAL_TECH_ARTICLES: InitialTechArticle[] = [
  {
    id: "betaflight-4-5-1",
    title: "Betaflight 4.5.1 Maintenance Release - GPS Rescue & Optical Flow Fixes",
    url: "https://github.com/betaflight/betaflight/releases/tag/4.5.1",
    source: "Betaflight",
    tier: 1,
    tag: "Firmware",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    abstract: "Bản sửa lỗi quan trọng cho tính năng GPS Rescue, khắc phục hiện tượng mất vị trí khi gió mạnh và cải thiện góc nghiêng tự cân bằng cho cảm biến quang học.",
  },
  {
    id: "inav-7-1-2",
    title: "INAV 7.1.2 Official Release: Fixed Wing Navigation & Waypoint Enhancements",
    url: "https://github.com/iNavFlight/inav/releases/tag/7.1.2",
    source: "INAV",
    tier: 1,
    tag: "Firmware",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    abstract: "Cập nhật thuật toán điều hướng cho máy bay cánh bằng, hỗ trợ chuyển điểm bay mượt mà và tối ưu hóa điều khiển ESC DShot trên mạch FC H7.",
  },
  {
    id: "ardupilot-copter-4-5-0",
    title: "ArduPilot Copter 4.5.0 Stable Release with 3D Obstacle Avoidance",
    url: "https://github.com/ArduPilot/ardupilot/releases/tag/Copter-4.5.0",
    source: "ArduPilot",
    tier: 1,
    tag: "Firmware",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    abstract: "Bản phát hành chính thức bổ sung khả năng né tránh vật cản 3D bằng cảm biến Lidar, hỗ trợ giao thức DroneCAN và tối ưu hóa hệ thống ghi Telemetry.",
  },
  {
    id: "expresslrs-3-4-0",
    title: "ExpressLRS v3.4.0 Release: Airport Mode & Gemini Dual-Band Receiver Support",
    url: "https://github.com/ExpressLRS/ExpressLRS/releases/tag/3.4.0",
    source: "ExpressLRS",
    tier: 1,
    tag: "Firmware",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    abstract: "Hỗ trợ chế độ truyền dữ liệu Airport hai chiều, tích hợp bộ thu sóng kép Gemini 2.4GHz/900MHz giúp chống nhiễu vượt trội trong môi trường đô thị.",
  },
  {
    id: "px4-autopilot-v1-14-3",
    title: "PX4 Autopilot v1.14.3: EKF3 State Estimator Stability Updates",
    url: "https://github.com/PX4/PX4-Autopilot/releases/tag/v1.14.3",
    source: "PX4 Autopilot",
    tier: 1,
    tag: "Firmware",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), // 2.5 days ago
    abstract: "Cải thiện độ ổn định bộ ước lượng trạng thái EKF3 khi bay trong môi trường mất tín hiệu GPS tạm thời và nâng cấp hỗ trợ mạch Pixhawk 6X.",
  },
  {
    id: "pid-tuning-betaflight-4-5",
    title: "Hướng dẫn căn chỉnh PID & Feedforward chống Rung Đầu (Prop Wash) trên Betaflight 4.5",
    url: "https://www.reddit.com/r/fpv/comments/1d3456/pid_tuning_guide_betaflight_45/",
    source: "r/fpv",
    tier: 3,
    tag: "Community",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    abstract: "Phân tích chi tiết cách điều chỉnh tham số D-Term Slider, Master Multiplier và Dynamic Idle để loại bỏ hoàn toàn hiện tượng prop wash khi hạ độ cao nhanh.",
  },
  {
    id: "hd-vtx-brownout-troubleshooting",
    title: "Xử lý sự cố nhiễu sóng điện áp thấp (Voltage Drop) trên mạch truyền hình ảnh HD Digital",
    url: "https://www.reddit.com/r/fpv/comments/1e5678/hd_vtx_brownout_troubleshooting/",
    source: "r/fpv",
    tier: 3,
    tag: "Community",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    abstract: "Nguyên nhân và giải pháp gắn Tụ điện Low ESR 35V 1000uF để bảo vệ mạch VTX HD không bị bẻ hình hoặc tắt đột ngột khi thố ga mạnh.",
  },
  {
    id: "ublox-m10-gps-optimization",
    title: "Tăng tốc độ bắt vệ tinh Cold Start cho GPS u-blox M1080 trên mạch điều khiển bay",
    url: "https://www.reddit.com/r/drones/comments/1f8901/ublox_m10_gps_fix_speed_optimization/",
    source: "r/drones",
    tier: 3,
    tag: "Community",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(), // 1.7 days ago
    abstract: "Mẹo nâng cấp Baudrate lên 115200, bật giao thức Galileo & GLONASS đồng thời để rút ngắn thời gian GPS 3D Lock dưới 15 giây.",
  },
  {
    id: "liion-21700-pack-building",
    title: "So sánh hiệu năng Pin LiPo 6S vs Pack Pin Li-Ion 6S2P 21700 cho tác vụ bay đo đạc 45 phút",
    url: "https://www.reddit.com/r/fpv/comments/1g9012/liion_21700_pack_building_for_longrange/",
    source: "r/fpv",
    tier: 3,
    tag: "Community",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(), // ~3 days ago
    abstract: "Đánh giá mật độ năng lượng, nhiệt độ xả liên tục 45A và kỹ thuật hàn điểm kẽm đảm bảo an toàn cho pack pin drone tự chế.",
  }
];
