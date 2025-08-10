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
  } catch (e: any) {
    console.error('Webhook signature verification failed:', e.message);
    return new NextResponse(`Webhook Error: ${e.message}`, { status: 400 });
  }

  const supabase = supabaseServer();
  
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const sellerId = session.metadata?.sellerId;
      
      if (!sellerId) {
        console.error('No sellerId in session metadata');
        return NextResponse.json({ error: 'Missing sellerId' }, { status: 400 });
      }

      // Create order in database
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        seller_id: sellerId,
        customer_email_enc: session.customer_details?.email || null,
        status: 'pending',
        payment_method: 'stripe',
        total: Number(session.amount_total ?? 0) / 100,
      }).select('*').single();

      if (orderError) {
        console.error('Failed to create order:', orderError);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
      }

      // Send confirmation email if customer email is available
      if (session.customer_details?.email) {
        try {
          const emailProvider = new ResendProvider(process.env.RESEND_API_KEY!);
          await emailProvider.send({
            to: session.customer_details.email,
            subject: 'Order Confirmation',
            html: `
              <h2>Thank you for your order!</h2>
              <p>Your order has been confirmed and is being processed.</p>
              <p><strong>Order ID:</strong> ${order.id}</p>
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
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
