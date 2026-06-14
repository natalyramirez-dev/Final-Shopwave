"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart } from "@/models/cart.model";
import { cartService } from "@/services/cart.service";

interface Coupon {
  code: string;
  discount: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  addToCart: (productId: number, size: string, quantity: number) => Promise<void>;
  
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  extraDiscountAmount: number;
  finalCalculatedTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_COUPONS: Record<string, number> = {
  "SHOPWAVE": 5,
  "DAHBNER": 10,
  "QUEZADA": 20
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getUserCart();
      setCart(data);
    } catch (error) {
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

  const applyCoupon = (code: string): boolean => {
    const upperCode = code.trim().toUpperCase();
    if (VALID_COUPONS[upperCode]) {
      setAppliedCoupon({ code: upperCode, discount: VALID_COUPONS[upperCode] });
      return true;
    }
    setAppliedCoupon(null);
    return false;
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const baseTotal = cart?.totalDiscountedPrice || 0;
  const extraDiscountAmount = appliedCoupon ? (baseTotal * (appliedCoupon.discount / 100)) : 0;
  const finalCalculatedTotal = baseTotal - extraDiscountAmount;

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        loading, 
        fetchCart, 
        updateQuantity, 
        removeItem, 
        addToCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        extraDiscountAmount,
        finalCalculatedTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};