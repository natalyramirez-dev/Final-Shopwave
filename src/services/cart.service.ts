import { fetchApi } from "./api.service";
import { Cart, CartItem } from "@/models/cart.model";
import { ApiResponse } from "@/types/api-response.type";

export const cartService = {
  getUserCart: (): Promise<Cart> => {
    return fetchApi<Cart>("/cart/");
  },

  addItemToCart: (data: { productId: number; size: string; quantity: number }): Promise<CartItem> => {
    return fetchApi<CartItem>("/cart/add", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updateCartItem: (cartItemId: number, data: { quantity: number }): Promise<CartItem> => {
    return fetchApi<CartItem>(`/cart_items/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  removeCartItem: (cartItemId: number): Promise<ApiResponse<any>> => {
    return fetchApi<ApiResponse<any>>(`/cart_items/${cartItemId}`, {
      method: "DELETE",
    });
  },
};