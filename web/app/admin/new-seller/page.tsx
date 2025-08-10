'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function NewSeller() {
  const [form, setForm] = useState({ name: '', subdomain: '' });
  const [status, setStatus] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Submitting...');
    const res = await fetch('/api/sellers', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, payment_provider: 'stripe', email_provider: 'resend' }),
    });
    const data = await res.json();
    setStatus(res.ok ? `Created seller ${data.seller?.name}` : `Error: ${data.error}`);
  }

  return (
    <main className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">New Seller</h1>
      <form className="space-y-3" onSubmit={submit}>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Subdomain</label>
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.subdomain} onChange={e => setForm(f => ({ ...f, subdomain: e.target.value }))} required />
        </div>
        <Button type="submit">Create</Button>
      </form>
      {status && <p className="mt-4 text-sm text-zinc-600">{status}</p>}
    </main>
  );
}

