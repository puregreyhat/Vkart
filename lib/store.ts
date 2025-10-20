import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

// Create a safe storage implementation for SSR
const createStorage = (): PersistStorage<any> | undefined => {
  if (typeof window === 'undefined') return undefined;
  return localStorage as any;
};

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  weight: string;
  quantity?: number;
  // Internal attributes for expiry tracking (not visible to user)
  productType?: 'fruit' | 'green-leafy' | 'daily-veg' | 'root-veg' | 'bulb-veg' | 'exotic-veg' | 'flower-veg' | 'legume-veg' | 'milk' | 'curd' | 'grain' | 'dal' | 'bread' | 'butter-cheese' | 'snack' | 'juice-drink' | 'masala' | 'dry-fruit' | 'medicine' | 'medical-equipment' | 'hygiene' | 'other';
  arrivalDate?: string; // ISO date string (YYYY-MM-DD)
  expiryDate?: string; // ISO date string (YYYY-MM-DD)
  daysUntilExpiry?: number; // calculated from arrival date
}

export interface OrderData {
  orderId: string;
  orderDate: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  products: (Product & {
    productId: string;
    batchNumber: string;
    manufactureDate: string;
    expiryDate: string;
    daysUntilExpiry: number;
    storageInstructions: string;
  })[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

interface CartStore {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

interface CheckoutStore {
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  setCustomerInfo: (info: Partial<CheckoutStore['customerInfo']>) => void;
}

interface OrderStore {
  lastOrder: OrderData | null;
  setLastOrder: (order: OrderData) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const existingProduct = cart.find((p) => p.id === product.id);
        
        if (existingProduct) {
          set({
            cart: cart.map((p) =>
              p.id === product.id
                ? { ...p, quantity: (p.quantity || 1) + 1 }
                : p
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((p) => p.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
        } else {
          set({
            cart: get().cart.map((p) =>
              p.id === productId ? { ...p, quantity } : p
            ),
          });
        }
      },
      clearCart: () => set({ cart: [] }),
      getTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * (item.quantity || 1),
          0
        );
      },
      getItemCount: () => {
        return get().cart.reduce((count, item) => count + (item.quantity || 1), 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createStorage(),
    } as any
  )
);

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      customerInfo: {
        name: '',
        phone: '',
        address: '',
      },
      setCustomerInfo: (info) =>
        set((state) => ({
          customerInfo: { ...state.customerInfo, ...info },
        })),
    }),
    {
      name: 'checkout-storage',
      storage: createStorage(),
    } as any
  )
);

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      lastOrder: null,
      setLastOrder: (order) => set({ lastOrder: order }),
    }),
    {
      name: 'order-storage',
      storage: createStorage(),
    } as any
  )
);
