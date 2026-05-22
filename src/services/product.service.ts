import { fetchApi } from "./api.service";
import { Product } from "@/models/product.model";
import { PaginatedResponse } from "@/types/api-response.type";

export const productService = {
  getAllProducts: () => {
    return fetchApi<Product[]>("/products");
  },

  getFilteredProducts: (params: {
    category?: string;
    colors?: string[];
    sizes?: string[];
    minPrice?: number;
    maxPrice?: number;
    minDiscount?: number;
    sort?: string;
    stock?: string;
    pageNumber?: number;
    pageSize?: number;
  }) => {
    const query = new URLSearchParams();
    
    if (params.category) query.append("category", params.category);
    if (params.colors && params.colors.length) query.append("colors", params.colors.join(","));
    if (params.sizes && params.sizes.length) query.append("sizes", params.sizes.join(","));
    if (params.minPrice) query.append("minPrice", params.minPrice.toString());
    if (params.maxPrice) query.append("maxPrice", params.maxPrice.toString());
    if (params.minDiscount) query.append("minDiscount", params.minDiscount.toString());
    if (params.sort) query.append("sort", params.sort);
    if (params.stock) query.append("stock", params.stock);
    
    query.append("pageNumber", (params.pageNumber || 0).toString());
    query.append("pageSize", (params.pageSize || 10).toString());

    return fetchApi<PaginatedResponse<Product>>(`/products/all?${query.toString()}`);
  },

  getProductById: (productId: number) => {
    return fetchApi<Product>(`/products/${productId}`);
  },

  searchProducts: (query: string) => {
    return fetchApi<Product[]>(`/products/products/search?q=${encodeURIComponent(query)}`);
  }
};