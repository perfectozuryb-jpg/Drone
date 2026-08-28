import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import crypto from 'crypto';
import { addTechArticle, TechArticle } from '@/lib/redis';

const parser = new Parser();

const TECH_SOURCES = [
  { url: 'https://github.com/betaflight/betaflight/releases.atom', tier: 1, source: 'Betaflight' },
  { url: 'https://github.com/iNavFlight/inav/releases.atom', tier: 1, source: 'INAV' },
  { url: 'https://github.com/ArduPilot/ardupilot/releases.atom', tier: 1, source: 'ArduPilot' },
  { url: 'https://www.reddit.com/r/fpv/top.rss?t=day', tier: 3, source: 'r/fpv' }
];

const KEYWORDS = ['gps', 'esc', 'fc', 'pid', 'firmware', 'payload', 'gimbal', 'release', 'fix', 'bug', 'motor', 'vtx', 'rx', 'receiver'];

function generateMD5(input: string) {
  return crypto.createHash('md5').update(input).digest('hex');
}

export async function GET(request: Request) {
  try {
    let addedCount = 0;

    for (const feedSource of TECH_SOURCES) {
      try {
        const feed = await parser.parseURL(feedSource.url);
        
        for (const item of feed.items) {
          const title = item.title || '';
          const abstract = item.contentSnippet || item.content || '';
          
          const textToSearch = (title + ' ' + abstract).toLowerCase();
          const hasKeyword = KEYWORDS.some(kw => textToSearch.includes(kw));

          if (feedSource.tier === 1 || hasKeyword) {
            const article: TechArticle = {
              id: generateMD5(item.link || item.guid || title),
              title,
              url: item.link || '',
              source: feedSource.source,
              tier: feedSource.tier as 1 | 2 | 3,
              tag: feedSource.tier === 1 ? 'Firmware' : feedSource.tier === 2 ? 'Industry' : 'Community',
              publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
              abstract: abstract.substring(0, 150) + (abstract.length > 150 ? '...' : '')
            };

            // Gọi helper thực hiện EXISTS -> SETEX (7 ngày) -> ZADD
            const wasAdded = await addTechArticle(article);
            if (wasAdded) addedCount++;
          }
        }
      } catch (err) {
        console.error(`Error parsing RSS ${feedSource.url}:`, err);
      }
    }

    return NextResponse.json({ success: true, addedCount });
  } catch (error) {
    console.error('Fetch Tech Feed Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
