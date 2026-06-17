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

function ProductSkeletonCard() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: "80%" }} />
        <div className={styles.skeletonLine} style={{ width: "40%" }} />
        <div className={styles.skeletonPrice} />
      </div>
    </div>
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
          <h1>Productos</h1>

          <p>Explora todos los productos disponibles en la tienda.</p>
        </div>

        <label htmlFor="products-search" className={styles.srOnly}>
          Buscar productos
        </label>
        <input
          id="products-search"
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
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </section>

      <section className={styles.productsSection}>
        {loading ? (
          <div
            className={styles.productsGrid}
            role="status"
            aria-label="Cargando productos"
          >
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <ProductSkeletonCard key={i} />
            ))}
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
        <nav className={styles.pagination} aria-label="Paginación de productos">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            aria-label="Página anterior"
          >
            Prev
          </button>

          <span aria-live="polite" aria-atomic="true">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            aria-label="Página siguiente"
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}
