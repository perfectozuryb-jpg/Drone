export interface ZeroStorageItem {
  id: string;
  title: string;
  url: string;
  source: string;
  sourceLogo?: string;
  category: 'stem' | 'general';
  categoryLabel: string;
  publishedAt: string;
  abstract: string;
  imageUrl?: string;
}

const DRONE_THUMBNAILS = [
  "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80",
];

function extractXmlTagContent(xmlString: string, tagName: string): string[] {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(xmlString)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function extractSourceUrl(itemXml: string): string | null {
  const match = /<source[^>]+url=["']([^"']+)["']/i.exec(itemXml);
  return match ? match[1] : null;
}

function extractImageFromXml(itemXml: string): string | null {
  const mediaMatch = /<media:content[^>]+url=["']([^"']+)["']/i.exec(itemXml);
  if (mediaMatch) return mediaMatch[1];

  const imgMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(itemXml);
  if (imgMatch) return imgMatch[1];

  return null;
}

function cleanXmlText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function getFaviconUrl(domainOrUrl: string): string {
  try {
    const url = domainOrUrl.startsWith('http') ? domainOrUrl : `https://${domainOrUrl}`;
    const hostname = new URL(url).hostname;
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${hostname}&size=128`;
  } catch {
    return 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=128';
  }
}

// Check if string contains Vietnamese diacritics
function isVietnameseText(text: string): boolean {
  const vnRegex = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  return vnRegex.test(text);
}

// 1. Crawl Google News Live RSS (Advanced Operators: Applications & Technology, Exclusion of Noise/War)
async function fetchGoogleNewsVietnamese(): Promise<ZeroStorageItem[]> {
  try {
    const query = '(drone OR flycam OR UAV) AND ("ứng dụng" OR "nông nghiệp" OR "trắc địa" OR "bản đồ" OR "cứu hộ" OR "kiểm tra" OR "giao hàng" OR "AI") -chiến -quân_sự -tấn_công -rơi';
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=vi&gl=VN&ceid=VN:vi`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];
    const xml = await res.text();
    const itemsXml = extractXmlTagContent(xml, 'item');

    const results: ZeroStorageItem[] = [];

    itemsXml.forEach((itemXml, idx) => {
      const titleRaw = extractXmlTagContent(itemXml, 'title')[0] || '';
      const linkRaw = extractXmlTagContent(itemXml, 'link')[0] || 'https://news.google.com';
      const pubDateRaw = extractXmlTagContent(itemXml, 'pubDate')[0] || new Date().toISOString();
      const sourceRaw = extractXmlTagContent(itemXml, 'source')[0] || 'Báo chí Việt Nam';
      const sourceUrl = extractSourceUrl(itemXml) || linkRaw;
      const extractedImg = extractImageFromXml(itemXml);

      const cleanTitle = cleanXmlText(titleRaw).replace(/\s*-\s*[^-]+$/, '');
      const cleanSource = cleanXmlText(sourceRaw);

      // Enforce Vietnamese language check
      if (cleanTitle && (isVietnameseText(cleanTitle) || isVietnameseText(cleanSource))) {
        const isStem = /chế tạo|lập trình|mạch|cảm biến|STEM|phòng lab|linh kiện|động cơ/i.test(cleanTitle);

        results.push({
          id: `gnews-vi-${idx}-${Date.now()}`,
          title: cleanTitle,
          url: cleanXmlText(linkRaw),
          source: cleanSource || 'Báo chí Việt Nam',
          sourceLogo: getFaviconUrl(sourceUrl),
          category: isStem ? 'stem' : 'general',
          categoryLabel: isStem ? 'STEM & Chế tạo' : 'Tin tức tổng hợp',
          publishedAt: new Date(pubDateRaw).toISOString(),
          abstract: `Bản tin mới nhất về ứng dụng thực tế & công nghệ drone, flycam từ ${cleanSource || 'báo chí Việt Nam'}.`,
          imageUrl: extractedImg || DRONE_THUMBNAILS[idx % DRONE_THUMBNAILS.length],
        });
      }
    });

    return results;
  } catch (err) {
    console.error('Fetch Google News error:', err);
    return [];
  }
}

