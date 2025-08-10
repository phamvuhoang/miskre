import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { ResendProvider } from '@/lib/providers/email';
import { SKUGenerator } from '@/lib/sku-generator';
import { buildStoreUrl, buildDashboardUrl } from '@/lib/subdomain-utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subdomain = searchParams.get('subdomain');

  if (!subdomain) {
    return NextResponse.json({ error: 'Subdomain required' }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { data: seller, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('subdomain', subdomain)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ seller });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = supabaseServer();

  // Validate required fields
  if (!body.name || !body.subdomain || !body.contact_email) {
    return NextResponse.json({ error: 'Name, subdomain, and contact email are required' }, { status: 400 });
  }

  // Clean and validate subdomain
  const cleanSubdomain = body.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (cleanSubdomain !== body.subdomain) {
    return NextResponse.json({ error: 'Subdomain can only contain lowercase letters, numbers, and hyphens' }, { status: 400 });
  }

  // Check if subdomain already exists
  const { data: existingSeller } = await supabase
    .from('sellers')
    .select('id')
    .eq('subdomain', cleanSubdomain)
    .maybeSingle();

  if (existingSeller) {
    return NextResponse.json({ error: 'Subdomain already exists' }, { status: 400 });
  }

  const { data, error } = await supabase.from('sellers').insert({
    name: body.name,
    subdomain: cleanSubdomain,
    custom_domain: body.custom_domain || null,
    logo_url: body.logo_url || null,
    colors: body.colors || null,
    phrases: Array.isArray(body.phrases) ? body.phrases.filter((p: string) => p.trim() !== '') : null,
    payment_provider: body.payment_provider || 'stripe',
    email_provider: body.email_provider || 'resend',
  }).select('*').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Generate default products for the seller
  try {
    const skuGenerator = new SKUGenerator(data.name);
    const products = await skuGenerator.createProductsForSeller(data.id, supabase);
    console.log(`Created ${products.length} default products for seller ${data.name}`);
  } catch (productError) {
    console.error('Failed to create default products:', productError);
    // Don't fail seller creation for product generation errors
  }

  // Send launch kit email (best effort)
  try {
    const resend = new ResendProvider(process.env.RESEND_API_KEY!);
    await resend.send({
      to: body.contact_email,
      subject: `🎉 Welcome to MISKRE - Your Store "${data.name}" is Live!`,
      html: generateLaunchKitEmail(data),
    });
  } catch (emailError) {
    console.error('Failed to send launch kit email:', emailError);
  }

  return NextResponse.json({ seller: data });
}

function generateLaunchKitEmail(seller: any): string {
  const domain = process.env.DOMAIN || 'miskre.com';
  const storeUrl = buildStoreUrl(seller.subdomain);
  const dashboardUrl = buildDashboardUrl(seller.subdomain);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to MISKRE</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #000; color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 5px; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        h2 { color: #000; margin-top: 30px; }
        ul, ol { padding-left: 20px; }
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to MISKRE!</h1>
        <p>Your store "${seller.name}" is now live and ready for customers</p>
      </div>

      <div class="content">
        <h2>📍 Your Store Details</h2>
        <ul>
          <li><strong>Store Name:</strong> ${seller.name}</li>
          <li><strong>Store URL:</strong> <a href="${storeUrl}">${storeUrl}</a></li>
          <li><strong>Subdomain:</strong> ${seller.subdomain}</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${storeUrl}" class="button">🏪 View Your Store</a>
          <a href="${dashboardUrl}" class="button">📊 Go to Dashboard</a>
        </div>

        <h2>🚀 Quick Start Guide</h2>
        <ol>
          <li><strong>Add Products:</strong> Use the admin panel to upload your first products</li>
          <li><strong>Customize Your Store:</strong> Add your logo and brand colors</li>
          <li><strong>Share Your Store:</strong> Start promoting your unique store URL</li>
          <li><strong>Monitor Sales:</strong> Track orders and revenue in your dashboard</li>
        </ol>

        <h2>💡 Pro Tips for Success</h2>
        <ul>
          <li>Upload high-quality product images (square format works best)</li>
          <li>Write compelling product descriptions that tell your story</li>
          <li>Share your store link on social media and with your community</li>
          <li>Engage with customers and build your brand authentically</li>
        </ul>

        <h2>🆘 Need Help?</h2>
        <p>We're here to support you every step of the way:</p>
        <ul>
          <li>📧 Email: ${process.env.SUPPORT_EMAIL || 'support@miskre.com'}</li>
          <li>📚 Help Center: <a href="https://${domain}/help">${domain}/help</a></li>
        </ul>
      </div>

      <div class="footer">
        <p><strong>Ready to start selling?</strong> <a href="${storeUrl}">Visit your store now →</a></p>
        <p>© 2024 MISKRE. Built for fighters, coaches, and their communities.</p>
      </div>
    </body>
    </html>
  `;
}

