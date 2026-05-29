"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/layout/Navbar/Navbar";
import ProductCard from "@/components/products/ProductCard/ProductCard";
import EmptyState from "@/components/ui/EmptyState/EmptyState";

import { Product } from "@/models/product.model";
import { productService } from "@/services/product.service";

import styles from "@/components/ui/scss/products.module.scss";
import { AuthGuard } from "@/guards/AuthGuard";

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  return (
    <AuthGuard>
      <ProductsContent />
    </AuthGuard>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

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

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products.map((product) => product.category?.name || "Other")
    );

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <main className={styles.container}>
      <Navbar />

      <section className={styles.header}>
        <div>
          <h1>Products</h1>

          <p>Explore all available products in the store.</p>
        </div>

        <input
          type="text" 
          placeholder="Search products..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
          className={styles.searchInput}
        />
      </section>

      <section className={styles.filtersSection}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.filterButton} ${
              selectedCategory === category ? styles.activeFilter : ""
            }`}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
          >
            {category}
          </button>
        ))}
      </section>

      <section className={styles.productsSection}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Loading products...</p>
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products found"
            description="Try another search or category."
          />
        )}
      </section>

      {totalPages > 1 && (
        <section className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </section>
      )}
    </main>
  );
}