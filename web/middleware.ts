import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const host = url.hostname;

  // Skip middleware for admin and dashboard routes
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Get domain from environment variable
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'miskre.com';

  // Check if we're in development/localhost environment
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host.startsWith('localhost:');
  const isVercel = host.endsWith('.vercel.app');

  // For localhost and Vercel, enable subdomain simulation via query parameter or special routing
  if (isLocalhost || isVercel) {
    // Check for subdomain simulation via query parameter: ?subdomain=fighter1
    const subdomainParam = url.searchParams.get('subdomain');
    if (subdomainParam && subdomainParam !== 'www' && subdomainParam !== 'admin' && subdomainParam !== 'api') {
      // Remove the subdomain parameter and rewrite to tenant route
      url.searchParams.delete('subdomain');
      const newUrl = new URL(`/${subdomainParam}${url.pathname}${url.search}`, req.url);
      return NextResponse.rewrite(newUrl);
    }

    // For Vercel preview deployments, check for subdomain in hostname
    if (isVercel) {
      const parts = host.split('.');
      if (parts.length >= 4) { // e.g., fighter1-project-user.vercel.app
        const potentialSubdomain = parts[0].split('-')[0]; // Extract first part before dash
        if (potentialSubdomain && potentialSubdomain !== 'www' && potentialSubdomain !== 'api') {
          return NextResponse.rewrite(new URL(`/${potentialSubdomain}${url.pathname}`, req.url));
        }
      }
    }

    // For localhost, allow normal routing
    return NextResponse.next();
  }

  // Production subdomain routing: name.domain.com → /name
  const parts = host.split('.');
  if (host.endsWith(domain) && parts.length >= 3) {
    const subdomain = parts[0];
    // Skip www and admin subdomains
    if (subdomain === 'www' || subdomain === 'admin' || subdomain === 'api') {
      return NextResponse.next();
    }
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
  }

  // Custom domains: Check if it's a custom domain for a seller
  // For now, we'll let the app handle custom domain resolution
  // In production, you might want to add a database lookup here
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|api|favicon.ico|sitemap.xml|robots.txt).*)'],
};

