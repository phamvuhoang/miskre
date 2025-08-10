import { supabaseServer } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AddToCartButton } from '@/components/commerce/AddToCartButton';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Image from 'next/image';

export default async function PDP({ params }: { params: Promise<{ seller: string; id: string }> }) {
  const supabase = supabaseServer();
  const { seller: sub, id } = await params;
  const { data: product } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  const { data: seller } = await supabase.from('sellers').select('*').eq('subdomain', sub).maybeSingle();

  if (!product) {
    return <main className="p-6">Product not found.</main>;
  }

  return (
    <ThemeProvider seller={seller}>
      <div className="min-h-screen flex flex-col">
        <Header storeName={seller?.name} subdomain={sub} seller={seller} />
        <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="order-1">
              <div className="aspect-square bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-3xl overflow-hidden shadow-2xl relative group">
                {product.image_urls?.[0] ? (
                  <>
                    <Image
                      src={product.image_urls[0]}
                      alt={`${product.name} product image`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={800}
                      height={800}
                      priority={true}
                    />
                    {/* Subtle overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: seller?.colors?.primary || '#9ca3af' }} aria-label="No product image available">
                    <div className="text-center">
                      <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg font-medium">Image Coming Soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="order-2 space-y-8 lg:space-y-10">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight" style={{
                  color: seller?.colors?.primary || '#111827'
                }}>
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-3xl sm:text-4xl font-black" style={{
                    color: seller?.colors?.accent || '#ef4444'
                  }}>
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </div>
                  <div className="px-4 py-2 rounded-full text-sm font-bold" style={{
                    backgroundColor: seller?.colors?.accent ? `${seller.colors.accent}15` : '#fef2f2',
                    color: seller?.colors?.accent || '#ef4444'
                  }}>
                    Premium Quality
                  </div>
                </div>
                {product.description && (
                  <div className="prose prose-zinc max-w-none">
                    <p className="text-zinc-700 text-xl leading-relaxed font-medium">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Product Actions */}
              <div className="space-y-8">
                <div className="flex flex-wrap gap-6 text-base">
                  <button
                    className="font-bold underline hover:opacity-70 transition-opacity focus:outline-none focus:ring-4 focus:ring-offset-2 rounded px-2 py-1"
                    style={{
                      color: seller?.colors?.primary || '#111827',
                      '--tw-ring-color': seller?.colors?.primary || '#111827'
                    } as React.CSSProperties}
                    aria-label="View size chart"
                  >
                    📏 Size Chart
                  </button>
                  <span className="text-zinc-300">•</span>
                  <button
                    className="font-bold underline hover:opacity-70 transition-opacity focus:outline-none focus:ring-4 focus:ring-offset-2 rounded px-2 py-1"
                    style={{
                      color: seller?.colors?.primary || '#111827',
                      '--tw-ring-color': seller?.colors?.primary || '#111827'
                    } as React.CSSProperties}
                    aria-label="View returns and exchanges policy"
                  >
                    🔄 Returns & Exchanges
                  </button>
                </div>

                <div id="purchase">
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
                </div>

                <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 p-6 rounded-2xl border border-zinc-200">
                  <h3 className="font-bold text-lg mb-4" style={{ color: seller?.colors?.primary || '#111827' }}>
                    Why Choose Us?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-zinc-700">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                        backgroundColor: seller?.colors?.accent || '#ef4444'
                      }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <span className="font-medium">Free shipping on orders over $75</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-700">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                        backgroundColor: seller?.colors?.accent || '#ef4444'
                      }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">30-day returns and exchanges</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-700">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                        backgroundColor: seller?.colors?.accent || '#ef4444'
                      }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="font-medium">Premium quality guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </main>
      {/* Sticky mobile CTA bar */}
      <div className="lg:hidden sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-4 shadow-2xl">
        <div className="container flex items-center justify-between">
          <div className="text-left">
            <div className="text-xs text-zinc-500 font-medium">Price</div>
            <div className="font-black text-2xl" style={{ color: seller?.colors?.accent || '#ef4444' }}>
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </div>
          </div>
          <a
            href="#purchase"
            aria-label="Scroll to purchase options"
            className="inline-flex items-center justify-center rounded-full px-8 py-4 font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2"
            style={{
              backgroundColor: seller?.colors?.accent || '#ef4444',
              color: '#ffffff',
              '--tw-ring-color': seller?.colors?.accent || '#ef4444'
            } as React.CSSProperties}
          >
            Add to Cart
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
            </svg>
          </a>
        </div>
      </div>
        <Footer seller={seller} />
      </div>
    </ThemeProvider>
  );
}

