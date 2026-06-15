"use client";

import Link from "next/link";
import { Product } from "@/models/product.model";
import styles from "@/components/ui/scss/adminDashboard.module.scss";

interface StockAlertProps {
  products: Product[];
}

export default function StockAlerts({ products }: StockAlertProps) {
  const outOfStock = products.filter((p) => p.quantity === 0);
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 5);

  if (outOfStock.length === 0 && lowStock.length === 0) {
    return (
      <div className={styles.alertCard}>
        <div className={styles.alertCardHeader}>
          <h3 className={styles.alertCardTitle}>
            <span className={styles.alertIconGreen}>✓</span>
            Alertas de Inventario
          </h3>
        </div>
        <p className={styles.alertEmpty}>
          Todo el inventario está en buen estado.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.alertCard}>
      <div className={styles.alertCardHeader}>
        <h3 className={styles.alertCardTitle}>
          <span className={styles.alertIconRed}>⚠</span>
          Alertas de Inventario
        </h3>
        <Link href="/admin/products" className={styles.alertCardLink}>
          Ver todos →
        </Link>
      </div>

      {outOfStock.length > 0 && (
        <div className={styles.alertSection}>
          <div className={styles.alertSectionTitle}>
            <span className={styles.alertBadgeDanger}>
              {outOfStock.length} Sin Stock
            </span>
          </div>
          <div className={styles.alertList}>
            {outOfStock.slice(0, 4).map((p) => (
              <div key={p.id} className={styles.alertItem}>
                <img
                  src={p.imageUrl || "/placeholder.jpg"}
                  alt={p.title}
                  className={styles.alertItemImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className={styles.alertItemInfo}>
                  <span className={styles.alertItemName}>{p.title}</span>
                  <span className={styles.alertItemBrand}>{p.brand}</span>
                </div>
                <span className={styles.stockBadgeDanger}>0 uds</span>
              </div>
            ))}
            {outOfStock.length > 4 && (
              <p className={styles.alertMoreText}>+{outOfStock.length - 4} más sin stock</p>
            )}
          </div>
        </div>
      )}

      {lowStock.length > 0 && (
        <div className={styles.alertSection}>
          <div className={styles.alertSectionTitle}>
            <span className={styles.alertBadgeWarning}>
              {lowStock.length} Stock Bajo
            </span>
          </div>
          <div className={styles.alertList}>
            {lowStock.slice(0, 4).map((p) => (
              <div key={p.id} className={styles.alertItem}>
                <img
                  src={p.imageUrl || "/placeholder.jpg"}
                  alt={p.title}
                  className={styles.alertItemImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className={styles.alertItemInfo}>
                  <span className={styles.alertItemName}>{p.title}</span>
                  <span className={styles.alertItemBrand}>{p.brand}</span>
                </div>
                <span className={styles.stockBadgeWarning}>{p.quantity} uds</span>
              </div>
            ))}
            {lowStock.length > 4 && (
              <p className={styles.alertMoreText}>+{lowStock.length - 4} más con stock bajo</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
