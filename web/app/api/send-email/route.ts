import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ResendProvider } from '@/lib/providers/email';

export async function POST(req: NextRequest) {
  const { sellerId, to, subject, html } = await req.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: seller } = await supabase.from('sellers').select('email_provider').eq('id', sellerId).single();
  const provider = new ResendProvider(process.env.RESEND_API_KEY!);
  await provider.send({ to, subject, html });
  return NextResponse.json({ ok: true, provider: seller?.email_provider || 'resend' });
}

