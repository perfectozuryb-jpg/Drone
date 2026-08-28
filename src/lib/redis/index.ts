import Redis from 'ioredis';
import { INITIAL_LEGAL_DOCUMENTS } from './initial-legal-docs';
import { INITIAL_TECH_ARTICLES } from './initial-tech-articles';

// ==========================================
// IN-MEMORY FALLBACK FOR LOCAL DEV WITHOUT REDIS
// ==========================================
class MemoryStore {
  knownUrls = new Set<string>();
  pendingUrls = new Set<string>();
  documents = new Map<string, string>();
  feedArticles = new Map<string, { score: number; json: string }>();

  constructor() {
    this.seed();
  }

  seed() {
    for (const doc of INITIAL_LEGAL_DOCUMENTS) {
      const fullDoc = { ...doc, createdAt: new Date().toISOString() };
      this.knownUrls.add(doc.url);
      this.documents.set(doc.id, JSON.stringify(fullDoc));
    }
    for (const article of INITIAL_TECH_ARTICLES) {
      const score = new Date(article.publishedAt).getTime();
      this.feedArticles.set(article.id, { score, json: JSON.stringify(article) });
    }
  }
}

const memoryStore = new MemoryStore();
let isRedisConnected = false;

const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy() {
      return null;
    },
  });

redis.on('connect', () => { isRedisConnected = true; });
redis.on('error', () => { isRedisConnected = false; });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// ==========================================
// TYPES & KEYS
// ==========================================
export interface LegalDocument {
  id: string;
  url: string;
  title: string;
  docNumber?: string;
  agency?: string;
  abstract?: string;
  category?: string;
  date?: string;
  status: 'pending' | 'published';
  createdAt: string;
}

export interface TechArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  tier: 1 | 2 | 3;
  tag: string;
  publishedAt: string;
  abstract: string;
}

const KEYS = {
  LEGAL_KNOWN: 'legal:known_urls',
  LEGAL_PENDING: 'legal:pending',
  LEGAL_TEMP_SCAN: 'legal:temp_scan',
  LEGAL_DOCS: 'legal:documents',
  TECH_FEED: 'tech:feed',
  TECH_ARTICLE_PREFIX: 'tech:article:',
};

// Seed initial docs & tech articles
export async function seedInitialData() {
  if (!isRedisConnected) {
    memoryStore.seed();
    return;
  }
  try {
    const pipeline = redis.pipeline();
    for (const doc of INITIAL_LEGAL_DOCUMENTS) {
      const fullDoc: LegalDocument = { ...doc, createdAt: new Date().toISOString() };
      pipeline.sadd(KEYS.LEGAL_KNOWN, doc.url);
      pipeline.hset(KEYS.LEGAL_DOCS, doc.id, JSON.stringify(fullDoc));
    }
    for (const article of INITIAL_TECH_ARTICLES) {
      const score = new Date(article.publishedAt).getTime();
      const articleKey = `${KEYS.TECH_ARTICLE_PREFIX}${article.id}`;
      pipeline.setex(articleKey, 604800, JSON.stringify(article));
      pipeline.zadd(KEYS.TECH_FEED, score, article.id);
    }
    await pipeline.exec();
  } catch {
    memoryStore.seed();
  }
}

// Scraped legal URLs processing (SDIFF)
export async function processScrapedLegalUrls(scrapedUrls: string[]) {
  if (scrapedUrls.length === 0) return { newCount: 0, newUrls: [] };

  if (!isRedisConnected) {
    const newUrls = scrapedUrls.filter(url => !memoryStore.knownUrls.has(url));
    newUrls.forEach(url => memoryStore.pendingUrls.add(url));
    return { newCount: newUrls.length, newUrls };
  }

  try {
    await redis.del(KEYS.LEGAL_TEMP_SCAN);
    await redis.sadd(KEYS.LEGAL_TEMP_SCAN, ...scrapedUrls);
    const newUrls = await redis.sdiff(KEYS.LEGAL_TEMP_SCAN, KEYS.LEGAL_KNOWN);
    if (newUrls.length > 0) {
      await redis.sadd(KEYS.LEGAL_PENDING, ...newUrls);
    }
    await redis.del(KEYS.LEGAL_TEMP_SCAN);
    return { newCount: newUrls.length, newUrls };
  } catch {
    const newUrls = scrapedUrls.filter(url => !memoryStore.knownUrls.has(url));
    newUrls.forEach(url => memoryStore.pendingUrls.add(url));
    return { newCount: newUrls.length, newUrls };
  }
}

