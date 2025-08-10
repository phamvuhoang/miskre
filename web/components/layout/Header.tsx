'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CartManager } from '@/lib/cart';

type Props = {
  storeName?: string;
  subdomain?: string;
};

export function Header({ storeName, subdomain }: Props) {
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

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={subdomain ? `/${subdomain}` : '/'} className="text-xl font-bold">
          {storeName || 'MISKRE'}
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href={subdomain ? `/${subdomain}` : '/'} className="text-sm hover:text-zinc-600">
            Store
          </Link>
          <Link href="#" className="text-sm hover:text-zinc-600">
            About
          </Link>
          <Link href="#" className="text-sm hover:text-zinc-600">
            FAQ
          </Link>
          {subdomain && (
            <Link
              href={`/${subdomain}/cart`}
              className="relative text-sm hover:text-zinc-600 flex items-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
