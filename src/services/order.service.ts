import { fetchApi } from "./api.service";
import { Order, CreateOrderRequest } from "@/models/order.model";

export const orderService = {
  createOrder: (payload: CreateOrderRequest): Promise<Order> => {
    return fetchApi<Order>("/orders/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getUserOrderHistory: (): Promise<Order[]> => {
    return fetchApi<Order[]>("/orders/user");
  },

  getOrderById: (orderId: number): Promise<Order> => {
    return fetchApi<Order>(`/orders/${orderId}`);
  }
};