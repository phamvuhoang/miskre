import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseServer } from '@/lib/supabase/server';
import { ResendProvider } from '@/lib/providers/email';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, { apiVersion: '2023-10-16' });
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e) {
    const err = e as Error;
    console.error('Webhook signature verification failed:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}` as unknown as BodyInit, { status: 400 });
  }

  const supabase = supabaseServer();
  
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const sellerId = session.metadata?.sellerId;
      const orderDataStr = session.metadata?.orderData;

      if (!sellerId || !orderDataStr) {
        console.error('Missing sellerId or orderData in session metadata');
        return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
      }

      try {
        const orderData = JSON.parse(orderDataStr);

        // Create order using the orders API
        const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seller_id: sellerId,
            customer_email: session.customer_details?.email || orderData.customer_email,
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
            shipping_address: orderData.shipping_address,
            payment_method: 'stripe',
            items: orderData.items,
            subtotal: orderData.subtotal,
            shipping_cost: orderData.shipping_cost,
            tax_amount: orderData.tax_amount,
            discount_amount: orderData.discount_amount,
            total: Number(session.amount_total ?? 0) / 100,
            stripe_session_id: session.id,
            notes: orderData.notes,
          }),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          console.error('Failed to create order:', errorData);
          return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        const { order } = await orderResponse.json();

        // Update payment status to paid
        await supabase
          .from('orders')
          .update({ payment_status: 'paid', status: 'confirmed' })
          .eq('id', order.id);

        // Send confirmation email
        if (session.customer_details?.email) {
          try {
            const emailProvider = new ResendProvider(process.env.RESEND_API_KEY!);
            await emailProvider.send({
              to: session.customer_details.email,
              subject: `Order Confirmation - ${order.order_number}`,
              html: `
                <h2>Thank you for your order!</h2>
                <p>Your order has been confirmed and is being processed.</p>
                <p><strong>Order Number:</strong> ${order.order_number}</p>
                <p><strong>Total:</strong> $${order.total}</p>
                <p>You will receive a shipping confirmation once your order ships.</p>
              `,
            });
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the webhook for email errors
          }
        }

        console.log('Order created successfully:', order.id);
      } catch (parseError) {
        console.error('Failed to parse order data:', parseError);
        return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
