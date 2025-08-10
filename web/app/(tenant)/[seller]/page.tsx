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
        <section className="relative py-16 lg:py-24" style={{
          background: seller?.colors?.primary ?
            `linear-gradient(135deg, ${seller.colors.primary}15 0%, ${seller.colors.accent || '#ef4444'}10 100%)` :
            'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
        }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {seller?.logo_url && (
                <div className="mb-8">
                  <Image
                    src={seller.logo_url}
                    alt={`${seller.name} logo`}
                    className="w-24 h-24 lg:w-32 lg:h-32 mx-auto object-contain rounded-lg"
                    width={128}
                    height={128}
                  />
                </div>
              )}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{
                color: seller?.colors?.primary || '#111827'
              }}>
                {seller?.name ? `${seller.name}&apos;s Store` : 'Store'}
              </h1>

              <p className="text-xl lg:text-2xl text-zinc-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                {heroPhrase}
              </p>

              {seller?.phrases && seller.phrases.length > 1 && (
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {seller.phrases.slice(1).map((phrase : string, index : number) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium border"
                      style={{
                        backgroundColor: seller.colors?.accent ? `${seller.colors.accent}20` : '#fef2f2',
                        borderColor: seller.colors?.accent || '#ef4444',
                        color: seller.colors?.accent || '#ef4444'
                      }}
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {products && products.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: seller?.colors?.primary || '#111827' }}>
                  Featured Products
                </h2>
                <p className="text-zinc-600">
                  Premium gear designed for champions
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} subdomain={sub} seller={seller} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 sm:py-24">
              <div className="mx-auto max-w-md">
                <div
                  className="mx-auto h-16 w-16 mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: seller?.colors?.primary ? `${seller.colors.primary}20` : '#f3f4f6' }}
                >
                  <svg
                    className="h-8 w-8"
                    style={{ color: seller?.colors?.primary || '#9ca3af' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2" style={{ color: seller?.colors?.primary || '#111827' }}>
                  New Products Coming Soon
                </h2>
                <p className="text-zinc-600 mb-6">
                  We&apos;re preparing an exclusive collection just for you. Check back soon!
                </p>
                {seller?.phrases?.[0] && (
                  <p className="text-sm font-medium" style={{ color: seller?.colors?.accent || '#ef4444' }}>
                    {seller.phrases[0]}
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
        <Footer seller={seller} />
      </div>
    </ThemeProvider>
  );
}

