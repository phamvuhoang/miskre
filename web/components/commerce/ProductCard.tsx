'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';

type Product = {
  id: string;
  name: string;
  price: number;
  image_urls?: string[];
};

type Props = {
  product: Product;
  subdomain: string;
  seller?: { colors?: { primary?: string; accent?: string } } | null;
};

export function ProductCard({ product, subdomain, seller }: Props) {
  function handleClick() {
    trackEvent('view_product', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      subdomain
    });
  }

  const cardStyle = seller?.colors?.primary ? {
    '--ring-color': seller.colors.primary
  } as React.CSSProperties : {};

  const priceStyle = seller?.colors?.accent ? {
    color: seller.colors.accent
  } : {};

  return (
    <Link
      href={`/${subdomain}/product/${product.id}`}
      className="block group focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-2xl"
      style={cardStyle}
      onClick={handleClick}
      aria-label={`View ${product.name} - $${product.price}`}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
        <div className="aspect-square bg-gradient-to-br from-zinc-50 to-zinc-100 relative overflow-hidden">
          {product.image_urls?.[0] ? (
            <>
              <Image
                src={product.image_urls[0]}
                alt={`${product.name} product image`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                width={400}
                height={400}
                priority={false}
              />
              {/* Overlay gradient for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Quick view overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div
                  className="px-6 py-3 rounded-full font-bold text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  style={{ backgroundColor: seller?.colors?.accent || '#ef4444' }}
                >
                  Quick View
                </div>
              </div>
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: seller?.colors?.primary || '#9ca3af' }}
              aria-label="No product image available"
            >
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Image Coming Soon</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3
            className="font-bold text-xl mb-3 group-hover:opacity-80 transition-opacity leading-tight"
            style={{ color: seller?.colors?.primary || '#111827' }}
          >
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black" style={priceStyle}>
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: seller?.colors?.accent || '#ef4444' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
