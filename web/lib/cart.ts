export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_urls?: string[];
  quantity: number;
  size?: string;
  seller_id: string;
};

export class CartManager {
  private subdomain: string;
  private storageKey: string;

  constructor(subdomain: string) {
    this.subdomain = subdomain;
    this.storageKey = `cart_${subdomain}`;
  }

  getItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  addItem(product: {
    id: string;
    name: string;
    price: number;
    image_urls?: string[];
    seller_id: string;
  }, size?: string, quantity: number = 1): void {
    if (typeof window === 'undefined') return;

    const items = this.getItems();
    const existingIndex = items.findIndex(
      item => item.id === product.id && item.size === size
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_urls: product.image_urls,
        quantity,
        size,
        seller_id: product.seller_id,
      });
    }

    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.dispatchCartUpdate();
  }

  updateQuantity(id: string, size: string | undefined, quantity: number): void {
    if (typeof window === 'undefined') return;

    const items = this.getItems();
    const index = items.findIndex(item => item.id === id && item.size === size);

    if (index >= 0) {
      if (quantity <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = quantity;
      }
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      this.dispatchCartUpdate();
    }
  }

  removeItem(id: string, size?: string): void {
    if (typeof window === 'undefined') return;

    const items = this.getItems().filter(
      item => !(item.id === id && item.size === size)
    );
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.dispatchCartUpdate();
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
    this.dispatchCartUpdate();
  }

  private dispatchCartUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  }

  getItemCount(): number {
    return this.getItems().reduce((total, item) => total + item.quantity, 0);
  }

  getTotal(): number {
    return this.getItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
