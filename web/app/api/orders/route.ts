import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('orders').insert({
    seller_id: body.seller_id,
    customer_email_enc: body.customer_email_enc ?? null,
    status: body.status ?? 'pending',
    payment_method: body.payment_method,
    total: body.total ?? 0,
  }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ order: data });
}

