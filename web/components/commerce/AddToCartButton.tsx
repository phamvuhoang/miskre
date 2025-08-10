'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CartManager } from '@/lib/cart';
import { trackEvent } from '@/lib/analytics';

type Product = {
  id: string;
  name: string;
  price: number;
  image_urls?: string[];
  seller_id: string;
  sizes?: string[];
};

type Props = {
  product: Product;
  subdomain: string;
};

export function AddToCartButton({ product, subdomain }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cartManager = new CartManager(subdomain);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAdding(true);
    
    try {
      cartManager.addItem(product, selectedSize || undefined, quantity);
      
      trackEvent('add_to_cart', {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity,
        size: selectedSize || '',
        subdomain,
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const goToCart = () => {
    window.location.href = `/${subdomain}/cart`;
  };

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-zinc-300 hover:border-zinc-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="space-y-2">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full"
          size="lg"
        >
          {isAdding ? 'Adding...' : showSuccess ? 'Added to Cart!' : 'Add to Cart'}
        </Button>

        {showSuccess && (
          <Button
            variant="outline"
            onClick={goToCart}
            className="w-full"
          >
            View Cart
          </Button>
        )}
      </div>

      {/* Product Info */}
      <div className="text-sm text-zinc-600 space-y-1">
        <div className="flex justify-between">
          <span>Price:</span>
          <span className="font-semibold">${product.price}</span>
        </div>
        {quantity > 1 && (
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-semibold">${(product.price * quantity).toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
