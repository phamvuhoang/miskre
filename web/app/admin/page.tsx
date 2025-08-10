import { supabaseServer } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = supabaseServer();

  // Get all sellers
  const { data: sellers } = await supabase
    .from('sellers')
    .select('*')
    .order('created_at', { ascending: false });

  // Get all orders with order items
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      sellers (name, subdomain),
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        total_price
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  // Calculate stats
  const totalSellers = sellers?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
  const pendingOrders = orders?.filter(order => ['pending', 'confirmed'].includes(order.status)).length || 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">MISKRE Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/admin/new-seller">
              <Button>Add New Seller</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-2xl font-bold text-blue-600">{totalSellers}</div>
            <div className="text-sm text-zinc-600">Total Sellers</div>
          </Card>
          
          <Card className="p-6">
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-zinc-600">Total Revenue</div>
          </Card>
          
          <Card className="p-6">
            <div className="text-2xl font-bold text-purple-600">{totalOrders}</div>
            <div className="text-sm text-zinc-600">Total Orders</div>
          </Card>
          
          <Card className="p-6">
            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
            <div className="text-sm text-zinc-600">Pending Orders</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Sellers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Sellers</h2>
              <Link href="/admin/new-seller">
                <Button variant="ghost" size="sm">Add Seller</Button>
              </Link>
            </div>
            
            {sellers && sellers.length > 0 ? (
              <div className="space-y-3">
                {sellers.slice(0, 10).map((seller) => (
                  <div key={seller.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded">
                    <div>
                      <div className="font-medium">{seller.name}</div>
                      <div className="text-sm text-zinc-600">
                        {seller.subdomain}.miskre.com
                      </div>
                      <div className="text-xs text-zinc-500">
                        {new Date(seller.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/${seller.subdomain}`}>
                        <Button variant="outline" size="sm">View Store</Button>
                      </Link>
                      <Link href={`/dashboard/${seller.subdomain}`}>
                        <Button variant="ghost" size="sm">Dashboard</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">No sellers yet</p>
            )}
          </Card>

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
            </div>
            
            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded">
                    <div>
                      <div className="font-medium">
                        {order.order_number || `#${order.id.slice(0, 8)}`}
                      </div>
                      <div className="text-sm text-zinc-600">
                        {(order.sellers as { name: string } | null)?.name || 'Unknown Seller'}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${Number(order.total).toFixed(2)}</div>
                      <div className={`text-sm px-2 py-1 rounded text-white ${
                        order.status === 'pending' ? 'bg-orange-500' :
                        order.status === 'confirmed' ? 'bg-blue-500' :
                        order.status === 'processing' ? 'bg-yellow-500' :
                        order.status === 'shipped' ? 'bg-green-500' :
                        order.status === 'delivered' ? 'bg-green-600' :
                        order.status === 'cancelled' ? 'bg-red-500' :
                        order.status === 'returned' ? 'bg-red-600' :
                        'bg-gray-500'
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
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/new-seller">
              <Button className="h-auto p-4 flex flex-col items-center gap-2 w-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Seller
              </Button>
            </Link>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              System Settings
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
