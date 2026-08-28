import { NextResponse } from 'next/server';
import { getZeroStorageFeed } from '@/lib/news/zero-storage-crawler';

export const revalidate = 0; // ZERO caching - 100% In-RAM Execution on every F5 refresh!

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);

    const result = await getZeroStorageFeed({
      category,
      page,
      limit,
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
        page,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('API Zero-Storage Feed Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
