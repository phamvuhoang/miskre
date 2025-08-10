import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { ResendProvider } from '@/lib/providers/email';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('sellers').insert({
    name: body.name,
    subdomain: body.subdomain,
    custom_domain: body.custom_domain ?? null,
    logo_url: body.logo_url ?? null,
    colors: body.colors ?? null,
    phrases: body.phrases ?? null,
    payment_provider: body.payment_provider ?? 'stripe',
    email_provider: body.email_provider ?? 'resend',
  }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Welcome email (best effort)
  try {
    const resend = new ResendProvider(process.env.RESEND_API_KEY!);
    await resend.send({
      to: body.contact_email || 'founders@miskre.com',
      subject: `Welcome ${body.name} - Your MISKRE Store Setup`,
      html: `<p>Your store ${body.subdomain}.miskre.com is being set up. We'll notify you when live.</p>`,
    });
  } catch {}

  return NextResponse.json({ seller: data });
}

