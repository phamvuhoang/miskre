import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { StripeProvider, CODProvider, PaymentProvider } from '@/lib/providers/payments';

export async function POST(req: NextRequest) {
  const { sellerId, amount } = await req.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: seller } = await supabase.from('sellers').select('payment_provider').eq('id', sellerId).single();

  const provider: PaymentProvider = seller?.payment_provider === 'cod'
    ? new CODProvider()
    : new StripeProvider(process.env.STRIPE_API_KEY!);

  const session = await provider.createCheckoutSession({
    amount,
    currency: 'usd',
    successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    metadata: { sellerId },
  });

  return NextResponse.json({ sessionId: session.id, url: (session as { url?: string }).url });
}

