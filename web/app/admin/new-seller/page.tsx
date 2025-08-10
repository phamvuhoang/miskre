'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogoUpload } from '@/components/ui/LogoUpload';

interface SellerForm {
  name: string;
  subdomain: string;
  contact_email: string;
  logo_url: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  phrases: string[];
  custom_domain?: string;
}

export default function NewSeller() {
  const [form, setForm] = useState<SellerForm>({
    name: '',
    subdomain: '',
    contact_email: '',
    logo_url: null,
    colors: {
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#ef4444'
    },
    phrases: ['', '', '']
  });
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = <K extends keyof SellerForm>(field: K, value: SellerForm[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateColor = (colorType: keyof SellerForm['colors'], value: string) => {
    setForm(prev => ({
      ...prev,
      colors: { ...prev.colors, [colorType]: value }
    }));
  };

  const updatePhrase = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      phrases: prev.phrases.map((phrase, i) => i === index ? value : phrase)
    }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Creating seller and generating products...');

    try {
      const res = await fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phrases: form.phrases.filter(p => p.trim() !== ''),
          payment_provider: 'stripe',
          email_provider: 'resend'
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Successfully created seller "${data.seller?.name}"! Store is live at ${data.seller?.subdomain}.miskre.com`);
        // Reset form
        setForm({
          name: '',
          subdomain: '',
          contact_email: '',
          logo_url: null,
          colors: { primary: '#000000', secondary: '#ffffff', accent: '#ef4444' },
          phrases: ['', '', '']
        });
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Seller</h1>
        <p className="text-zinc-600">Set up a new fighter, coach, or gym store with custom branding</p>
      </div>

      <Card className="p-6">
        <form className="space-y-6" onSubmit={submit}>
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Store Name *</label>
                <input
                  className="w-full rounded border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                  placeholder="e.g., Fighter Name, Gym Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subdomain *</label>
                <div className="flex">
                  <input
                    className="flex-1 rounded-l border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
                    value={form.subdomain}
                    onChange={e => updateForm('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="fightername"
                    required
                  />
                  <span className="bg-zinc-100 border border-l-0 border-zinc-300 px-3 py-2 rounded-r text-sm text-zinc-600">
                    .miskre.com
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Email *</label>
              <input
                type="email"
                className="w-full rounded border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
                value={form.contact_email}
                onChange={e => updateForm('contact_email', e.target.value)}
                placeholder="seller@example.com"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">Used for launch kit and important notifications</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Custom Domain (Optional)</label>
              <input
                className="w-full rounded border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
                value={form.custom_domain || ''}
                onChange={e => updateForm('custom_domain', e.target.value || undefined)}
                placeholder="fightername.com"
              />
              <p className="text-xs text-zinc-500 mt-1">Leave blank to use subdomain only</p>
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Branding</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Logo</label>
              <LogoUpload
                onUpload={(url) => updateForm('logo_url', url)}
                currentImage={form.logo_url}
                className="w-32 h-32"
              />
              <p className="text-xs text-zinc-500 mt-1">Square format recommended (512x512px or larger)</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand Colors</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-600 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={form.colors.primary}
                      onChange={e => updateColor('primary', e.target.value)}
                      className="w-12 h-10 rounded border border-zinc-300"
                    />
                    <input
                      type="text"
                      value={form.colors.primary}
                      onChange={e => updateColor('primary', e.target.value)}
                      className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-600 mb-1">Secondary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={form.colors.secondary}
                      onChange={e => updateColor('secondary', e.target.value)}
                      className="w-12 h-10 rounded border border-zinc-300"
                    />
                    <input
                      type="text"
                      value={form.colors.secondary}
                      onChange={e => updateColor('secondary', e.target.value)}
                      className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-600 mb-1">Accent Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={form.colors.accent}
                      onChange={e => updateColor('accent', e.target.value)}
                      className="w-12 h-10 rounded border border-zinc-300"
                    />
                    <input
                      type="text"
                      value={form.colors.accent}
                      onChange={e => updateColor('accent', e.target.value)}
                      className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand Phrases</label>
              <div className="space-y-2">
                {form.phrases.map((phrase, index) => (
                  <input
                    key={index}
                    className="w-full rounded border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none"
                    value={phrase}
                    onChange={e => updatePhrase(index, e.target.value)}
                    placeholder={`Brand phrase ${index + 1} (optional)`}
                  />
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Motivational phrases or slogans for your brand</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-zinc-600">
              * Required fields
            </div>
            <Button type="submit" disabled={isSubmitting} className="px-8">
              {isSubmitting ? 'Creating...' : 'Create Seller'}
            </Button>
          </div>
        </form>

        {status && (
          <div className={`mt-6 p-4 rounded-lg ${
            status.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' :
            status.includes('❌') ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <p className="text-sm">{status}</p>
          </div>
        )}
      </Card>
    </main>
  );
}

