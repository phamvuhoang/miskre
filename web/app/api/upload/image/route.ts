import { NextRequest, NextResponse } from 'next/server';
import { StorageManager } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const sellerId = formData.get('sellerId') as string;
    const productId = formData.get('productId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID required' }, { status: 400 });
    }

    // Validate file
    const validation = StorageManager.validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload image
    const storageManager = new StorageManager();
    const imageUrl = await storageManager.uploadProductImage(file, sellerId, productId || undefined);

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: 'Image uploaded successfully'
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL required' }, { status: 400 });
    }

    const storageManager = new StorageManager();
    await storageManager.deleteProductImage(imageUrl);

    return NextResponse.json({ 
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' }, 
      { status: 500 }
    );
  }
}
