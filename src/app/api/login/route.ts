import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookie = cookies();
  const token = req.nextUrl.searchParams.get('token');

  cookie.set('token', token as string, {
    httpOnly: true,
    path: '/',
    maxAge: 31557600000, // esse cookie vai expirar em 1 ano
    secure: true,
    sameSite: 'none',
    priority: 'high',
    // domain: 'pornonly.xyz',
    // maxAge: new Date(Date.now() + 864000000)
  });

  return NextResponse.json({ success: 'user logado.' });
}
