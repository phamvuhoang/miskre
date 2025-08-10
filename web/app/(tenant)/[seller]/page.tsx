import { supabaseServer } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/commerce/ProductCard';

export default async function Storefront({ params }: { params: Promise<{ seller: string }> }) {
  const supabase = supabaseServer();
  const { seller: sub } = await params;
  const { data: seller } = await supabase.from('sellers').select('*').eq('subdomain', sub).maybeSingle();
  const { data: products } = seller
    ? await supabase.from('products').select('*').eq('seller_id', seller.id)
    : { data: [] as any } as any;
  return (
    <div className="min-h-screen flex flex-col">
      <Header storeName={seller?.name} subdomain={sub} />
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-zinc-900">
            {seller?.name ? `${seller.name}'s Store` : 'Store'}
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl">
            Premium gear for fighters, coaches, and fans
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} subdomain={sub} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-16 w-16 text-zinc-400 mb-4"
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
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                No products available yet
              </h2>
              <p className="text-zinc-600">
                Check back soon for new arrivals and exclusive drops.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

