'use client';
import Link from 'next/link';
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
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
      style={cardStyle}
      onClick={handleClick}
      aria-label={`View ${product.name} - $${product.price}`}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1">
        <div className="aspect-square bg-zinc-100 relative overflow-hidden">
          {product.image_urls?.[0] ? (
            <img
              src={product.image_urls[0]}
              alt={`${product.name} product image`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={400}
              height={400}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: seller?.colors?.primary || '#9ca3af' }}
              aria-label="No product image available"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-6">
          <h3
            className="font-semibold text-lg mb-2 group-hover:opacity-70 transition-opacity"
            style={{ color: seller?.colors?.primary || '#111827' }}
          >
            {product.name}
          </h3>
          <div className="text-xl font-bold" style={priceStyle}>
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </div>
        </div>
      </Card>
    </Link>
  );
}
