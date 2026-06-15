import { useState, useEffect } from "react";
import { Product } from "@/models/product.model";
import { productService } from "@/services/product.service";


const productCache: Record<string, Product> = {};
let allProductsCache: Product[] | null = null;

export const useProduct = (id: string | number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [prevId, setPrevId] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {

        if (!productCache[id]) {
          setLoading(true);
        }

        let currentProduct = productCache[id];
        if (!currentProduct) {
          currentProduct = await productService.getProductById(Number(id));
          productCache[id] = currentProduct; // Lo guardamos en caché para la próxima vez
        }
        setProduct(currentProduct);

        // 2. CARGAMOS LA LISTA PARA LA NAVEGACIÓN (Solo si no la hemos cargado antes)
        if (!allProductsCache) {
          allProductsCache = await productService.getAllProducts(); 
        }
        
        // 3. Calculamos la posición usando el caché
        const currentIndex = allProductsCache.findIndex((p: Product) => p.id === Number(id));

        if (currentIndex > 0) {
          setPrevId(allProductsCache[currentIndex - 1].id);
        } else {
          setPrevId(null);
        }

        if (currentIndex !== -1 && currentIndex < allProductsCache.length - 1) {
          setNextId(allProductsCache[currentIndex + 1].id);
        } else {
          setNextId(null);
        }
      } catch (err) {
        setError("No pudimos cargar la información de este producto.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  return { product, loading, error, prevId, nextId };
};