"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar/Navbar";
import { AuthGuard } from "@/guards/AuthGuard";
import { orderService } from "@/services/order.service";
import { Order } from "@/models/order.model";
import styles from "@/components/ui/scss/orderDetails.module.scss";

export default function OrderDetailsPage() {
  return (
    <AuthGuard>
      <OrderDetailsContent />
    </AuthGuard>
  );
}

function OrderDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(Number(orderId));
      setOrder(data);
    } catch (err: any) {
      setError(err.message || "No se pudo cargar la orden.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <Navbar />
        <section className={styles.content}>
          <div className={`${styles.skeletonBox} ${styles.skeletonBanner}`}></div>
          <div className={styles.orderGrid}>
            <div className={styles.mainCol}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={`${styles.skeletonBox} ${styles.skeletonTitle}`}></div>
                  <div className={`${styles.skeletonBox} ${styles.skeletonTitle}`} style={{ width: "5rem" }}></div>
                </div>
                <div className={styles.itemsList}>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className={styles.orderItem}>
                      <div className={`${styles.skeletonBox} ${styles.itemImage}`}></div>
                      <div className={styles.itemDetails}>
                        <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "70%", marginBottom: "0.5rem" }}></div>
                        <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "40%" }}></div>
                      </div>
                      <div className={styles.itemPricing}>
                        <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "3rem", marginBottom: "0.5rem" }}></div>
                        <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "4rem", height: "1.5rem" }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.sideCol}>
              <div className={styles.card}>
                <div className={`${styles.skeletonBox} ${styles.skeletonTitle}`} style={{ marginBottom: "1.5rem" }}></div>
                <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ marginBottom: "1rem" }}></div>
                <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ marginBottom: "1rem" }}></div>
                <div className={styles.divider}></div>
                <div className={`${styles.skeletonBox} ${styles.skeletonTitle}`} style={{ height: "2rem" }}></div>
              </div>
              <div className={styles.card}>
                <div className={`${styles.skeletonBox} ${styles.skeletonTitle}`} style={{ marginBottom: "1.5rem" }}></div>
                <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ marginBottom: "0.5rem", width: "60%" }}></div>
                <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ marginBottom: "0.5rem" }}></div>
                <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "80%" }}></div>
              </div>
              <div className={styles.card}>
                <div className={`${styles.skeletonBox} ${styles.skeletonTitle}`} style={{ marginBottom: "1.5rem" }}></div>
                <div className={`${styles.skeletonBox} ${styles.skeletonBadge}`}></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className={styles.container}>
        <Navbar />
        <div className={styles.errorWrapper}>
          <h2>Orden no encontrada</h2>
          <p>{error}</p>
          <button onClick={() => router.push("/products")} className={styles.backBtn}>
            Volver a la tienda
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Navbar />
      <section className={styles.content}>
        <div className={styles.successBanner}>
          <div className={styles.iconCircle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>¡Gracias por tu compra!</h1>
          <p>Tu orden ha sido confirmada y está siendo procesada.</p>
        </div>

        <div className={styles.orderGrid}>
          <div className={styles.mainCol}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Artículos del pedido</h2>
                <span className={styles.orderId}>Orden #{order.id}</span>
              </div>
              
              <div className={styles.itemsList}>
                {order.orderItems.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.title} 
                      className={styles.itemImage} 
                    />
                    <div className={styles.itemDetails}>
                      <h3>{item.product.title}</h3>
                      <p className={styles.brand}>{item.product.brand}</p>
                      <p className={styles.size}>Talla: {item.size}</p>
                    </div>
                    <div className={styles.itemPricing}>
                      <span className={styles.quantity}>Cant: {item.quantity}</span>
                      <span className={styles.price}>${item.discountedPrice.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sideCol}>
            <div className={styles.card}>
              <h2>Resumen del pago</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span className={styles.summaryValue}>${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Descuento</span>
                <span className={styles.discount}>- ${order.discounte.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span className={styles.summaryValue}>Gratis</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.totalRow}>
                <span>Total pagado</span>
                <span>${order.totalDiscountedPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Dirección de envío</h2>
              <div className={styles.addressInfo}>
                <p className={styles.name}>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.streetAddress}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>Tel: {order.shippingAddress.mobile}</p>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Estado del pedido</h2>
              <div className={`${styles.statusBadge} ${styles[order.orderStatus.toLowerCase()] || ""}`}>
                {order.orderStatus}
              </div>
            </div>
            
            <Link href="/" className={styles.continueBtn}>
              Seguir Comprando
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}