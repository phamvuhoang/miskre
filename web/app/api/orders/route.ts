import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { encrypt } from '@/lib/crypto';
import { CreateOrderRequest } from '@/lib/types/orders';

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderRequest = await req.json();
    const supabase = supabaseServer();

    // Generate order number
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number');

    if (orderNumberError) {
      console.error('Error generating order number:', orderNumberError);
      return NextResponse.json({ error: 'Failed to generate order number' }, { status: 500 });
    }

    // Encrypt sensitive customer data
    const customer_email_enc = body.customer_email ? encrypt(body.customer_email) : null;
    const customer_name_enc = body.customer_name ? encrypt(body.customer_name) : null;
    const customer_phone_enc = body.customer_phone ? encrypt(body.customer_phone) : null;
    const shipping_address_enc = body.shipping_address ? encrypt(JSON.stringify(body.shipping_address)) : null;

    // Create order
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      order_number: orderNumberData,
      seller_id: body.seller_id,
      customer_email_enc,
      customer_name_enc,
      customer_phone_enc,
      shipping_address_enc,
      status: 'pending',
      payment_method: body.payment_method,
      payment_status: 'pending',
      subtotal: body.subtotal,
      shipping_cost: body.shipping_cost || 0,
      tax_amount: body.tax_amount || 0,
      discount_amount: body.discount_amount || 0,
      total: body.total,
      stripe_session_id: body.stripe_session_id,
      notes: body.notes,
    }).select('*').single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    // Create order items
    const orderItems = body.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_description: item.product_description,
      product_image_url: item.product_image_url,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 400 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('seller_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!sellerId) {
      return NextResponse.json({ error: 'seller_id is required' }, { status: 400 });
    }

    const supabase = supabaseServer();

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_description,
          product_image_url,
          size,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

