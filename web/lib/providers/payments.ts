export interface CheckoutPayload {
  amount: number;
  currency: 'usd';
  metadata?: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}
export interface PayoutPayload { sellerId: string; amount: number }
export interface PaymentProvider {
  createCheckoutSession(payload: CheckoutPayload): Promise<{ id: string; url?: string }>;
  processPayout(payload: PayoutPayload): Promise<{ status: 'pending' | 'completed' }>;
}
export class StripeProvider implements PaymentProvider {
  private stripe: import('stripe').Stripe;
  constructor(apiKey: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require('stripe').default;
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
  }
  async createCheckoutSession(p: CheckoutPayload) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: { currency: p.currency, unit_amount: Math.round(p.amount * 100), product_data: { name: 'Order' } },
        quantity: 1,
      }],
      mode: 'payment', success_url: p.successUrl, cancel_url: p.cancelUrl, metadata: p.metadata,
    });
    return { id: session.id, url: session.url ?? undefined };
  }
  async processPayout(p: PayoutPayload): Promise<{ status: 'pending' | 'completed' }> {
    await this.stripe.transfers.create({ amount: Math.round(p.amount * 100), currency: 'usd', destination: p.sellerId });
    return { status: 'completed' };
  }
}
export class CODProvider implements PaymentProvider {
  async createCheckoutSession(_p: CheckoutPayload): Promise<{ id: string; url?: string }> {
    return { id: `cod_${Date.now()}` };
  }
  async processPayout(_p: PayoutPayload): Promise<{ status: 'pending' | 'completed' }> {
    return { status: 'pending' };
  }
}

