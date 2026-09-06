export interface ZeroStorageItem {
  id: string;
  title: string;
  url: string;
  source: string;
  sourceLogo?: string;
  category: 'stem' | 'general';
  categoryLabel: string;
  topic?: string;
  topicLabel?: string;
  publishedAt: string;
  relativeTime?: string;
  isFresh?: boolean;
  abstract: string;
  imageUrl?: string;
  hasSourceImage?: boolean;
}

const THEME_IMAGES: Record<string, string[]> = {
  agriculture: [
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80',
  ],
  rescue: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
  ],
  regulation: [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
  ],
  product: [
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506947411487-a56738267384?w=800&auto=format&fit=crop&q=80',
  ],
  ai_autonomous: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  ],
  stem_tech: [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
  ],
  general: [
    'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  ],
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function decodeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function extractTag(xml: string, tag: string): string {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml);
  return m ? m[1] : '';
}

function extractDirectUrl(bingLink: string): string {
  const match = bingLink.match(/url=([^&]+)/);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return bingLink;
    }
  }
  return bingLink;
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

function computeRelativeTime(dateStr: string, now: number): { relativeTime: string; isFresh: boolean } {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return { relativeTime: 'Mới nhất', isFresh: false };
    }
    const diffMs = now - date.getTime();

    if (diffMs < 0 || diffMs < 5 * 60 * 1000) {
      return { relativeTime: 'Vừa xong', isFresh: true };
    }
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 60) {
      return { relativeTime: `${minutes} phút trước`, isFresh: true };
    }
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 24) {
      return { relativeTime: `${hours} giờ trước`, isFresh: true };
    }
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days === 1) {
      return { relativeTime: 'Hôm qua', isFresh: true };
    }
    if (days < 7) {
      return { relativeTime: `${days} ngày trước`, isFresh: false };
    }
    return {
      relativeTime: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      isFresh: false,
    };
  } catch {
    return { relativeTime: 'Mới nhất', isFresh: false };
  }
}

