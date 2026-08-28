import { NextResponse } from 'next/server';
import { processScrapedLegalUrls } from '@/lib/redis';

// Whitelist danh sách cổng thông tin pháp lý chính thống
const LEGAL_SOURCES = [
  'https://caa.gov.vn', // Cục Hàng không Việt Nam
  'http://mod.gov.vn', // Bộ Quốc phòng
  'https://chinhphu.vn' // Cổng thông tin điện tử Chính phủ
];

export async function GET(request: Request) {
  try {
    const scrapedUrls: string[] = [];

    // Quét từng cổng thông tin
    for (const sourceUrl of LEGAL_SOURCES) {
      try {
        const res = await fetch(sourceUrl, { next: { revalidate: 3600 } });
        if (!res.ok) continue;

        const html = await res.text();
        
        // Mô phỏng: Quét các thẻ <a> liên quan đến quy định bay / drone / flycam
        const regex = /<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']+)["'][^>]*>(.*?)<\/a>/gi;
        let match;
        
        while ((match = regex.exec(html)) !== null) {
          const url = match[1];
          const text = match[2].replace(/<[^>]+>/g, '').trim().toLowerCase();
          
          if (text.includes('flycam') || text.includes('drone') || text.includes('phương tiện bay') || text.includes('quản lý tàu bay')) {
            scrapedUrls.push(url);
          }
        }
      } catch (err) {
        console.error(`Lỗi khi quét nguồn ${sourceUrl}:`, err);
      }
    }

    // Thực thi lệnh native SDIFF(legal:temp_scan, legal:known_urls) qua helper
    const result = await processScrapedLegalUrls(scrapedUrls);

    return NextResponse.json({
      success: true,
      scrapedTotal: scrapedUrls.length,
      newPendingUrlsCount: result.newCount,
      newUrls: result.newUrls,
    });
  } catch (error) {
    console.error('Fetch Legal Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
