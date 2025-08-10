'use client';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { trackEvent } from '@/lib/analytics';
import type { SellerData } from '@/lib/theme';
import Image from 'next/image';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image_urls?: string[];
  quantity: number;
  size?: string;
};

type CartPageProps = {
  params: Promise<{ seller: string }>;
};

export default function CartPage({ params }: CartPageProps) {
  const [seller, setSeller] = useState<string>('');
  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [sellerId, setSellerId] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    params.then(async ({ seller: sub }) => {
      setSeller(sub);

      // Fetch seller data from subdomain
      try {
        const response = await fetch(`/api/sellers?subdomain=${sub}`);
        if (response.ok) {
          const data = await response.json();
          setSellerData(data.seller);
          setSellerId(data.seller?.id || '');
        }
      } catch (error) {
        console.error('Failed to fetch seller:', error);
      }

      // Load cart from localStorage
      const savedCart = localStorage.getItem(`cart_${sub}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    });
  }, [params]);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${seller}`, JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${seller}`, JSON.stringify(updatedCart));
    trackEvent('remove_from_cart', { product_id: id, subdomain: seller });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(`cart_${seller}`);
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async (paymentMethod: 'stripe' | 'cod') => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    trackEvent('begin_checkout', { 
      seller: seller, 
      total, 
      payment_method: paymentMethod,
      items_count: cartItems.length 
    });

    try {
      // Convert cart items to order items format
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_description: '', // Could be enhanced to include description
        product_image_url: item.image_urls?.[0] || '',
        size: item.size,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const orderData = {
        seller_id: sellerId,
        customer_email: email || undefined,
        payment_method: paymentMethod,
        items: orderItems,
        subtotal: total,
        shipping_cost: 0, // Could be calculated based on shipping rules
        tax_amount: 0, // Could be calculated based on location
        discount_amount: 0,
        total,
      };

      if (paymentMethod === 'cod') {
        // Handle COD checkout
        const response = await fetch('/api/checkout/cod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to place order');

        trackEvent('purchase', {
          seller: seller,
          total,
          payment_method: 'cod',
          order_id: data.order.id
        });

        alert(`Order placed successfully! Order Number: ${data.order.order_number}`);
        clearCart();
      } else {
        // Handle Stripe checkout
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create checkout session');

        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      const err = error as Error;
      console.error('Checkout error:', err);
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <ThemeProvider seller={sellerData}>
        <div className="min-h-screen flex flex-col">
          <Header storeName={sellerData?.name || seller} subdomain={seller} seller={sellerData} />
          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1
                className="text-3xl font-bold mb-4"
                style={{ color: sellerData?.colors?.primary || '#111827' }}
              >
                Your Cart
              </h1>
              <p className="text-zinc-600 mb-8">Your cart is empty</p>
              <Button
                onClick={() => window.history.back()}
                style={{
                  backgroundColor: sellerData?.colors?.accent || '#ef4444',
                  borderColor: sellerData?.colors?.accent || '#ef4444'
                }}
              >
                Continue Shopping
              </Button>
            </div>
          </main>
          <Footer seller={sellerData} />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider seller={sellerData}>
      <div className="min-h-screen flex flex-col">
        <Header storeName={sellerData?.name || seller} subdomain={seller} seller={sellerData} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1
            className="text-3xl font-bold mb-8"
            style={{ color: sellerData?.colors?.primary || '#111827' }}
          >
            Your Cart
          </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-zinc-100 rounded overflow-hidden flex-shrink-0">
                    {item.image_urls?.[0] ? (
                      <Image
                        src={item.image_urls[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        width={80}
                        height={80}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.size && <p className="text-sm text-zinc-600">Size: {item.size}</p>}
                    <p className="font-bold">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout('stripe')}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Checkout with Card'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleCheckout('cod')}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Cash on Delivery'}
                </Button>
              </div>

              <p className="text-xs text-zinc-500 mt-4">
                Free shipping on orders over $75. 30-day returns.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer seller={sellerData} />
    </div>
    </ThemeProvider>
  );
}
