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
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      const firstAvailable = product.sizes.find(s => s.quantity > 0);
      if (firstAvailable) setSelectedSize(firstAvailable.name);
    }
  }, [product]);

  if (loading) {
    return (
      <AuthGuard>
        <main className={styles.container}>
          <Navbar />
          <div className={styles.centered}>
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
          <div className={styles.errorContainer}>
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

    try {
      const finalSize = selectedSize || (product.sizes?.length > 0 ? product.sizes[0].name : "M");
      await addToCart(product.id, finalSize, quantity);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      alert("Hubo un error al añadir el producto al carrito. Por favor intenta de nuevo.");
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

          {/*principal */}
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
                      <div className={styles.sizesList}>
                        {product.sizes.map((size) => {
                          const isSizeAvailable = size.quantity > 0;
                          return (
                            <button
                              key={size.name}
                              disabled={!isSizeAvailable}
                              onClick={() => setSelectedSize(size.name)}
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
                      <div className={styles.quantityControls}>
                        <button 
                          onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                          disabled={quantity <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <span>{quantity}</span>
                        <button 
                          onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))} 
                          disabled={quantity >= product.quantity}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
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
                      className={`${styles.addToCartBtn} ${
                        isAvailable && selectedSize ? styles.available : styles.unavailable
                      }`}
                    >
                      {isAdding ? "Añadiendo..." : isAvailable ? "Añadir al carrito" : "Sin stock"}
                    </button>

                    {showSuccess && (
                      <div className={styles.successMessage}>
                        Producto añadido al carrito exitosamente
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </AuthGuard>
  );
}