import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

function timingSafeCheck(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function POST(request: Request) {
  try {
    const { passphrase } = await request.json();
    const adminSecret = process.env.ADMIN_SECRET_KEY || 'droneviet_admin_secret_2026';

    if (typeof passphrase !== 'string' || !timingSafeCheck(passphrase, adminSecret)) {
      return NextResponse.json({ error: 'Secret Key không chính xác' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    
    // Đặt HttpOnly cookie chứa token xác thực đơn giản
    response.cookies.set('drone_admin_session', adminSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
