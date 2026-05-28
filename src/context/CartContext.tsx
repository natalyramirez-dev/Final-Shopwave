"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart, CartItem } from "@/models/cart.model";
import { cartService } from "@/services/cart.service";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
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
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
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
      console.error("Error al actualizar cantidad:", error);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await cartService.removeCartItem(cartItemId);
      await fetchCart(); 
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};