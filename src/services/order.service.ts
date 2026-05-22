import { fetchApi } from "./api.service";
import { Order, CreateOrderRequest } from "@/models/order.model";

export const orderService = {
  createOrder: (orderRequest: CreateOrderRequest) => {
    return fetchApi<Order>("/orders/", {
      method: "POST",
      body: JSON.stringify(orderRequest),
    });
  },

  getUserOrderHistory: () => {
    return fetchApi<Order[]>("/orders/user");
  },

  getOrderById: (orderId: number) => {
    return fetchApi<Order>(`/orders/${orderId}`);
  }
};