function analyzeArticle(title: string, source: string, snippet?: string): {
  topic: string;
  topicLabel: string;
  abstract: string;
  category: 'stem' | 'general';
  categoryLabel: string;
  theme: keyof typeof THEME_IMAGES;
} {
  const t = (title + ' ' + (snippet || '')).toLowerCase();

  if (/lập trình|chế tạo|stm32|mạch|cảm biến|kalman|esc|fc|hàn điểm|pin li-ion|phòng lab|stem|động cơ brushless|giáo trình|học sinh/i.test(t)) {
    return {
      topic: 'stem',
      topicLabel: 'STEM & Kỹ thuật',
      abstract: snippet && snippet.length > 30 ? snippet : `Tài liệu và hướng dẫn kỹ thuật chuyên sâu về chế tạo, thử nghiệm mạch điều khiển và đào tạo drone từ ${source || 'DroneLab'}.`,
      category: 'stem',
      categoryLabel: 'STEM & Chế tạo',
      theme: 'stem_tech',
    };
  }

  if (/cấm bay|phạm vi|sân bay|nội bài|tân sơn nhất|cát bi|an toàn bay|nghị định|giấy phép|xử phạt|pháp luật|không phận|quản lý|vi phạm quy định/i.test(t)) {
    return {
      topic: 'regulation',
      topicLabel: 'Quy chế & An toàn',
      abstract: snippet && snippet.length > 30 ? snippet : `Thông tin cập nhật về phạm vi quản lý không phận, tọa độ an toàn bay và quy định cấp phép phương tiện bay theo ${source || 'thông báo chính thức'}.`,
      category: 'general',
      categoryLabel: 'Quy chế & An toàn',
      theme: 'regulation',
    };
  }

  if (/nông nghiệp|nông trại|phun thuốc|mùa màng|lúa|phân bón|cây trồng|nông dân/i.test(t)) {
    return {
      topic: 'agriculture',
      topicLabel: 'Nông nghiệp thông minh',
      abstract: snippet && snippet.length > 30 ? snippet : `Ứng dụng thiết bị bay không người lái trong nông nghiệp chính xác, hỗ trợ giám sát cây trồng và nâng cao hiệu quả canh tác (${source || 'Bản tin Nông nghiệp'}).`,
      category: 'general',
      categoryLabel: 'Nông nghiệp chính xác',
      theme: 'agriculture',
    };
  }

  if (/cứu hộ|cứu nạn|dưới nước|khẩn cấp|chữa cháy|tìm kiếm|thiên tai|phòng cháy/i.test(t)) {
    return {
      topic: 'rescue',
      topicLabel: 'Cứu hộ & Giám sát',
      abstract: snippet && snippet.length > 30 ? snippet : `Bước đột phá trong triển khai thiết bị bay tìm kiếm cứu nạn, cứu hộ khẩn cấp và giám sát hiện trường địa bàn phức tạp từ ${source || 'nguồn tin'}.`,
      category: 'general',
      categoryLabel: 'Cứu hộ & Đời sống',
      theme: 'rescue',
    };
  }

  if (/ra mắt|dji|osmo|camera|gimbal|8k|cảm biến|truyền hình ảnh|pin|phần cứng|thế hệ mới|fpv|interceptor/i.test(t)) {
    return {
      topic: 'product',
      topicLabel: 'Thiết bị & Công nghệ',
      abstract: snippet && snippet.length > 30 ? snippet : `Thông tin công nghệ và thông số cấu hình phần cứng mới nhất: cảm biến, hệ thống truyền dẫn và tính năng ghi hình từ ${source || 'công nghệ drone'}.`,
      category: 'general',
      categoryLabel: 'Thiết bị & Sản phẩm',
      theme: 'product',
    };
  }

  if (/ai|trí tuệ nhân tạo|tự hành|tự động|giao hàng|logistics|chở hàng/i.test(t)) {
    return {
      topic: 'ai_autonomous',
      topicLabel: 'AI & Tự hành',
      abstract: snippet && snippet.length > 30 ? snippet : `Ứng dụng giải pháp trí tuệ nhân tạo và hệ thống bay tự hành trong tối ưu hóa lộ trình và vận hành thông minh (${source || 'Công nghệ AI'}).`,
      category: 'general',
      categoryLabel: 'AI & Tự hành',
      theme: 'ai_autonomous',
    };
  }

  return {
    topic: 'general',
    topicLabel: 'Tin tức tổng hợp',
    abstract: snippet && snippet.length > 30 ? snippet : `Bản tin thực tế về hoạt động khai thác, kiểm soát và phát triển công nghệ phương tiện bay không người lái từ ${source || 'báo chí Việt Nam'}.`,
    category: 'general',
    categoryLabel: 'Tin tức tổng hợp',
    theme: 'general',
  };
}

// 1. Fetch from Bing News RSS (Contains real article image in <News:Image>)
const BING_QUERIES = [
  'drone flycam Việt Nam',
  'máy bay không người lái',
  'vùng cấm bay drone sân bay',
  'DJI flycam camera drone',
  'nông nghiệp máy bay không người lái',
  'cứu hộ drone flycam',
];

