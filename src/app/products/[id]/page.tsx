"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar/Navbar";
import { AuthGuard } from "@/guards/AuthGuard";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/currency.util";
import styles from "@/components/ui/scss/productDetail.module.scss";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { product, loading, error, prevProduct, nextProduct } = useProduct(id);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      const firstAvailable = product.sizes.find((s) => s.quantity > 0);
      if (firstAvailable) setSelectedSize(firstAvailable.name);
    }
  }, [product]);

  if (loading) {
    return (
      <AuthGuard>
        <main className={styles.container}>
          <Navbar />
          <div className={styles.centered} role="status" aria-label="Cargando producto">
            <div className={styles.loadingSpinner} aria-hidden="true" />
            <p>Cargando detalles...</p>
          </div>
        </main>
      </AuthGuard>
    );
  }

  if (error || !product) {
    return (
      <AuthGuard>
        <main className={styles.container}>
          <Navbar />
          <div className={styles.errorContainer} role="alert">
            <h2>{error}</h2>
            <Link href="/products" className={styles.backLink}>
              ← Volver al catálogo
            </Link>
          </div>
        </main>
      </AuthGuard>
    );
  }

  const isAvailable = product.quantity > 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    setShowSuccess(false);
    setCartError(null);

    try {
      const finalSize =
        selectedSize || (product.sizes?.length > 0 ? product.sizes[0].name : "M");
      await addToCart(product.id, finalSize, quantity);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch {
      setCartError(
        "Hubo un error al añadir el producto al carrito. Por favor intenta de nuevo."
      );
      setTimeout(() => setCartError(null), 4000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <AuthGuard>
      <main className={styles.container}>
        <Navbar />

        <div className={styles.content}>
          <Link href="/products" className={styles.backLink}>
            ← Volver al catálogo
          </Link>

          <div className={styles.navigationWrapper}>

            {/* LÓGICA DEL CARRUSEL: Botón Anterior */}
            {prevProduct ? (
              <Link href={`/products/${prevProduct.id}`} className={`${styles.navControl} ${styles.prev}`} aria-label={`Producto anterior: ${prevProduct.title}`}>
                <div className={styles.navButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div className={styles.sidePreview}>
                  <img src={prevProduct.imageUrl} alt={prevProduct.title} />
                </div>
              </Link>
            ) : (
              <div className={`${styles.navControl} ${styles.prev} ${styles.disabled}`} aria-hidden="true">
                <div className={styles.navButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
              </div>
            )}

            {/* === TARJETA DE PRODUCTO === */}
            <div className={styles.card}>
              <div className={styles.flipCardInner}>

                {/*frontal*/}
                <div className={styles.flipCardFront}>
                  <div className={styles.imageContainer}>
                    <img src={product.imageUrl} alt={product.title} />
                  </div>

                  <div className={styles.frontDetails}>
                    <div>
                      <span className={styles.brandCategory}>
                        {product.brand} • {product.category?.name}
                      </span>
                      <h1 className={styles.title}>{product.title}</h1>
                    </div>
                    <p className={styles.description}>{product.description}</p>
                  </div>
                </div>

                {/* vuelta*/}
                <div className={styles.flipCardBack}>
                  <div className={styles.backDetails}>

                    <div className={styles.priceContainer}>
                      <h2 className={styles.currentPrice}>
                        {formatCurrency(product.discountedPrice || product.price)}
                      </h2>

                      {product.price > product.discountedPrice && (
                        <>
                          <span className={styles.originalPrice}>
                            {formatCurrency(product.price)}
                          </span>
                          <span className={styles.discountBadge}>
                            -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
                          </span>
                        </>
                      )}
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                      <div className={styles.sizesSection}>
                        <p>Tallas disponibles:</p>
                        <div className={styles.sizesList} role="group" aria-label="Selecciona una talla">
                          {product.sizes.map((size) => {
                            const isSizeAvailable = size.quantity > 0;
                            return (
                              <button
                                key={size.name}
                                disabled={!isSizeAvailable}
                                onClick={() => setSelectedSize(size.name)}
                                aria-pressed={selectedSize === size.name}
                                className={`${styles.sizeBadge} ${
                                  isSizeAvailable ? styles.available : styles.unavailable
                                } ${selectedSize === size.name ? styles.selected : ""}`}
                              >
                                {size.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {isAvailable && (
                      <div className={styles.quantitySelector}>
                        <p>Cantidad:</p>
                        <div className={styles.quantityControls} role="group" aria-label="Cantidad de unidades">
                          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} aria-label="Reducir cantidad">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </button>
                          <span aria-live="polite" aria-atomic="true">{quantity}</span>
                          <button onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))} disabled={quantity >= product.quantity} aria-label="Aumentar cantidad">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className={styles.actionSection}>
                      <p>
                        Disponibilidad:{" "}
                        <span className={isAvailable ? styles.inStock : styles.outOfStock}>
                          {isAvailable ? `${product.quantity} en stock` : "Agotado"}
                        </span>
                      </p>

                      <button
                        disabled={!isAvailable || isAdding || !selectedSize}
                        onClick={handleAddToCart}
                        aria-busy={isAdding}
                        className={`${styles.addToCartBtn} ${
                          isAvailable && selectedSize ? styles.available : styles.unavailable
                        }`}
                      >
                        {isAdding ? "Añadiendo..." : isAvailable ? "Añadir al carrito" : "Sin stock"}
                      </button>

                      {/* P-08: aria-live envuelve los mensajes de éxito/error */}
                      <div aria-live="polite" aria-atomic="true">
                        {showSuccess && (
                          <div className={styles.successMessage} role="status">
                            Producto añadido al carrito exitosamente
                          </div>
                        )}
                        {cartError && (
                          <div className={styles.cartErrorMessage} role="alert">
                            {cartError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LÓGICA DEL CARRUSEL: Botón Siguiente */}
            {nextProduct ? (
              <Link href={`/products/${nextProduct.id}`} className={`${styles.navControl} ${styles.next}`} aria-label={`Producto siguiente: ${nextProduct.title}`}>
                <div className={styles.sidePreview}>
                  <img src={nextProduct.imageUrl} alt={nextProduct.title} />
                </div>
                <div className={styles.navButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </Link>
            ) : (
              <div className={`${styles.navControl} ${styles.next} ${styles.disabled}`} aria-hidden="true">
                <div className={styles.navButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
