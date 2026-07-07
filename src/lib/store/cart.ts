import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemProduct {
  name: string;
  price: string;
  image: string;
  imageAlt: string;
  badges: { label: string; variant: 'primary' | 'secondary' | 'accent' | 'inverse' }[];
}

export interface CartItem {
  id: string; // unique id for the cart item, e.g., `${productId}-${packSize}`
  productId: string;
  packSize: '6' | '12' | '24';
  quantity: number;
  product: CartItemProduct;
}

interface CartState {
  items: CartItem[];
  addItem: (productId: string, packSize: '6' | '12' | '24', quantity: number, product: CartItemProduct) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

// Helper to get price based on pack size
export function getPackPrice(basePriceStr: string, pack: '6' | '12' | '24') {
  const match = basePriceStr.replace(/[₹,]/g, '').match(/\d+/);
  const basePrice = match ? parseInt(match[0], 10) : 909; // fallback
  switch (pack) {
    case '6': return Math.round(basePrice * 0.55);
    case '12': return basePrice;
    case '24': return Math.round(basePrice * 1.85);
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, packSize, quantity, product) => {
        set((state) => {
          const id = `${productId}-${packSize}`;
          const existingItem = state.items.find((item) => item.id === id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + quantity, product } : item
              ),
            };
          }

          return {
            items: [...state.items, { id, productId, packSize, quantity, product }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = getPackPrice(item.product.price, item.packSize);
          return total + price * item.quantity;
        }, 0);
      },

      getCartItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'protibae-cart-storage',
    }
  )
);
