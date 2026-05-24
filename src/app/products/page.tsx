"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import ProductCard from "@/components/products/ProductCard/ProductCard";
import { Product } from "@/models/product.model";
import { productService } from "@/services/product.service";
import Hero from "@/components/layout/Hero/Hero";
import styles from "./products.module.scss";
import productCardStyles from "@/components/ui/scss/ProductCard.module.scss";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        console.log("PRODUCTS:", response);
        setProducts(response);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>

      <div className={styles.hero}>
        <Hero />
      </div>

      <div className={styles.content}>
        <section className={styles.productsSection}>
          <div className={styles.header}>
            <h1>Nuestros Productos</h1>
            <p>{products.length} productos disponibles</p>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))
              ) : (
                <p>No hay productos disponibles</p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}