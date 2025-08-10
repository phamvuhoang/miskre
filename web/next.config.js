/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost = '';
try {
  if (supabaseUrl) supabaseHost = new URL(supabaseUrl).hostname;
} catch {}

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    // Allow images from your Supabase storage bucket domain
    remotePatterns: supabaseHost ? [
      {
        protocol: 'https',
        hostname: supabaseHost,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ] : [],
  },
};
module.exports = nextConfig;

