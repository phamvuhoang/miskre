import { supabaseServer } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OrderActions } from '@/components/dashboard/OrderActions';

type OrdersPageProps = {
  params: Promise<{ seller: string }>;
};

export default async function OrdersPage({ params }: OrdersPageProps) {
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

  // Get all orders for this seller
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('seller_id', seller.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-zinc-600">{seller.name}</p>
          </div>
          <div className="flex gap-4">
            <Link href={`/dashboard/${subdomain}`}>
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Link href={`/${subdomain}`}>
              <Button variant="outline">View Store</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4">
            <div className="text-lg font-bold text-blue-600">
              {orders?.length || 0}
            </div>
            <div className="text-sm text-zinc-600">Total Orders</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-lg font-bold text-orange-600">
              {orders?.filter(o => o.status === 'pending').length || 0}
            </div>
            <div className="text-sm text-zinc-600">Pending</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-lg font-bold text-green-600">
              {orders?.filter(o => o.status === 'shipped').length || 0}
            </div>
            <div className="text-sm text-zinc-600">Shipped</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-lg font-bold text-red-600">
              {orders?.filter(o => o.status === 'returned').length || 0}
            </div>
            <div className="text-sm text-zinc-600">Returned</div>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-zinc-200">
            <h2 className="text-xl font-bold">All Orders</h2>
          </div>
          
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-zinc-600">Order ID</th>
                    <th className="text-left p-4 font-medium text-zinc-600">Date</th>
                    <th className="text-left p-4 font-medium text-zinc-600">Customer</th>
                    <th className="text-left p-4 font-medium text-zinc-600">Payment</th>
                    <th className="text-left p-4 font-medium text-zinc-600">Total</th>
                    <th className="text-left p-4 font-medium text-zinc-600">Status</th>
                    <th className="text-left p-4 font-medium text-zinc-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="p-4">
                        <div className="font-mono text-sm">
                          #{order.id.slice(0, 8)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {order.customer_email_enc ? 
                            order.customer_email_enc.slice(0, 20) + '...' : 
                            'No email'
                          }
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.payment_method === 'stripe' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.payment_method.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold">
                          ${Number(order.total).toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                          order.status === 'returned' ? 'bg-red-100 text-red-800' :
                          'bg-zinc-100 text-zinc-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {/* Client actions for status updates */}
                          <OrderActions orderId={order.id} status={order.status} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-zinc-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-600 mb-2">No orders yet</h3>
              <p className="text-zinc-500 mb-6">
                Orders will appear here once customers start purchasing from your store.
              </p>
              <Link href={`/${subdomain}`}>
                <Button>View Your Store</Button>
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
