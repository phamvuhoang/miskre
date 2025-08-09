import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const host = url.hostname;
  // Allow local and Vercel preview hosts through
  if (host === 'localhost' || host.endsWith('.vercel.app')) {
    return NextResponse.next();
  }
  // Subdomain routing: name.miskre.com → /name
  const parts = host.split('.');
  if (host.endsWith('miskre.com') && parts.length >= 3) {
    const subdomain = parts[0];
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
  }
  // Custom domains: let app handle in routes (avoid DB calls in Edge middleware)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|api/health|favicon.ico|sitemap.xml|robots.txt).*)'],
};