// Get pending legal URLs
export async function getPendingLegalUrls(): Promise<string[]> {
  if (!isRedisConnected) {
    return Array.from(memoryStore.pendingUrls);
  }
  try {
    return await redis.smembers(KEYS.LEGAL_PENDING);
  } catch {
    return Array.from(memoryStore.pendingUrls);
  }
}

// Publish legal document
export async function publishLegalDocument(doc: Omit<LegalDocument, 'status' | 'createdAt'>) {
  const fullDoc: LegalDocument = {
    ...doc,
    status: 'published',
    createdAt: new Date().toISOString(),
  };

  if (!isRedisConnected) {
    memoryStore.pendingUrls.delete(doc.url);
    memoryStore.knownUrls.add(doc.url);
    memoryStore.documents.set(doc.id, JSON.stringify(fullDoc));
    return fullDoc;
  }

  try {
    const pipeline = redis.pipeline();
    pipeline.srem(KEYS.LEGAL_PENDING, doc.url);
    pipeline.sadd(KEYS.LEGAL_KNOWN, doc.url);
    pipeline.hset(KEYS.LEGAL_DOCS, doc.id, JSON.stringify(fullDoc));
    await pipeline.exec();
    return fullDoc;
  } catch {
    memoryStore.pendingUrls.delete(doc.url);
    memoryStore.knownUrls.add(doc.url);
    memoryStore.documents.set(doc.id, JSON.stringify(fullDoc));
    return fullDoc;
  }
}

// Reject pending URL
export async function rejectPendingLegalUrl(url: string) {
  if (!isRedisConnected) {
    memoryStore.pendingUrls.delete(url);
    return;
  }
  try {
    await redis.srem(KEYS.LEGAL_PENDING, url);
  } catch {
    memoryStore.pendingUrls.delete(url);
  }
}

// Get published legal docs
export async function getPublishedLegalDocuments(): Promise<LegalDocument[]> {
  if (!isRedisConnected) {
    return Array.from(memoryStore.documents.values()).map(str => JSON.parse(str));
  }
  try {
    let rawHash = await redis.hgetall(KEYS.LEGAL_DOCS);
    if (Object.keys(rawHash).length === 0) {
      await seedInitialData();
      rawHash = await redis.hgetall(KEYS.LEGAL_DOCS);
    }
    return Object.values(rawHash).map((item) => JSON.parse(item) as LegalDocument);
  } catch {
    return Array.from(memoryStore.documents.values()).map(str => JSON.parse(str));
  }
}

// Add Tech Article
export async function addTechArticle(article: TechArticle) {
  const articleKey = `${KEYS.TECH_ARTICLE_PREFIX}${article.id}`;
  const score = new Date(article.publishedAt).getTime();

  if (!isRedisConnected) {
    if (memoryStore.feedArticles.has(article.id)) return false;
    memoryStore.feedArticles.set(article.id, { score, json: JSON.stringify(article) });
    return true;
  }

  try {
    const exists = await redis.exists(articleKey);
    if (exists) return false;

    const pipeline = redis.pipeline();
    pipeline.setex(articleKey, 604800, JSON.stringify(article));
    pipeline.zadd(KEYS.TECH_FEED, score, article.id);
    await pipeline.exec();
    return true;
  } catch {
    if (memoryStore.feedArticles.has(article.id)) return false;
    memoryStore.feedArticles.set(article.id, { score, json: JSON.stringify(article) });
    return true;
  }
}

// Get Tech Feed
export async function getTechFeed(limit = 50): Promise<TechArticle[]> {
  if (!isRedisConnected) {
    const sorted = Array.from(memoryStore.feedArticles.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    return sorted.map(item => JSON.parse(item.json));
  }

  try {
    let articleIds = await redis.zrevrange(KEYS.TECH_FEED, 0, limit - 1);
    if (articleIds.length === 0) {
      await seedInitialData();
      articleIds = await redis.zrevrange(KEYS.TECH_FEED, 0, limit - 1);
    }

    const keys = articleIds.map((id) => `${KEYS.TECH_ARTICLE_PREFIX}${id}`);
    const rawArticles = await redis.mget(...keys);

    const articles: TechArticle[] = [];
    const expiredIds: string[] = [];

    rawArticles.forEach((raw, idx) => {
      if (raw) {
        articles.push(JSON.parse(raw) as TechArticle);
      } else {
        expiredIds.push(articleIds[idx]);
      }
    });

    if (expiredIds.length > 0) {
      await redis.zrem(KEYS.TECH_FEED, ...expiredIds);
    }

    return articles;
  } catch {
    const sorted = Array.from(memoryStore.feedArticles.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    return sorted.map(item => JSON.parse(item.json));
  }
}
