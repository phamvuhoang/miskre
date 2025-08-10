'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { CartManager } from '@/lib/cart';

type Props = {
  storeName?: string;
  subdomain?: string;
  seller?: { name?: string; logo_url?: string; colors?: { primary?: string; secondary?: string; accent?: string } } | null;
};

export function Header({ storeName, subdomain, seller }: Props) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (subdomain) {
      const cartManager = new CartManager(subdomain);
      setCartCount(cartManager.getItemCount());

      // Listen for cart updates
      const handleStorageChange = () => {
        setCartCount(cartManager.getItemCount());
      };

      window.addEventListener('storage', handleStorageChange);

      // Custom event for same-tab cart updates
      window.addEventListener('cartUpdated', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('cartUpdated', handleStorageChange);
      };
    }
  }, [subdomain]);

  const headerStyle = {
    backgroundColor: 'var(--seller-secondary, #ffffff)',
    borderBottomColor: 'rgba(var(--seller-primary-rgb, 17,24,39), 0.12)'
  } as React.CSSProperties;

  const logoTextStyle = {
    color: 'var(--seller-primary, #111827)'
  } as React.CSSProperties;

  return (
    <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm" style={headerStyle}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={subdomain ? `/${subdomain}` : '/'}
          className="flex items-center space-x-3 group focus:outline-none focus:ring-4 focus:ring-offset-2 rounded-lg"
          style={{ '--tw-ring-color': seller?.colors?.primary || '#111827' } as React.CSSProperties}
        >
          {seller?.logo_url && (
            <div className="relative">
              <Image
                src={seller.logo_url}
                alt={`${seller?.name ?? 'Store'} logo`}
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-200"
                width={40}
                height={40}
              />
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200"
                style={{ backgroundColor: seller?.colors?.accent || '#ef4444' }}
              ></div>
            </div>
          )}
          <span className="text-2xl font-black tracking-tight group-hover:opacity-80 transition-opacity" style={logoTextStyle}>
            {storeName || 'MISKRE'}
          </span>
        </Link>

        <nav className="flex items-center space-x-8">
          <Link
            href={subdomain ? `/${subdomain}` : '/'}
            className="text-sm font-bold hover:opacity-70 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-2 py-1"
            style={logoTextStyle}
          >
            Store
          </Link>
          <Link
            href="#"
            className="text-sm font-bold hover:opacity-70 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-2 py-1"
            style={logoTextStyle}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm font-bold hover:opacity-70 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-2 py-1"
            style={logoTextStyle}
          >
            FAQ
          </Link>
          {subdomain && (
            <Link
              href={`/${subdomain}/cart`}
              className="relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2"
              style={{
                backgroundColor: seller?.colors?.accent ? `${seller.colors.accent}15` : '#fef2f2',
                '--tw-ring-color': seller?.colors?.accent || '#ef4444'
              } as React.CSSProperties}
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                style={{ color: seller?.colors?.accent || '#ef4444' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse"
                  style={{ backgroundColor: seller?.colors?.accent || '#ef4444' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
