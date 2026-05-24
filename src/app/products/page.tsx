"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import ProductCard from "@/components/products/ProductCard/ProductCard";
import { Product } from "@/models/product.model";
import { productService } from "@/services/product.service";
import styles from "../../components/ui/scss/ProductCard.module.scss";
import Hero from "@/components/layout/Hero/Hero";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productService.getAllProducts();

        if (response.length === 0) {
      setProducts([
        {
          id: 1,
          title: "Nike Air Max",
          description: "Modern sneakers",
          price: 200,
          discountedPrice: 150,
          discountPersent: 25,
          quantity: 10,
          brand: "Nike",
          color: "Black",
          sizes: [],
          imageUrl: "https://picsum.photos/400/400",
          numRatings: 5,
          category: {
            id: 1,
            name: "Shoes",
            level: 1,
          },
          createdAt: "",
        },
      ]);
    } else {
      setProducts(response);
}
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
        <h1>Products</h1>
        <p>{products.length} products loaded</p>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}