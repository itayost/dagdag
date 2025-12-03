'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string | null;
  price: number;
  originalPrice: number;
  quantity: number;
  unit: 'KG' | 'UNIT';
  cuttingStyle: string | null;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// Constants
const CART_STORAGE_KEY = 'jacko-cart';
const FREE_DELIVERY_THRESHOLD = 200;
const DELIVERY_FEE = 30;

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate unique cart item ID
function generateCartItemId(productId: string, cuttingStyle: string | null): string {
  return `${productId}-${cuttingStyle || 'none'}`;
}

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isHydrated]);

  // Computed values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  // Actions
  const addItem = useCallback((newItem: Omit<CartItem, 'id' | 'quantity'>, quantity: number = 1) => {
    const id = generateCartItemId(newItem.productId, newItem.cuttingStyle);

    setItems(currentItems => {
      const existingIndex = currentItems.findIndex(item => item.id === id);

      if (existingIndex >= 0) {
        // Update existing item quantity
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item
      return [...currentItems, { ...newItem, id, quantity }];
    });

    // Open cart drawer when adding item
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Export constants for use elsewhere
export { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE };
