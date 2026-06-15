import { fetchApi } from "./api.service";
import { Order } from "@/models/order.model";

export const adminOrderService = {
  getAllOrders: (): Promise<Order[]> => {
    return fetchApi<Order[]>("/admin/orders/");
  },

  confirmOrder: (orderId: number): Promise<Order> => {
    return fetchApi<Order>(`/admin/orders/${orderId}/confirmed`, {
      method: "PUT",
    });
  },

  shipOrder: (orderId: number): Promise<Order> => {
    return fetchApi<Order>(`/admin/orders/${orderId}/ship`, {
      method: "PUT",
    });
  },

  deliverOrder: (orderId: number): Promise<Order> => {
    return fetchApi<Order>(`/admin/orders/${orderId}/deliver`, {
      method: "PUT",
    });
  },

  cancelOrder: (orderId: number): Promise<Order> => {
    return fetchApi<Order>(`/admin/orders/${orderId}/cancel`, {
      method: "PUT",
    });
  },

  deleteOrder: (orderId: number): Promise<any> => {
    return fetchApi<any>(`/admin/orders/${orderId}/delete`, {
      method: "DELETE",
    });
  },
};