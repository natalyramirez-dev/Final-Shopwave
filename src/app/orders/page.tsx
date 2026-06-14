"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar/Navbar";
import { AuthGuard } from "@/guards/AuthGuard";
import { orderService } from "@/services/order.service";
import { Order } from "@/models/order.model";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import styles from "@/components/ui/scss/orders.module.scss";

export default function OrdersHistoryPage() {
  return (
    <AuthGuard>
      <OrdersHistoryContent />
    </AuthGuard>
  );
}

function OrdersHistoryContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getUserOrderHistory();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "No se pudo cargar el historial de órdenes.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-BO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <main className={styles.container}>
      <Navbar />
      <section className={styles.content}>
        <div className={styles.header}>
          <h1>Mis Pedidos</h1>
          <p>Revisa el estado y el historial de todas tus compras.</p>
        </div>

        {loading ? (
          <div className={styles.ordersList}>
            {[1, 2, 3].map((index) => (
              <article key={index} className={styles.orderCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.orderMeta}>
                    <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "6rem" }}></div>
                    <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "8rem" }}></div>
                  </div>
                  <div className={`${styles.skeletonBox} ${styles.skeletonBadge}`}></div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.previewImages}>
                    <div className={`${styles.skeletonBox} ${styles.skeletonThumbnail}`}></div>
                    <div className={`${styles.skeletonBox} ${styles.skeletonThumbnail}`}></div>
                    <div className={`${styles.skeletonBox} ${styles.skeletonThumbnail}`}></div>
                  </div>
                  
                  <div className={styles.orderSummary}>
                    <div className={styles.summaryItem}>
                      <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "4rem", marginBottom: "0.25rem" }}></div>
                      <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "2rem" }}></div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "5rem", marginBottom: "0.25rem" }}></div>
                      <div className={`${styles.skeletonBox} ${styles.skeletonText}`} style={{ width: "6rem", height: "1.5rem" }}></div>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={`${styles.skeletonBox} ${styles.skeletonButton}`}></div>
                </div>
              </article>
            ))}
          </div>
        ) : error ? (
          <div className={styles.errorWrapper}>
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="Aún no tienes pedidos"
            description="Explora nuestro catálogo y realiza tu primera compra."
          />
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <article key={order.id} className={styles.orderCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderId}>Orden #{order.id}</span>
                    <span className={styles.orderDate}>{formatDate(order.orderDate)}</span>
                  </div>
                  <div className={`${styles.statusBadge} ${styles[order.orderStatus.toLowerCase()] || ""}`}>
                    {order.orderStatus}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.previewImages}>
                    {order.orderItems.slice(0, 3).map((item) => (
                      <img 
                        key={item.id} 
                        src={item.product.imageUrl} 
                        alt={item.product.title} 
                        className={styles.thumbnail}
                      />
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className={styles.extraItems}>
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.orderSummary}>
                    <div className={styles.summaryItem}>
                      <span className={styles.label}>Artículos</span>
                      <span className={styles.value}>{order.totalItem}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.label}>Total Pagado</span>
                      <span className={styles.valueTotal}>${order.totalDiscountedPrice}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`/orders/${order.id}`} className={styles.viewDetailsBtn}>
                    Ver detalles del pedido
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}