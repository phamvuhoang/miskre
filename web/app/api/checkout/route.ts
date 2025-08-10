import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { StripeProvider, CODProvider, PaymentProvider } from '@/lib/providers/payments';
import { CreateOrderRequest } from '@/lib/types/orders';

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderRequest = await req.json();
    const supabase = supabaseServer();

    const { data: seller } = await supabase
      .from('sellers')
      .select('payment_provider, subdomain')
      .eq('id', body.seller_id)
      .single();

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    const provider: PaymentProvider = seller.payment_provider === 'cod'
      ? new CODProvider()
      : new StripeProvider(process.env.STRIPE_API_KEY!);

    // For Stripe, we need to create a pending order first and store the session ID
    // This allows us to have the order with items ready when the webhook fires
    if (seller.payment_provider !== 'cod') {
      // Create Stripe checkout session
      const session = await provider.createCheckoutSession({
        amount: body.total,
        currency: 'usd',
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${seller.subdomain}/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${seller.subdomain}/cart`,
        metadata: {
          sellerId: body.seller_id,
          orderData: JSON.stringify({
            items: body.items,
            customer_email: body.customer_email,
            customer_name: body.customer_name,
            customer_phone: body.customer_phone,
            shipping_address: body.shipping_address,
            subtotal: body.subtotal,
            shipping_cost: body.shipping_cost || 0,
            tax_amount: body.tax_amount || 0,
            discount_amount: body.discount_amount || 0,
            notes: body.notes,
          }),
        },
      });

      return NextResponse.json({
        sessionId: session.id,
        url: (session as { url?: string }).url
      });
    } else {
      // For COD, redirect to COD checkout
      return NextResponse.json({
        redirect: 'cod',
        message: 'Use COD checkout endpoint'
      });
    }
  } catch (error) {
    console.error('Error in checkout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

