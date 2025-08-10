'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { SKUGenerator } from '@/lib/sku-generator';
import Link from 'next/link';

type EditProductPageProps = {
  params: Promise<{ seller: string; id: string }>;
};

export default function EditProductPage({ params }: EditProductPageProps) {
  const [subdomain, setSubdomain] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [sellerId, setSellerId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  
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
    params.then(async ({ seller: sub, id }) => {
      setSubdomain(sub);
      setProductId(id);

      // Fetch seller ID
      try {
        const sellerResponse = await fetch(`/api/sellers?subdomain=${sub}`);
        if (sellerResponse.ok) {
          const sellerData = await sellerResponse.json();
          setSellerId(sellerData.seller?.id || '');
        }
      } catch (error) {
        console.error('Failed to fetch seller:', error);
      }

      // Fetch product data
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          const product = data.product;

          setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            sizes: product.sizes || [],
            category: 'apparel', // Default category
            is_limited: product.is_limited || false,
            image_urls: product.image_urls || [],
          });
        } else {
          setStatus('Error: Product not found');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setStatus('Error: Failed to load product');
      } finally {
        setInitialLoading(false);
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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setStatus('Updating product...');

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        throw new Error(data.error || 'Failed to update product');
      }

      setStatus('Product updated successfully!');
      
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setStatus('Deleting product...');

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      setStatus('Product deleted successfully!');
      
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const availableSizes = SKUGenerator.getDefaultSizes(form.category);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-zinc-600">Update your product details</p>
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
            </div>

            {/* Product Images */}
            <ImageUpload
              sellerId={sellerId}
              productId={productId}
              currentImages={form.image_urls}
              onImagesChange={(images) => setForm(prev => ({ ...prev, image_urls: images }))}
              maxImages={5}
              autoSave={true}
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

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Updating...' : 'Update Product'}
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={loading}
                className="px-6"
              >
                Delete
              </Button>
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
