import { supabaseServer } from '@/lib/supabase/server';

export class StorageManager {
  private supabase;
  private bucketName = 'product-images';

  constructor() {
    this.supabase = supabaseServer();
  }

  async uploadProductImage(file: File, sellerId: string, productId?: string): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${sellerId}/${productId || 'temp'}_${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async deleteProductImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const sellerFolder = pathParts[pathParts.length - 2];
      const filePath = `${sellerFolder}/${fileName}`;

      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  async listProductImages(sellerId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list(sellerId);

      if (error) {
        throw new Error(`List failed: ${error.message}`);
      }

      return data.map(file => {
        const { data: urlData } = this.supabase.storage
          .from(this.bucketName)
          .getPublicUrl(`${sellerId}/${file.name}`);
        return urlData.publicUrl;
      });
    } catch (error) {
      console.error('Error listing images:', error);
      throw error;
    }
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.'
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File too large. Please upload images smaller than 5MB.'
      };
    }

    return { valid: true };
  }

  static async resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 800): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type,
          0.8 // Quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}
