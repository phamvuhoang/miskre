'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

type Props = {
  sellerId: string;
  total: number;
};

export function CodBuyButton({ sellerId, total }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function buy() {
    setLoading(true);
    setStatus(null);
    trackEvent('begin_checkout', { seller_id: sellerId, total, payment_method: 'cod' });
    try {
      const res = await fetch('/api/checkout/cod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: sellerId, total, customer_email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      trackEvent('purchase', { seller_id: sellerId, total, payment_method: 'cod', order_id: data.order.id });
      setStatus(`Order placed (COD). Order ID: ${data.order.id}`);
    } catch (e) {
      const err = e as Error;
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />
      <Button onClick={buy} disabled={loading}>
        {loading ? 'Placing COD Order...' : 'Buy with COD'}
      </Button>
      {status && <p className="text-sm text-zinc-600">{status}</p>}
    </div>
  );
}

