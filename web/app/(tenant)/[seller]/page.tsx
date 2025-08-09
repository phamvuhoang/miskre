import { supabaseServer } from '@/lib/supabase/server';

export default async function Storefront({ params }: any) {
  const supabase = supabaseServer();
  const sub = params?.seller as string;
  const { data: seller } = await supabase.from('sellers').select('*').eq('subdomain', sub).maybeSingle();
  const { data: products } = seller
    ? await supabase.from('products').select('*').eq('seller_id', seller.id)
    : { data: [] as any } as any;
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{seller?.name ? `${seller.name}'s Store` : 'Store'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products?.map((p: any) => (
          <div key={p.id} className="border p-4 rounded">
            <div className="text-lg font-semibold">{p.name}</div>
            <div>${'{'}p.price{'}'}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

