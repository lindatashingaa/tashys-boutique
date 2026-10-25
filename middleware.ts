import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const method = request.method.toUpperCase();
  if (request.nextUrl.pathname.startsWith('/api/') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const origin = request.headers.get('origin');
    try {
      if (!origin || new URL(origin).origin !== request.nextUrl.origin) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
    } catch {
      return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
    }
  }
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };