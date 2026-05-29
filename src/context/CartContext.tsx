"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart } from "@/models/cart.model";
import { cartService } from "@/services/cart.service";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  addToCart: (productId: number, size: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getUserCart();
      setCart(data);
    } catch (error: any) {
      // Si el backend devuelve error de carrito nulo, simplemente dejamos el carrito vacío
      // en vez de romper la app — el carrito se creará cuando el usuario agregue su primer producto
      const isCartNull = error?.message?.toLowerCase().includes("null");
      if (!isCartNull) console.error(error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await cartService.updateCartItem(cartItemId, { quantity });
      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await cartService.removeCartItem(cartItemId);
      await fetchCart(); 
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (productId: number, size: string, quantity: number) => {
    try {
      const existingItem = (cart?.cartItems || []).find(
        (item) => item.product.id === productId && item.size === size
      );

      if (existingItem) {
        await cartService.updateCartItem(existingItem.id, {
          quantity: existingItem.quantity + quantity
        });
      } else {
        const newItem = await cartService.addItemToCart({ productId, size, quantity });

        if (quantity > 1 && newItem && newItem.id) {
          await cartService.updateCartItem(newItem.id, { quantity });
        }
      }
      
      await fetchCart();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, updateQuantity, removeItem, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};