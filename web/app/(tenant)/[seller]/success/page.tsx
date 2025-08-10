import { supabaseServer } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

type SuccessPageProps = {
  params: Promise<{ seller: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { seller: subdomain } = await params;
  const { session_id } = await searchParams;
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

  // Try to find the order by session_id if provided
  let order = null;
  if (session_id) {
    const { data: orderData } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          size,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('stripe_session_id', session_id)
      .eq('seller_id', seller.id)
      .maybeSingle();
    
    order = orderData;
  }

  return (
    <ThemeProvider seller={seller}>
      <div className="min-h-screen flex flex-col">
        <Header storeName={seller.name} subdomain={subdomain} seller={seller} />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8">
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: seller.colors?.accent || '#10b981' }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 
              className="text-3xl font-bold mb-4"
              style={{ color: seller.colors?.primary || '#111827' }}
            >
              Order Confirmed!
            </h1>
            
            <p className="text-lg text-zinc-600 mb-8">
              Thank you for your purchase! Your order has been successfully placed.
            </p>

            {/* Order Details */}
            {order && (
              <Card className="p-6 mb-8 text-left">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Order Number:</span>
                    <span className="font-mono font-bold">{order.order_number}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Total:</span>
                    <span className="font-bold">${Number(order.total).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Payment Method:</span>
                    <span className="capitalize">{order.payment_method}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Status:</span>
                    <span className="capitalize font-medium text-green-600">{order.status}</span>
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-bold mb-3">Items Ordered:</h3>
                    <div className="space-y-2">
                      {order.order_items.map((item: {
                        id: string;
                        product_name: string;
                        size?: string;
                        quantity: number;
                        total_price: number;
                      }) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.product_name}
                            {item.size && ` (${item.size})`}
                            {' × ' + item.quantity}
                          </span>
                          <span>${Number(item.total_price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* What's Next */}
            <Card className="p-6 mb-8 text-left">
              <h2 className="text-xl font-bold mb-4">What&apos;s Next?</h2>
              <div className="space-y-3 text-zinc-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">Order Confirmation</p>
                    <p className="text-sm">You&apos;ll receive an email confirmation shortly with your order details.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">Processing</p>
                    <p className="text-sm">We&apos;ll prepare your order for shipping within 1-2 business days.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">Shipping</p>
                    <p className="text-sm">You&apos;ll receive tracking information once your order ships.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${subdomain}`}>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                >
                  Continue Shopping
                </Button>
              </Link>
              
              <Button 
                className="w-full sm:w-auto"
                style={{
                  backgroundColor: seller.colors?.accent || '#ef4444',
                  borderColor: seller.colors?.accent || '#ef4444'
                }}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.print();
                  }
                }}
              >
                Print Receipt
              </Button>
            </div>

            {/* Support */}
            <div className="mt-12 pt-8 border-t text-center">
              <p className="text-zinc-600 mb-2">
                Questions about your order?
              </p>
              <p className="text-sm text-zinc-500">
                Contact us and we&apos;ll be happy to help!
              </p>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
