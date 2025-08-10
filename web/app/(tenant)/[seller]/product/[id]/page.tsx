import { supabaseServer } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CodBuyButton } from '@/components/commerce/CodBuyButton';

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
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden">
              {product.image_urls?.[0] ? (
                <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  No Image
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="text-2xl font-bold mb-4">${product.price}</div>
              {product.description && (
                <p className="text-zinc-600 mb-6">{product.description}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-sm text-zinc-600">
                <a href="#" className="underline hover:text-zinc-800">Size Chart</a> |
                <a href="#" className="underline hover:text-zinc-800 ml-1">Returns & Exchanges</a>
              </div>
              <CodBuyButton sellerId={product.seller_id} total={product.price} />
              <div className="text-xs text-zinc-500">
                Free shipping on orders over $75. 30-day returns.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

