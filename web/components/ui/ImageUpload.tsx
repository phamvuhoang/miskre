'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  sellerId: string;
  productId?: string;
  currentImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  autoSave?: boolean; // If true, automatically saves to product when images change
}

export function ImageUpload({
  sellerId,
  productId,
  currentImages = [],
  onImagesChange,
  maxImages = 5,
  autoSave = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProductImages = async (productId: string, imageUrls: string[]) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_urls: imageUrls }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update product images');
      }

      // Show success message briefly
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to auto-save product images:', error);
      // Don't throw error to avoid disrupting the upload flow
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - currentImages.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sellerId', sellerId);
        if (productId) formData.append('productId', productId);

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        return data.imageUrl;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      const updatedImages = [...currentImages, ...newImageUrls];
      onImagesChange(updatedImages);

      // Auto-save to product if enabled and productId exists
      if (autoSave && productId) {
        await updateProductImages(productId, updatedImages);
      }

    } catch (error) {
      const err = error as Error;
      console.error('Upload error:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      const response = await fetch('/api/upload/image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }

      const updatedImages = currentImages.filter(url => url !== imageUrl);
      onImagesChange(updatedImages);

      // Auto-save to product if enabled and productId exists
      if (autoSave && productId) {
        await updateProductImages(productId, updatedImages);
      }

    } catch (error) {
      const err = error as Error;
      console.error('Delete error:', err);
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Product Images</label>
        <span className="text-xs text-zinc-500">
          {currentImages.length}/{maxImages} images
        </span>
      </div>

      {/* Current Images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(imageUrl)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 rounded text-xs">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {currentImages.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-zinc-400 bg-zinc-50'
              : 'border-zinc-300 hover:border-zinc-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-zinc-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <p className="text-zinc-600 mb-2">
                Drag and drop images here, or click to select
              </p>
              <p className="text-xs text-zinc-500">
                JPEG, PNG, WebP up to 5MB each
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Choose Images'}
            </Button>
          </div>
        </div>
      )}

      {(uploading || saving) && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-zinc-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-zinc-600"></div>
            {uploading ? 'Uploading images...' : 'Saving to product...'}
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-2 text-sm text-green-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Images saved to product!
          </div>
        </div>
      )}
    </div>
  );
}
