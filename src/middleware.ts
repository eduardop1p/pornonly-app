/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest, res: NextResponse) {
  const response = NextResponse.next();
  const isAuth = req.cookies.has('token');
  const { pathname } = req.nextUrl;
  if (
    isAuth &&
    (pathname.startsWith('/login') || pathname.startsWith('/create-account'))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (
    !isAuth &&
    (pathname.startsWith('/publish-pin') || pathname.startsWith('/user'))
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return response;
}
