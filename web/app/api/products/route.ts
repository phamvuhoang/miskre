import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('products').insert({
    seller_id: body.seller_id,
    name: body.name,
    description: body.description ?? null,
    price: body.price,
    sizes: body.sizes ?? null,
    image_urls: body.image_urls ?? null,
    is_limited: !!body.is_limited,
  }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ product: data });
}

