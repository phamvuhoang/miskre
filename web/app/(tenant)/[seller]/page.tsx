import { supabaseServer } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Image from 'next/image';

export default async function Storefront({ params }: { params: Promise<{ seller: string }> }) {
  const supabase = supabaseServer();
  const { seller: sub } = await params;
  const { data: seller } = await supabase.from('sellers').select('*').eq('subdomain', sub).maybeSingle();
  type ProductSummary = { id: string; name: string; price: number; image_urls?: string[] };
  const { data: products } = seller
    ? await supabase.from('products').select('*').eq('seller_id', seller.id)
    : { data: [] as ProductSummary[] } as { data: ProductSummary[] };

  // Theme is applied via ThemeProvider and seller colors
  const heroPhrase = seller?.phrases?.[0] || "Premium gear for fighters, coaches, and fans";

  return (
    <ThemeProvider seller={seller}>
      <div className="min-h-screen flex flex-col">
        <Header storeName={seller?.name} subdomain={sub} seller={seller} />

        {/* Hero Section with Seller Branding */}
        <section className="relative py-20 lg:py-32 overflow-hidden" style={{
          background: seller?.colors?.primary ?
            `linear-gradient(135deg, ${seller.colors.primary}08 0%, ${seller.colors.accent || '#ef4444'}05 100%)` :
            'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
        }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, ${seller?.colors?.primary || '#111827'} 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-5xl mx-auto">
              {seller?.logo_url && (
                <div className="mb-12 animate-fade-in">
                  <div className="relative inline-block">
                    <Image
                      src={seller.logo_url}
                      alt={`${seller.name} logo`}
                      className="w-28 h-28 lg:w-40 lg:h-40 mx-auto object-contain drop-shadow-lg"
                      width={160}
                      height={160}
                      priority
                    />
                    {/* Subtle glow effect */}
                    <div
                      className="absolute inset-0 rounded-full blur-xl opacity-20 -z-10"
                      style={{ backgroundColor: seller?.colors?.accent || '#ef4444' }}
                    ></div>
                  </div>
                </div>
              )}

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 tracking-tight leading-none" style={{
                color: seller?.colors?.primary || '#111827'
              }}>
                {seller?.name ? (
                  <>
                    <span className="block">{seller.name}</span>
                    <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 opacity-80">
                      Official Store
                    </span>
                  </>
                ) : (
                  'Store'
                )}
              </h1>

              <p className="text-xl lg:text-3xl text-zinc-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                {heroPhrase}
              </p>

              {seller?.phrases && seller.phrases.length > 1 && (
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {seller.phrases.slice(1).map((phrase : string, index : number) => (
                    <span
                      key={index}
                      className="px-6 py-3 rounded-full text-base font-bold border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: seller.colors?.accent ? `${seller.colors.accent}15` : '#fef2f2',
                        borderColor: seller.colors?.accent || '#ef4444',
                        color: seller.colors?.accent || '#ef4444'
                      }}
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              )}

              {/* Call to Action */}
              {products && products.length > 0 && (
                <div className="mt-16">
                  <a
                    href="#products"
                    className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2"
                    style={{
                      backgroundColor: seller?.colors?.accent || '#ef4444',
                      color: seller?.colors?.accent ? (seller.colors.accent === '#ffffff' || seller.colors.accent === '#fff' ? '#000000' : '#ffffff') : '#ffffff',
                      '--tw-ring-color': seller?.colors?.accent || '#ef4444'
                    } as React.CSSProperties}
                  >
                    Shop Now
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        <main id="products" className="flex-1 container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {products && products.length > 0 ? (
            <>
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight" style={{ color: seller?.colors?.primary || '#111827' }}>
                  Featured Collection
                </h2>
                <p className="text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                  Premium gear designed for champions. Built to perform, made to last.
                </p>
                <div className="mt-8 w-24 h-1 mx-auto rounded-full" style={{
                  backgroundColor: seller?.colors?.accent || '#ef4444'
                }}></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} subdomain={sub} seller={seller} />
                ))}
              </div>

              {/* Additional CTA Section */}
              <div className="mt-20 text-center">
                <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 rounded-3xl p-12 lg:p-16">
                  <h3 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: seller?.colors?.primary || '#111827' }}>
                    Join the Community
                  </h3>
                  <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
                    Get exclusive access to new drops, training tips, and community events.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      className="px-8 py-4 font-bold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2"
                      style={{
                        backgroundColor: seller?.colors?.accent || '#ef4444',
                        color: '#ffffff',
                        '--tw-ring-color': seller?.colors?.accent || '#ef4444'
                      } as React.CSSProperties}
                    >
                      Follow on Instagram
                    </button>
                    <button
                      className="px-8 py-4 font-bold rounded-full border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2"
                      style={{
                        borderColor: seller?.colors?.primary || '#111827',
                        color: seller?.colors?.primary || '#111827',
                        '--tw-ring-color': seller?.colors?.primary || '#111827'
                      } as React.CSSProperties}
                    >
                      Join Newsletter
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-24 sm:py-32">
              <div className="mx-auto max-w-2xl">
                <div className="relative mb-12">
                  <div
                    className="mx-auto h-32 w-32 mb-8 rounded-full flex items-center justify-center shadow-2xl"
                    style={{
                      backgroundColor: seller?.colors?.primary || '#111827',
                      background: `linear-gradient(135deg, ${seller?.colors?.primary || '#111827'} 0%, ${seller?.colors?.accent || '#ef4444'} 100%)`
                    }}
                  >
                    <svg
                      className="h-16 w-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  {/* Animated rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-40 h-40 rounded-full border-4 opacity-20 animate-ping"
                      style={{ borderColor: seller?.colors?.accent || '#ef4444' }}
                    ></div>
                  </div>
                </div>

                <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight" style={{ color: seller?.colors?.primary || '#111827' }}>
                  Something Epic is Coming
                </h2>
                <p className="text-xl text-zinc-600 mb-8 leading-relaxed">
                  We&apos;re crafting an exclusive collection that will elevate your game.
                  Be the first to know when we drop.
                </p>

                {seller?.phrases?.[0] && (
                  <div className="mb-12">
                    <p className="text-lg font-bold px-6 py-3 rounded-full inline-block" style={{
                      color: seller?.colors?.accent || '#ef4444',
                      backgroundColor: seller?.colors?.accent ? `${seller.colors.accent}15` : '#fef2f2'
                    }}>
                      {seller.phrases[0]}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="px-8 py-4 font-bold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2"
                    style={{
                      backgroundColor: seller?.colors?.accent || '#ef4444',
                      color: '#ffffff',
                      '--tw-ring-color': seller?.colors?.accent || '#ef4444'
                    } as React.CSSProperties}
                  >
                    Notify Me When Available
                  </button>
                  <button
                    className="px-8 py-4 font-bold rounded-full border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2"
                    style={{
                      borderColor: seller?.colors?.primary || '#111827',
                      color: seller?.colors?.primary || '#111827',
                      '--tw-ring-color': seller?.colors?.primary || '#111827'
                    } as React.CSSProperties}
                  >
                    Follow for Updates
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer seller={seller} />
      </div>
    </ThemeProvider>
  );
}

