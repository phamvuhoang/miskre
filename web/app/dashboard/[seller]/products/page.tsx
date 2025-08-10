import { supabaseServer } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

type ProductsPageProps = {
  params: Promise<{ seller: string }>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { seller: subdomain } = await params;
  const supabase = supabaseServer();

  // Get seller info
  const { data: seller } = await supabase
    .from('sellers')
    .select('*')
    .eq('subdomain', subdomain)
    .maybeSingle();

  if (!seller) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Seller Not Found</h1>
        <p>The seller &quot;{subdomain}&quot; was not found.</p>
      </main>
    );
  }

  // Get all products for this seller
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', seller.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-zinc-600">{seller.name}</p>
          </div>
          <div className="flex gap-4">
            <Link href={`/dashboard/${subdomain}/products/new`}>
              <Button>Add Product</Button>
            </Link>
            <Link href={`/dashboard/${subdomain}`}>
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Product Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4">
            <div className="text-lg font-bold text-blue-600">
              {products?.length || 0}
            </div>
            <div className="text-sm text-zinc-600">Total Products</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-lg font-bold text-green-600">
              {products?.filter(p => !p.is_limited).length || 0}
            </div>
            <div className="text-sm text-zinc-600">Regular Items</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-lg font-bold text-purple-600">
              {products?.filter(p => p.is_limited).length || 0}
            </div>
            <div className="text-sm text-zinc-600">Limited Edition</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-lg font-bold text-orange-600">
              ${products?.reduce((sum, p) => sum + Number(p.price), 0).toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-zinc-600">Total Value</div>
          </Card>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-zinc-100 relative">
                  {product.image_urls && product.image_urls.length > 0 ? (
                    <Image
                      src={product.image_urls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.is_limited && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Limited
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-zinc-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold">${Number(product.price).toFixed(2)}</span>
                    <div className="text-sm text-zinc-500">
                      {product.sizes?.length || 0} sizes
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/dashboard/${subdomain}/products/${product.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/${subdomain}/product/${product.id}`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              <svg 
                className="mx-auto h-16 w-16 text-zinc-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                />
              </svg>
              <h3 className="text-lg font-medium text-zinc-600 mb-2">
                No products yet
              </h3>
              <p className="text-zinc-500 mb-6">
                Start by adding your first product to your store.
              </p>
              <Link href={`/dashboard/${subdomain}/products/new`}>
                <Button>Add Your First Product</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
