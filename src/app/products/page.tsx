"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar/Navbar";
import Hero from "@/components/layout/Hero/Hero";

import ProductCard from "@/components/products/ProductCard/ProductCard";

import EmptyState from "@/components/ui/EmptyState/EmptyState";

import { Product } from "@/models/product.model";

import { productService } from "@/services/product.service";

import styles from "@/components/ui/scss/products.module.scss";

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
      <Navbar />

      <Hero />

      <section className={styles.productsSection}>
        <div className={styles.header}>
          <h1>Nuestros Productos</h1>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Cargando productos...</p>
          </div>
        ) : products.length > 0 ? (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No hay productos disponibles"
            description="Actualmente no existen productos en la tienda."
          />
        )}
      </section>
    </main>
  );
}