'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { SKUGenerator } from '@/lib/sku-generator';
import Link from 'next/link';

type NewProductPageProps = {
  params: Promise<{ seller: string }>;
};

export default function NewProductPage({ params }: NewProductPageProps) {
  const [subdomain, setSubdomain] = useState<string>('');
  const [sellerId, setSellerId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    sizes: [] as string[],
    category: 'apparel',
    is_limited: false,
    image_urls: [] as string[],
  });

  useEffect(() => {
    params.then(async ({ seller: sub }) => {
      setSubdomain(sub);
      
      // Fetch seller ID
      try {
        const response = await fetch(`/api/sellers?subdomain=${sub}`);
        if (response.ok) {
          const data = await response.json();
          setSellerId(data.seller?.id || '');
        }
      } catch (error) {
        console.error('Failed to fetch seller:', error);
      }
    });
  }, [params]);

  const handleSizeToggle = (size: string) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleCategoryChange = (category: string) => {
    setForm(prev => ({
      ...prev,
      category,
      sizes: SKUGenerator.getDefaultSizes(category)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerId) {
      setStatus('Error: Seller not found');
      return;
    }

    setLoading(true);
    setStatus('Creating product...');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: sellerId,
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          sizes: form.sizes,
          is_limited: form.is_limited,
          image_urls: form.image_urls,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      setStatus('Product created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = `/dashboard/${subdomain}/products`;
      }, 1500);
      
    } catch (error) {
      const err = error as Error;
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const availableSizes = SKUGenerator.getDefaultSizes(form.category);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-zinc-600">Create a new product for your store</p>
          </div>
          <Link href={`/dashboard/${subdomain}/products`}>
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                placeholder="e.g., Fighter Training Tee"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                rows={4}
                placeholder="Describe your product..."
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                className="w-full rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                placeholder="29.99"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-950"
              >
                {SKUGenerator.getProductCategories().map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium mb-2">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-3 py-1 rounded border text-sm ${
                      form.sizes.includes(size)
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-900 border-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Select all sizes that will be available for this product
              </p>
            </div>

            {/* Product Images */}
            <ImageUpload
              sellerId={sellerId}
              currentImages={form.image_urls}
              onImagesChange={(images) => setForm(prev => ({ ...prev, image_urls: images }))}
              maxImages={5}
            />

            {/* Limited Edition */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_limited"
                checked={form.is_limited}
                onChange={(e) => setForm(prev => ({ ...prev, is_limited: e.target.checked }))}
                className="rounded border-zinc-300"
              />
              <label htmlFor="is_limited" className="text-sm font-medium">
                Limited Edition Product
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
              <Link href={`/dashboard/${subdomain}/products`} className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>

            {/* Status Message */}
            {status && (
              <div className={`p-3 rounded text-sm ${
                status.includes('Error') 
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {status}
              </div>
            )}
          </form>
        </Card>
      </main>
    </div>
  );
}