async function fetchBingNews(query: string, now: number): Promise<ZeroStorageItem[]> {
  try {
    const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&cc=vn`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: controller.signal,
      next: { revalidate: 0 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

    const results: ZeroStorageItem[] = [];

    for (const it of items) {
      const rawTitle = extractTag(it, 'title');
      const rawDesc = extractTag(it, 'description');
      const rawLink = extractTag(it, 'link');
      const rawSource = extractTag(it, 'News:Source') || 'Báo chí';
      const pubDate = extractTag(it, 'pubDate') || new Date(now).toISOString();

      // Extract real image from <News:Image>
      let rawImg = extractTag(it, 'News:Image');
      if (!rawImg) {
        const m = it.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (m) rawImg = m[1];
      }

      const title = decodeHtml(rawTitle);
      const source = decodeHtml(rawSource).replace(/\s+on\s+MSN$/i, '');
      const snippet = decodeHtml(rawDesc);
      const directUrl = extractDirectUrl(rawLink);

      if (!title) continue;

      const analysis = analyzeArticle(title, source, snippet);
      const timeInfo = computeRelativeTime(pubDate, now);

      let imageUrl = rawImg ? decodeHtml(rawImg).replace(/^http:\/\//, 'https://') : undefined;
      const hasSourceImage = !!imageUrl;

      if (imageUrl && imageUrl.includes('bing.com/th?id=')) {
        imageUrl += '&w=800&h=450&c=7&rs=1&p=0';
      } else if (!imageUrl) {
        const themeList = THEME_IMAGES[analysis.theme] || THEME_IMAGES.general;
        imageUrl = themeList[Math.abs(hashString(title)) % themeList.length];
      }

      results.push({
        id: `bing-${Math.abs(hashString(title))}`,
        title,
        url: directUrl,
        source: source || 'Báo chí Việt Nam',
        sourceLogo: getFaviconUrl(directUrl),
        category: analysis.category,
        categoryLabel: analysis.categoryLabel,
        topic: analysis.topic,
        topicLabel: analysis.topicLabel,
        publishedAt: new Date(pubDate).toISOString(),
        relativeTime: timeInfo.relativeTime,
        isFresh: timeInfo.isFresh,
        abstract: analysis.abstract,
        imageUrl,
        hasSourceImage,
      });
    }

    return results;
  } catch {
    return [];
  }
}

// 2. Fetch from direct RSS feeds (VnExpress, Tuổi Trẻ, Dân Trí, VietnamNet, DroneDJ)
const DIRECT_FEEDS = [
  { source: 'VnExpress', url: 'https://vnexpress.net/rss/so-hoa.rss' },
  { source: 'VnExpress', url: 'https://vnexpress.net/rss/thoi-su.rss' },
  { source: 'Tuổi Trẻ', url: 'https://tuoitre.vn/rss/nhip-song-so.rss' },
  { source: 'Tuổi Trẻ', url: 'https://tuoitre.vn/rss/thoi-su.rss' },
  { source: 'VietnamNet', url: 'https://vietnamnet.vn/rss/cong-nghe.rss' },
  { source: 'VietnamNet', url: 'https://vietnamnet.vn/rss/thoi-su.rss' },
  { source: 'Dân Trí', url: 'https://dantri.com.vn/rss/suc-manh-so.rss' },
  { source: 'DroneDJ', url: 'https://dronedj.com/feed/' },
];

async function fetchDirectFeed(feed: { source: string; url: string }, now: number): Promise<ZeroStorageItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: controller.signal,
      next: { revalidate: 0 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

    const results: ZeroStorageItem[] = [];

    for (const it of items) {
      const rawTitle = extractTag(it, 'title');
      const rawDesc = extractTag(it, 'description');
      const rawLink = extractTag(it, 'link');
      const pubDate = extractTag(it, 'pubDate') || new Date(now).toISOString();

      const imgMatch =
        it.match(/<img[^>]+src=["']([^"']+)["']/i) ||
        it.match(/<enclosure[^>]+url=["']([^"']+)["']/i) ||
        it.match(/<media:content[^>]+url=["']([^"']+)["']/i);
      const rawImg = imgMatch ? imgMatch[1] : undefined;

      const title = decodeHtml(rawTitle);
      const snippet = decodeHtml(rawDesc);
      const fullText = (title + ' ' + snippet).toLowerCase();

      // Check for drone / flycam relevance
      const isRelevant = /drone|flycam|uav|thiết bị bay|tàu bay không người lái|máy bay không người lái|vùng cấm bay|an toàn bay|cấp phép bay|dji|fpv|quadcopter/i.test(
        fullText
      );

      if (!isRelevant || !title) continue;

      const analysis = analyzeArticle(title, feed.source, snippet);
      const timeInfo = computeRelativeTime(pubDate, now);

      let imageUrl = rawImg ? decodeHtml(rawImg).replace(/^http:\/\//, 'https://') : undefined;
      const hasSourceImage = !!imageUrl;

      if (!imageUrl) {
        const themeList = THEME_IMAGES[analysis.theme] || THEME_IMAGES.general;
        imageUrl = themeList[Math.abs(hashString(title)) % themeList.length];
      }

      results.push({
        id: `direct-${Math.abs(hashString(title))}`,
        title,
        url: decodeHtml(rawLink),
        source: feed.source,
        sourceLogo: getFaviconUrl(rawLink || feed.url),
        category: analysis.category,
        categoryLabel: analysis.categoryLabel,
        topic: analysis.topic,
        topicLabel: analysis.topicLabel,
        publishedAt: new Date(pubDate).toISOString(),
        relativeTime: timeInfo.relativeTime,
        isFresh: timeInfo.isFresh,
        abstract: analysis.abstract,
        imageUrl,
        hasSourceImage,
      });
    }

    return results;
  } catch {
    return [];
  }
}

// 3. STEM Curated Articles
function getVietnameseStemFeed(now: number): ZeroStorageItem[] {
  const stemArticles = [
    {
      title: 'Ứng dụng Drone trong lớp học STEM: Chuyển từ lý thuyết sang thử nghiệm kỹ thuật',
      source: 'DroneViet STEM',
      abstract:
        'Giáo trình hướng dẫn học sinh phổ thông lập trình điều khiển quỹ đạo drone, xử lý tín hiệu cảm biến gia tốc và kiểm tra an toàn bay.',
      url: '/tin-tuc/drone-giao-duc-stem',
      topic: 'stem',
      topicLabel: 'STEM & Kỹ thuật',
    },
    {
      title: 'Thiết kế giáo trình drone bài bản từ cấp 1 đến đại học',
      source: 'DroneViet STEM',
      abstract:
        'Lộ trình đào tạo kỹ thuật drone phù hợp từng độ tuổi: từ trải nghiệm an toàn ở tiểu học đến phòng lab AI và tự động hóa ở đại học.',
      url: '/tin-tuc/giao-trinh-drone-theo-cap-hoc',
      topic: 'stem',
      topicLabel: 'STEM & Kỹ thuật',
    },
    {
      title: 'Xây dựng phòng Lab nghiên cứu Drone: Cấu hình thiết bị và khung thực hành 2026',
      source: 'DroneLab Việt Nam',
      abstract:
        'Mô hình phòng lab thử nghiệm drone tiêu chuẩn với lồng lưới bảo vệ an toàn, vi xử lý STM32 H7 và hệ thống phân tích Telemetry.',
      url: '/tin-tuc/mo-hinh-phong-lab-drone',
      topic: 'stem',
      topicLabel: 'STEM & Kỹ thuật',
    },
    {
      title: 'Kỹ thuật hàn điểm kẽm và đo kiểm dung lượng Pack Pin Li-Ion 21700 cho Drone tự chế',
      source: 'Diễn đàn Kỹ thuật Drone VN',
      abstract:
        'Hướng dẫn đóng pack pin Li-Ion 6S2P đảm bảo dòng xả liên tục 45A cho tác vụ bay quay phim đo đạc địa hình địa lý.',
      url: '/tin-tuc/drone-giao-duc-stem',
      topic: 'stem',
      topicLabel: 'STEM & Kỹ thuật',
    },
    {
      title: 'So sánh vi xử lý STM32 H743 vs H750 trong các dự án Drone AI lập trình tự hành',
      source: 'Cộng đồng Chế tạo Drone',
      abstract:
        'Phân tích bộ nhớ Flash 2MB của chip H743 hỗ trợ nạp đồng thời các thuật toán Computer Vision và bộ lọc Kalman nâng cao.',
      url: '/tin-tuc/giao-trinh-drone-theo-cap-hoc',
      topic: 'stem',
      topicLabel: 'STEM & Kỹ thuật',
    },
  ];

  return stemArticles.map((art, idx) => {
    const pubDate = new Date(now - (idx + 1) * 3600000 * 8).toISOString();
    const timeInfo = computeRelativeTime(pubDate, now);
    return {
      id: `stem-vn-${idx}`,
      title: art.title,
      url: art.url,
      source: art.source,
      sourceLogo: getFaviconUrl('https://droneviet.vn'),
      category: 'stem',
      categoryLabel: 'STEM & Chế tạo',
      topic: art.topic,
      topicLabel: art.topicLabel,
      publishedAt: pubDate,
      relativeTime: timeInfo.relativeTime,
      isFresh: timeInfo.isFresh,
      abstract: art.abstract,
      imageUrl: THEME_IMAGES.stem_tech[idx % THEME_IMAGES.stem_tech.length],
      hasSourceImage: true,
    };
  });
}

export async function getZeroStorageFeed(options: {
  category?: string;
  page?: number;
  limit?: number;
  topic?: string;
  search?: string;
}): Promise<{
  items: ZeroStorageItem[];
  hasMore: boolean;
  total: number;
  topics: { id: string; label: string; count: number }[];
}> {
  const category = options.category || 'general';
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit || 9;
  const filterTopic = options.topic || 'all';
  const searchQuery = (options.search || '').trim().toLowerCase();
  const now = Date.now();

  // Fetch Bing news + Direct newspaper feeds in parallel
  const [bingResults, directResults] = await Promise.all([
    Promise.all(BING_QUERIES.map((q) => fetchBingNews(q, now))),
    Promise.all(DIRECT_FEEDS.map((f) => fetchDirectFeed(f, now))),
  ]);

  const stemSeed = getVietnameseStemFeed(now);
  const rawPool: ZeroStorageItem[] = [...directResults.flat(), ...bingResults.flat(), ...stemSeed];

  // Deduplicate by URL and normalized title
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const uniqueItems: ZeroStorageItem[] = [];

  for (const item of rawPool) {
    if (seenUrls.has(item.url)) continue;

    const normTitle = item.title
      .toLowerCase()
      .replace(/[^a-z0-9àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s]/g, '')
      .slice(0, 35);

    if (seenTitles.has(normTitle)) continue;

    seenUrls.add(item.url);
    seenTitles.add(normTitle);
    uniqueItems.push(item);
  }

  // Sort Chronologically: NEWEST FIRST!
  // Prioritize articles with genuine source images when within same timeframe
  uniqueItems.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    if (Math.abs(timeA - timeB) < 6 * 3600000) {
      if (a.hasSourceImage && !b.hasSourceImage) return -1;
      if (!a.hasSourceImage && b.hasSourceImage) return 1;
    }
    return timeB - timeA;
  });

  // Filter by requested category
  let categoryFiltered: ZeroStorageItem[];
  if (category === 'stem') {
    categoryFiltered = uniqueItems.filter((i) => i.category === 'stem');
    if (categoryFiltered.length === 0) categoryFiltered = stemSeed;
  } else {
    // general
    categoryFiltered = uniqueItems.filter((i) => i.category === 'general');
    if (categoryFiltered.length === 0) categoryFiltered = uniqueItems;
  }

  // Compute topic breakdown for UI sub-filters
  const topicCounts: Record<string, number> = {};
  categoryFiltered.forEach((item) => {
    const t = item.topic || 'general';
    topicCounts[t] = (topicCounts[t] || 0) + 1;
  });

  const availableTopics = [
    { id: 'all', label: 'Tất cả chủ đề', count: categoryFiltered.length },
    { id: 'regulation', label: 'Quy chế & An toàn bay', count: topicCounts['regulation'] || 0 },
    { id: 'agriculture', label: 'Nông nghiệp & Đời sống', count: topicCounts['agriculture'] || 0 },
    { id: 'product', label: 'Thiết bị & Công nghệ mới', count: topicCounts['product'] || 0 },
    { id: 'rescue', label: 'Cứu hộ & Giám sát', count: topicCounts['rescue'] || 0 },
    { id: 'ai_autonomous', label: 'AI & Tự hành', count: topicCounts['ai_autonomous'] || 0 },
  ].filter((t) => t.id === 'all' || t.count > 0);

  // Apply Sub-filter by topic
  let filteredItems = categoryFiltered;
  if (filterTopic && filterTopic !== 'all') {
    filteredItems = filteredItems.filter((i) => i.topic === filterTopic);
  }

  // Apply Search Query filter
  if (searchQuery) {
    filteredItems = filteredItems.filter(
      (i) =>
        i.title.toLowerCase().includes(searchQuery) ||
        i.abstract.toLowerCase().includes(searchQuery) ||
        i.source.toLowerCase().includes(searchQuery)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    hasMore: endIndex < filteredItems.length,
    total: filteredItems.length,
    topics: availableTopics,
  };
}
