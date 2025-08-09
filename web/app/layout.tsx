import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MISKRE',
  description: 'Lightweight managed stores for fighters, coaches, and gyms',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

