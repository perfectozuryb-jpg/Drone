import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { passphrase } = await request.json();
    const adminSecret = process.env.ADMIN_SECRET_KEY || 'droneviet_admin_secret_2026';

    if (passphrase !== adminSecret) {
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
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
