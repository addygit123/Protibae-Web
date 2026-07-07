import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemProduct {
  name: string;
  price: number;
  price6?: number | null;
  image: string;
  imageAlt: string;
  badges: { label: string; variant: 'primary' | 'secondary' | 'accent' | 'inverse' }[];
  inventory: number;
}

export interface CartItem {
  id: string; // unique id for the cart item, e.g., `${productId}-${packSize}`
  productId: string;
  packSize: '1' | '6';
  quantity: number;
  product: CartItemProduct;
}

interface CartState {
  items: CartItem[];
  addItem: (productId: string, packSize: '1' | '6', quantity: number, product: CartItemProduct) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export function getPackPrice(price: number, price6: number | null | undefined, pack: '1' | '6') {
  if (pack === '6') {
    return price6 ?? price * 6;
  }
  return price;
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
          const price = getPackPrice(item.product.price, item.product.price6, item.packSize);
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
