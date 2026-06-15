import { fetchApi } from "./api.service";
import { Product, CreateProductRequest } from "@/models/product.model";
import { ApiResponse } from "@/types/api-response.type";

export const adminProductService = {
  createProduct: (data: CreateProductRequest): Promise<Product> => {
    return fetchApi<Product>("/admin/products/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateProduct: (productId: number, data: any): Promise<Product> => {
    return fetchApi<Product>(`/admin/products/${productId}/update`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteProduct: (productId: number): Promise<ApiResponse<any>> => {
    return fetchApi<ApiResponse<any>>(`/admin/products/${productId}/delete`, {
      method: "DELETE",
    });
  },
};