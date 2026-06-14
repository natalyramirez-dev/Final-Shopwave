"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar/Navbar";
import CartItem from "@/components/cart/CartItem/CartItem";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import { useCart } from "@/context/CartContext";
import { AuthGuard } from "@/guards/AuthGuard";
import styles from "@/components/ui/scss/cart.module.scss";

export default function CartPage() {
  return (
    <AuthGuard>
      <CartContent />
    </AuthGuard>
  );
}

function CartContent() {
  const { 
    cart, 
    loading,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    extraDiscountAmount,
    finalCalculatedTotal
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState({ type: "", text: "" });

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    const success = applyCoupon(couponCode);
    if (success) {
      setCouponMessage({ type: "success", text: "¡El cupón fue aplicado con éxito!" });
    } else {
      setCouponMessage({ type: "error", text: "Cupón inválido o expirado." });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setCouponMessage({ type: "", text: "" });
  };

  return (
    <main className={styles.container}>
      <Navbar />
      
      <section className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>Tu Carrito</h1>
            <p>Revisa los artículos antes de proceder al pago.</p>
          </div>
          <span className={styles.itemCount}>
            {cart?.totalItem || 0} {cart?.totalItem === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>

        {!cart && loading ? (
          <div className={styles.emptyCart}>
             <p className={styles.emptyMessage}>Cargando carrito...</p>
          </div>
        ) : !cart?.cartItems?.length ? (
          <div className={styles.emptyCart}>
            <EmptyState
              title="Tu carrito está vacío"
              description="Explora nuestros productos y añade tus favoritos."
            />
          </div>
        ) : (
          <div className={styles.cartGrid}>
            <div className={styles.itemsList}>
              {cart.cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className={styles.summary}>
              <h2>Resumen del pedido</h2>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${cart.totalPrice}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Descuento de tienda</span>
                <span className={styles.discount}>- ${cart.discounte}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span>Gratis</span>
              </div>

              {}
              <div className={styles.couponSection}>
                <p>¿Tienes un código de descuento?</p>
                <div className={styles.couponInputGroup}>
                  <input 
                    type="text" 
                    placeholder="Ej. CODIGOCUPON" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={appliedCoupon !== null}
                    className={styles.couponInput}
                  />
                  {!appliedCoupon ? (
                    <button onClick={handleApplyCoupon} className={styles.applyBtn}>
                      Aplicar
                    </button>
                  ) : (
                    <button onClick={handleRemoveCoupon} className={`${styles.applyBtn} ${styles.removeBtn}`}>
                      Quitar
                    </button>
                  )}
                </div>
                {couponMessage.text && (
                  <span className={`${styles.couponMessage} ${styles[couponMessage.type]}`}>
                    {couponMessage.text}
                  </span>
                )}
              </div>

              {appliedCoupon && (
                <div className={`${styles.summaryRow} ${styles.extraDiscountRow}`}>
                  <span>Cupón {appliedCoupon.code} ({appliedCoupon.discount}%)</span>
                  <span className={styles.extraDiscount}>- ${extraDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <span>Total</span>
                <span>${finalCalculatedTotal.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className={styles.checkoutBtn}>
                Proceder al pago
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}