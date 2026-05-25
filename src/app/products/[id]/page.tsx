"use client";

import { use } from "react";
import Link from "next/link";
import { useProduct } from "@/hooks/useProducts";
import { formatCurrency } from "@/utils/currency.util";
import styles from "@/components/ui/scss/productDetail.module.scss";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <main className={styles.centered}>
        <p>Cargando detalles...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className={styles.errorContainer}>
        <h2>{error}</h2>
        <Link href="/products" className={styles.backLink}>← Volver al catálogo</Link>
      </main>
    );
  }

  const isAvailable = product.quantity > 0;

  return (
    <main className={styles.mainContainer}>
      <Link href="/products" className={styles.backLink}>
        ← Volver al catálogo
      </Link>

      <div className={styles.card}>
        {/* Imagen del producto */}
        <div className={styles.imageContainer}>
          <img src={product.imageUrl} alt={product.title} />
        </div>

        {/* Detalles e información */}
        <div className={styles.detailsContainer}>
          <div>
            <span className={styles.brandCategory}>
              {product.brand} • {product.category.name}
            </span>
            <h1 className={styles.title}>{product.title}</h1>
          </div>
          
          {/* Precios */}
          <div className={styles.priceContainer}>
            <h2 className={styles.currentPrice}>
              {formatCurrency(product.discountedPrice || product.price)}
            </h2>
            {product.discountPersent > 0 && (
              <>
                <span className={styles.originalPrice}>
                  {formatCurrency(product.price)}
                </span>
                <span className={styles.discountBadge}>
                  -{product.discountPersent}%
                </span>
              </>
            )}
          </div>
          
          <p className={styles.description}>
            {product.description}
          </p>

          {/* Tallas disponibles */}
          {product.sizes && product.sizes.length > 0 && (
            <div className={styles.sizesSection}>
              <p>Tallas disponibles:</p>
              <div className={styles.sizesList}>
                {product.sizes.map((size) => (
                  <span 
                    key={size.name} 
                    className={`${styles.sizeBadge} ${size.quantity > 0 ? styles.available : styles.unavailable}`}
                  >
                    {size.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Acciones */}
          <div className={styles.actionSection}>
            <p>
              Disponibilidad: <span className={isAvailable ? styles.inStock : styles.outOfStock}>
                {isAvailable ? `${product.quantity} en stock` : 'Agotado'}
              </span>
            </p>
            <button 
              disabled={!isAvailable}
              className={`${styles.addToCartBtn} ${isAvailable ? styles.available : styles.unavailable}`}
            >
              {isAvailable ? 'Añadir al carrito' : 'Sin stock'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}