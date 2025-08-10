import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { ResendProvider } from '@/lib/providers/email';

// COD checkout: create a pending order directly without Stripe
export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('orders').insert({
    seller_id: body.seller_id,
    customer_email_enc: body.customer_email_enc ?? null,
    status: 'pending',
    payment_method: 'cod',
    total: body.total ?? 0,
  }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Order confirmation email (best effort)
  try {
    if (body.customer_email) {
      const resend = new ResendProvider(process.env.RESEND_API_KEY!);
      await resend.send({
        to: body.customer_email,
        subject: 'Order placed (COD) - MISKRE',
        html: `<p>Thanks! We received your COD order. ID: ${data.id}</p>`,
      });
    }
  } catch {}

  return NextResponse.json({ order: data });
}

