import { NextResponse } from 'next/server';

export function middleware(request) {
  // هذا الكود بسيط للفهم، في الأنظمة المعقدة نستخدم Token
  const isAdmin = request.cookies.get('isAdmin');

  if (request.nextUrl.pathname.startsWith('/security')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}
