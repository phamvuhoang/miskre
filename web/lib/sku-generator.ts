export interface ProductTemplate {
  name: string;
  description: string;
  price: number;
  sizes: string[];
  category: string;
  is_limited: boolean;
}

export class SKUGenerator {
  private sellerName: string;

  constructor(sellerName: string) {
    this.sellerName = sellerName;
  }

  generateDefaultProducts(): ProductTemplate[] {
    const brandName = this.sellerName;
    
    return [
      {
        name: `${brandName} Training Tee`,
        description: `Premium cotton training t-shirt featuring the ${brandName} logo. Perfect for training sessions and everyday wear. Comfortable fit with moisture-wicking properties.`,
        price: 29.99,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        category: 'apparel',
        is_limited: false,
      },
      {
        name: `${brandName} Performance Hoodie`,
        description: `Heavyweight hoodie designed for fighters and athletes. Features the ${brandName} branding with a comfortable fit perfect for training and casual wear.`,
        price: 59.99,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        category: 'apparel',
        is_limited: false,
      },
      {
        name: `${brandName} Rashguard`,
        description: `High-performance rashguard with compression fit. Designed for grappling, MMA, and intense training. Features ${brandName} signature design and premium materials.`,
        price: 49.99,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        category: 'fightwear',
        is_limited: false,
      },
      {
        name: `${brandName} Fight Shorts`,
        description: `Professional-grade fight shorts with 4-way stretch fabric. Perfect for MMA, BJJ, and training. Featuring ${brandName} branding and reinforced stitching.`,
        price: 44.99,
        sizes: ['28', '30', '32', '34', '36', '38'],
        category: 'fightwear',
        is_limited: false,
      },
      {
        name: `${brandName} Training Bundle`,
        description: `Complete training package including rashguard and fight shorts. Perfect starter set for new athletes or gift for fans. Represents the ${brandName} fighting spirit.`,
        price: 84.99,
        sizes: ['S', 'M', 'L', 'XL'],
        category: 'bundle',
        is_limited: false,
      },
      {
        name: `${brandName} Signature Cap`,
        description: `Adjustable snapback cap with embroidered ${brandName} logo. Perfect for representing your favorite fighter or gym. One size fits most.`,
        price: 24.99,
        sizes: ['One Size'],
        category: 'accessories',
        is_limited: false,
      },
      {
        name: `${brandName} Limited Edition Tee`,
        description: `Exclusive limited edition t-shirt celebrating ${brandName}. Premium quality with unique design elements. Limited quantities available - get yours before they're gone!`,
        price: 39.99,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        category: 'apparel',
        is_limited: true,
      },
      {
        name: `${brandName} Gym Towel`,
        description: `High-quality microfiber gym towel with ${brandName} branding. Quick-dry and antibacterial properties. Essential for training sessions and competitions.`,
        price: 19.99,
        sizes: ['One Size'],
        category: 'accessories',
        is_limited: false,
      },
    ];
  }

  generateProductVariations(baseProduct: ProductTemplate): ProductTemplate[] {
    const variations: ProductTemplate[] = [];
    
    // Create color variations for apparel
    if (baseProduct.category === 'apparel') {
      const colors = ['Black', 'White', 'Navy', 'Red'];
      colors.forEach(color => {
        variations.push({
          ...baseProduct,
          name: `${baseProduct.name} - ${color}`,
          description: `${baseProduct.description} Available in ${color.toLowerCase()}.`,
        });
      });
    }
    
    return variations.length > 0 ? variations : [baseProduct];
  }

  async createProductsForSeller(
    sellerId: string,
    supabase: { from: (table: 'products') => { insert: (row: Record<string, unknown>) => { select: (cols: string) => { single: () => unknown } } } }
  ): Promise<Record<string, unknown>[]> {
    const products = this.generateDefaultProducts();
    const createdProducts: Record<string, unknown>[] = [];

    for (const product of products) {
      try {
        const result = await supabase.from('products').insert({
          seller_id: sellerId,
          name: product.name,
          description: product.description,
          price: product.price,
          sizes: product.sizes,
          image_urls: [], // Will be populated when images are uploaded
          is_limited: product.is_limited,
        }).select('*').single() as { data: Record<string, unknown> | null; error: { message: string } | null };
        const { data, error } = result;

        if (error || !data) {
          console.error(`Failed to create product ${product.name}:`, error);
        } else {
          createdProducts.push(data);
        }
      } catch (error) {
        console.error(`Error creating product ${product.name}:`, error);
      }
    }

    return createdProducts;
  }

  static getProductCategories(): string[] {
    return ['apparel', 'fightwear', 'accessories', 'bundle'];
  }

  static getDefaultSizes(category: string): string[] {
    switch (category) {
      case 'apparel':
      case 'fightwear':
        return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      case 'shorts':
        return ['28', '30', '32', '34', '36', '38'];
      case 'accessories':
        return ['One Size'];
      default:
        return ['S', 'M', 'L', 'XL'];
    }
  }
}
