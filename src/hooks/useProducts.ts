import { useState, useEffect } from "react";
import { Product } from "@/models/product.model";
import { productService } from "@/services/product.service";

export const useProduct = (id: string | number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [prevProduct, setPrevProduct] = useState<Product | null>(null);
  const [nextProduct, setNextProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        // Carga el producto y la lista completa en paralelo (sin caché global)
        const [currentProduct, allProducts] = await Promise.all([
          productService.getProductById(Number(id)),
          productService.getAllProducts(),
        ]);

        if (cancelled) return;

        setProduct(currentProduct);

        const currentIndex = allProducts.findIndex(
          (p: Product) => p.id === Number(id)
        );

        setPrevProduct(currentIndex > 0 ? allProducts[currentIndex - 1] : null);
        setNextProduct(
          currentIndex !== -1 && currentIndex < allProducts.length - 1
            ? allProducts[currentIndex + 1]
            : null
        );
      } catch (err) {
        if (!cancelled) {
          setError("No pudimos cargar la información de este producto.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error, prevProduct, nextProduct };
};
