import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import {
  getPendingLegalUrls,
  getPublishedLegalDocuments,
  publishLegalDocument,
  rejectPendingLegalUrl
} from '@/lib/redis';

async function isAuthorized() {
  const cookieStore = await cookies();
  const session = cookieStore.get('drone_admin_session')?.value;
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'droneviet_admin_secret_2026';
  return session === adminSecret;
}

function generateMD5(input: string) {
  return crypto.createHash('md5').update(input).digest('hex');
}

// GET: Lấy danh sách URL đang pending & các tài liệu đã published từ Redis
export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pendingUrls = await getPendingLegalUrls();
    const publishedDocs = await getPublishedLegalDocuments();

    return NextResponse.json({
      success: true,
      pending: pendingUrls.map(url => ({
        id: generateMD5(url),
        url,
        status: 'pending',
      })),
      published: publishedDocs,
    });
  } catch (error) {
    console.error('API Admin Legal GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Duyệt tài liệu (Publish) hoặc Xóa bỏ (Reject)
export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, title, docNumber, abstract, date, action } = body;

    if (!url || !action) {
      return NextResponse.json({ error: 'Thiếu url hoặc action' }, { status: 400 });
    }

    if (action === 'publish') {
      const docId = generateMD5(url);
      await publishLegalDocument({
        id: docId,
        url,
        title: title || 'Số hiệu chưa xác định',
        docNumber: docNumber || '',
        abstract: abstract || '',
        date: date || new Date().toISOString(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      await rejectPendingLegalUrl(url);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (error) {
    console.error('API Admin Legal POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
