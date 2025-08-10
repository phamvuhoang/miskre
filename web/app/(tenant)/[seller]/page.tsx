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
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{seller?.name ? `${seller.name}'s Store` : 'Store'}</h1>
          <p className="text-zinc-600">Premium gear for fighters, coaches, and fans</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((p: any) => (
            <ProductCard key={p.id} product={p} subdomain={sub} />
          ))}
        </div>
        {!products?.length && (
          <div className="text-center py-12 text-zinc-500">
            No products available yet.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

