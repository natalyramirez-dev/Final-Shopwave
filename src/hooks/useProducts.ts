import { useState, useEffect } from "react";
import { Product } from "@/models/product.model";
import { productService } from "@/services/product.service";

export const useProduct = (id: string | number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        setError("No pudimos cargar la información de este producto.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  return { product, loading, error };
};