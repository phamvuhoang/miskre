import { NextRequest, NextResponse } from 'next/server';
import { ResendProvider } from '@/lib/providers/email';
import { CreateOrderRequest } from '@/lib/types/orders';

// COD checkout: create a pending order directly without Stripe
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CreateOrderRequest & {
      customer_email?: string;
      customer_name?: string;
      customer_phone?: string;
    };

    // Create order using the orders API logic
    const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        payment_method: 'cod',
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      return NextResponse.json({ error: errorData.error }, { status: orderResponse.status });
    }

    const { order } = await orderResponse.json();

    // Order confirmation email (best effort)
    try {
      if (body.customer_email) {
        const resend = new ResendProvider(process.env.RESEND_API_KEY!);
        await resend.send({
          to: body.customer_email,
          subject: `Order Confirmation - ${order.order_number}`,
          html: `
            <h2>Order Confirmation</h2>
            <p>Thank you for your order! We've received your Cash on Delivery order.</p>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Total:</strong> $${order.total}</p>
            <p>We'll contact you soon to confirm delivery details.</p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error in COD checkout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

