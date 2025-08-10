/**
 * Utility functions for handling subdomains in development and production
 */

export function getSubdomainFromHost(host: string): string | null {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'miskre.com';
  
  // Handle localhost development
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return null; // Subdomain routing handled via path in localhost
  }
  
  // Handle Vercel preview deployments
  if (host.endsWith('.vercel.app')) {
    const parts = host.split('.');
    if (parts.length >= 4) {
      const potentialSubdomain = parts[0].split('-')[0];
      if (potentialSubdomain && potentialSubdomain !== 'www' && potentialSubdomain !== 'api') {
        return potentialSubdomain;
      }
    }
    return null;
  }
  
  // Handle production subdomains
  const parts = host.split('.');
  if (host.endsWith(domain) && parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain === 'www' || subdomain === 'admin' || subdomain === 'api') {
      return null;
    }
    return subdomain;
  }
  
  return null;
}

export function buildStoreUrl(subdomain: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'miskre.com';
  
  // For development/localhost, use path routing
  const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
  
  if (isLocalhost) {
    return `${baseUrl}/${subdomain}`;
  }
  
  // For production, use subdomain routing
  return `https://${subdomain}.${domain}`;
}

export function buildDashboardUrl(subdomain: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'miskre.com';
  
  // For development/localhost, use path routing
  const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
  
  if (isLocalhost) {
    return `${baseUrl}/dashboard/${subdomain}`;
  }
  
  // For production, use main domain with path
  return `https://${domain}/dashboard/${subdomain}`;
}

/**
 * Get current subdomain from window location (client-side only)
 */
export function getCurrentSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  
  const host = window.location.hostname;
  return getSubdomainFromHost(host);
}


