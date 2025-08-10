import { supabaseServer } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AddToCartButton } from '@/components/commerce/AddToCartButton';

export default async function PDP({ params }: { params: Promise<{ seller: string; id: string }> }) {
  const supabase = supabaseServer();
  const { seller: sub, id } = await params;
  const { data: product } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  const { data: seller } = await supabase.from('sellers').select('*').eq('subdomain', sub).maybeSingle();

  if (!product) {
    return <main className="p-6">Product not found.</main>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header storeName={seller?.name} subdomain={sub} />
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="order-1">
            <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden shadow-sm">
              {product.image_urls?.[0] ? (
                <img
                  src={product.image_urls[0]}
                  alt={`${product.name} product image`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400" aria-label="No product image available">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="order-2 space-y-6 lg:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-zinc-900">
                {product.name}
              </h1>
              <div className="text-2xl sm:text-3xl font-bold mb-6 text-zinc-900">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </div>
              {product.description && (
                <div className="prose prose-zinc max-w-none">
                  <p className="text-zinc-600 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Product Actions */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
                <button
                  className="underline hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 rounded"
                  aria-label="View size chart"
                >
                  Size Chart
                </button>
                <span className="text-zinc-300">|</span>
                <button
                  className="underline hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 rounded"
                  aria-label="View returns and exchanges policy"
                >
                  Returns & Exchanges
                </button>
              </div>

              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_urls: product.image_urls,
                  seller_id: product.seller_id,
                  sizes: product.sizes
                }}
                subdomain={sub}
              />

              <div className="bg-zinc-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-zinc-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Free shipping on orders over $75</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>30-day returns and exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

