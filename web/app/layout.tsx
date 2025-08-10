import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MISKRЕ - Lightweight Stores for Fighters',
  description: 'Build and operate lightweight, managed e-commerce stores for fighters, coaches, and gyms. Zero upfront costs, 72-hour launch.',
  keywords: 'fighters, coaches, gyms, e-commerce, branded merchandise, martial arts',
  authors: [{ name: 'MISKRЕ' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}