// 2. Vietnamese STEM & Tech Articles for STEM category
function getVietnameseStemFeed(): ZeroStorageItem[] {
  const stemArticles = [
    {
      title: "Ứng dụng Drone trong lớp học STEM: Chuyển từ lý thuyết sang thử nghiệm kỹ thuật",
      source: "DroneViet STEM",
      abstract: "Giáo trình hướng dẫn học sinh phổ thông lập trình điều khiển quỹ đạo drone, xử lý tín hiệu cảm biến gia tốc và kiểm tra an toàn bay.",
      url: "/tin-tuc/drone-giao-duc-stem",
    },
    {
      title: "Thiết kế giáo trình drone bài bản từ cấp 1 đến đại học",
      source: "DroneViet STEM",
      abstract: "Lộ trình đào tạo kỹ thuật drone phù hợp từng độ tuổi: từ trải nghiệm an toàn ở tiểu học đến phòng lab AI và tự động hóa ở đại học.",
      url: "/tin-tuc/giao-trinh-drone-theo-cap-hoc",
    },
    {
      title: "Xây dựng phòng Lab nghiên cứu Drone: Cấu hình thiết bị và khung thực hành 2026",
      source: "DroneLab Việt Nam",
      abstract: "Mô hình phòng lab thử nghiệm drone tiêu chuẩn với lồng lưới bảo vệ an toàn, vi xử lý STM32 H7 và hệ thống phân tích Telemetry.",
      url: "/tin-tuc/mo-hinh-phong-lab-drone",
    },
    {
      title: "Kỹ thuật hàn điểm kẽm và đo kiểm dung lượng Pack Pin Li-Ion 21700 cho Drone tự chế",
      source: "Diễn đàn Kỹ thuật Drone VN",
      abstract: "Hướng dẫn đóng pack pin Li-Ion 6S2P đảm bảo dòng xả liên tục 45A cho tác vụ bay quay phim đo đạc địa hình địa lý.",
      url: "/tin-tuc/drone-giao-duc-stem",
    },
    {
      title: "So sánh vi xử lý STM32 H743 vs H750 trong các dự án Drone AI lập trình tự hành",
      source: "Cộng đồng Chế tạo Drone",
      abstract: "Phân tích bộ nhớ Flash 2MB của chip H743 hỗ trợ nạp đồng thời các thuật toán Computer Vision và bộ lọc Kalman nâng cao.",
      url: "/tin-tuc/giao-trinh-drone-theo-cap-hoc",
    }
  ];

  return stemArticles.map((art, idx) => ({
    id: `stem-vn-${idx}`,
    title: art.title,
    url: art.url,
    source: art.source,
    sourceLogo: getFaviconUrl('https://droneviet.vn'),
    category: 'stem',
    categoryLabel: 'STEM & Chế tạo',
    publishedAt: new Date(Date.now() - (idx + 1) * 3600000 * 8).toISOString(),
    abstract: art.abstract,
    imageUrl: DRONE_THUMBNAILS[(idx + 3) % DRONE_THUMBNAILS.length],
  }));
}

// Main Zero-Storage Executable Function
export async function getZeroStorageFeed(options: {
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: ZeroStorageItem[]; hasMore: boolean; total: number }> {
  const category = options.category || 'general';
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit || 9;

  // Fetch 100% Vietnamese Live Google News & STEM content in parallel
  const googleNewsItems = await fetchGoogleNewsVietnamese();
  const stemItems = getVietnameseStemFeed();

  const liveVietnameseItems = [...googleNewsItems, ...stemItems];

  // RAM Shuffle for fresh order on every F5 refresh
  for (let i = liveVietnameseItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [liveVietnameseItems[i], liveVietnameseItems[j]] = [liveVietnameseItems[j], liveVietnameseItems[i]];
  }

  // Filter per requested category
  let allItems: ZeroStorageItem[];
  if (category === 'stem') {
    allItems = liveVietnameseItems.filter((i) => i.category === 'stem');
    if (allItems.length === 0) allItems = stemItems;
  } else {
    // 'general' or any other value
    allItems = liveVietnameseItems.filter((i) => i.category === 'general');
    if (allItems.length === 0) allItems = googleNewsItems;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = allItems.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    hasMore: endIndex < allItems.length,
    total: allItems.length,
  };
}
