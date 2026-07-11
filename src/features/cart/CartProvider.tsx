"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/features/cart/cart-types";
import {
  addCartItem,
  calculateCartSubtotal,
  CART_STORAGE_KEY,
  parseStoredCart,
  removeCartItem,
  serializeCart,
  updateCartItemQuantity,
} from "@/features/cart/cart-utils";

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoadedStoredCart, setHasLoadedStoredCart] = useState(false);

  useEffect(() => {
    const storedCart = parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
    setItems(storedCart.items);
    setHasLoadedStoredCart(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredCart) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart({ items }));
  }, [hasLoadedStoredCart, items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((currentItems) => addCartItem(currentItems, item));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((currentItems) => updateCartItemQuantity(currentItems, itemId, quantity));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((currentItems) => removeCartItem(currentItems, itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      subtotal: calculateCartSubtotal(items),
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [addItem, clearCart, items, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
