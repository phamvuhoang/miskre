'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function OrderActions({ orderId, status }: { orderId: string; status: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(status);

  async function updateStatus(next: 'shipped' | 'returned' | 'pending') {
    setLoading(next);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');
      setCurrentStatus(data.order.status);
      // quick refresh to reflect stats
      window.location.reload();
    } catch (e) {
      const err = e as Error;
      alert(err.message || 'Failed to update order');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      {currentStatus === 'pending' && (
        <Button size="sm" variant="outline" onClick={() => updateStatus('shipped')} disabled={loading !== null}>
          {loading === 'shipped' ? 'Updating…' : 'Mark Shipped'}
        </Button>
      )}
      {currentStatus !== 'returned' && (
        <Button size="sm" variant="ghost" onClick={() => updateStatus('returned')} disabled={loading !== null}>
          {loading === 'returned' ? 'Updating…' : 'Mark Returned'}
        </Button>
      )}
    </div>
  );
}

