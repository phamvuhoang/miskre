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
};

export function ProductCard({ product, subdomain }: Props) {
  function handleClick() {
    trackEvent('view_product', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      subdomain
    });
  }

  return (
    <Link href={`/${subdomain}/product/${product.id}`} className="block group" onClick={handleClick}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-zinc-100 relative overflow-hidden">
          {product.image_urls?.[0] ? (
            <img
              src={product.image_urls[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
          <div className="text-xl font-bold">${product.price}</div>
        </div>
      </Card>
    </Link>
  );
}
