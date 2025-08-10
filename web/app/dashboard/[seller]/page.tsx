import { supabaseServer } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type DashboardProps = {
  params: Promise<{ seller: string }>;
};

export default async function SellerDashboard({ params }: DashboardProps) {
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
        <p>The seller "{subdomain}" was not found.</p>
      </main>
    );
  }

  // Get orders for this seller
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('seller_id', seller.id)
    .order('created_at', { ascending: false });

  // Get products for this seller
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', seller.id);

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const shippedOrders = orders?.filter(order => order.status === 'shipped').length || 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{seller.name} Dashboard</h1>
          <div className="flex gap-4">
            <Link href={`/${subdomain}`}>
              <Button variant="outline">View Store</Button>
            </Link>
            <Link href={`/dashboard/${subdomain}/orders`}>
              <Button variant="outline">All Orders</Button>
            </Link>
            <Link href={`/dashboard/${subdomain}/products`}>
              <Button variant="outline">Manage Products</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-zinc-600">Total Revenue</div>
          </Card>
          
          <Card className="p-6">
            <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
            <div className="text-sm text-zinc-600">Total Orders</div>
          </Card>
          
          <Card className="p-6">
            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
            <div className="text-sm text-zinc-600">Pending Orders</div>
          </Card>
          
          <Card className="p-6">
            <div className="text-2xl font-bold text-purple-600">{shippedOrders}</div>
            <div className="text-sm text-zinc-600">Shipped Orders</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link href={`/dashboard/${subdomain}/orders`}>
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            
            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded">
                    <div>
                      <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                      <div className="text-sm text-zinc-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${Number(order.total).toFixed(2)}</div>
                      <div className={`text-sm px-2 py-1 rounded text-white ${
                        order.status === 'pending' ? 'bg-orange-500' :
                        order.status === 'shipped' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">No orders yet</p>
            )}
          </Card>

          {/* Products */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Products</h2>
              <Button variant="ghost" size="sm">Add Product</Button>
            </div>
            
            {products && products.length > 0 ? (
              <div className="space-y-3">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-zinc-50 rounded">
                    <div className="w-12 h-12 bg-zinc-200 rounded overflow-hidden flex-shrink-0">
                      {product.image_urls?.[0] ? (
                        <img 
                          src={product.image_urls[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-zinc-600">${Number(product.price).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">No products yet</p>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href={`/dashboard/${subdomain}/products/new`}>
              <Button className="h-auto p-4 flex flex-col items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Product
              </Button>
            </Link>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Assets
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Store
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
