"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import MetricCard from "@/components/admin/MetricCard";
import MiniBarChart from "@/components/admin/MiniBarChart";
import DonutChart from "@/components/admin/DonutChart";
import StockAlerts from "@/components/admin/StockAlerts";
import { productService } from "@/services/product.service";
import { adminOrderService } from "@/services/admin-order.service";
import { Product } from "@/models/product.model";
import { Order } from "@/models/order.model";
import { formatPrice } from "@/utils/currency.util";
import styles from "@/components/ui/scss/adminDashboard.module.scss";

// Utility: group orders by status
function countByStatus(orders: Order[]) {
  return orders.reduce(
    (acc, o) => {
      const s = o.orderStatus || "UNKNOWN";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

// Group orders by day (last 7)
function ordersByDay(orders: Order[]) {
  const days: Record<string, number> = {};
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("es-BO", { weekday: "short" });
    days[key] = 0;
  }
  orders.forEach((o) => {
    if (!o.orderDate) return;
    const d = new Date(o.orderDate);
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff <= 6) {
      const key = d.toLocaleDateString("es-BO", { weekday: "short" });
      if (key in days) days[key] = (days[key] || 0) + 1;
    }
  });
  return Object.entries(days).map(([label, value]) => ({ label, value }));
}

// Revenue by day
function revenueByDay(orders: Order[]) {
  const days: Record<string, number> = {};
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("es-BO", { weekday: "short" });
    days[key] = 0;
  }
  orders.forEach((o) => {
    if (!o.orderDate) return;
    const d = new Date(o.orderDate);
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff <= 6) {
      const key = d.toLocaleDateString("es-BO", { weekday: "short" });
      if (key in days) days[key] = (days[key] || 0) + (o.totalDiscountedPrice || 0);
    }
  });
  return Object.entries(days).map(([label, value]) => ({ label, value }));
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PLACED: "#3b82f6",
  CONFIRMED: "#8b5cf6",
  SHIPPED: "#06b6d4",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PLACED: "Colocado",
  CONFIRMED: "Confirmado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("es-BO", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [prods, ords] = await Promise.all([
          productService.getAllProducts(),
          adminOrderService.getAllOrders(),
        ]);
        setProducts(prods || []);
        setOrders(ords || []);
      } catch (err: any) {
        setError(err.message || "Error cargando datos del dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ─── Derived metrics ───────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + (o.totalDiscountedPrice || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 5).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "DELIVERED").length;
  const pendingOrders = orders.filter((o) =>
    ["PENDING", "PLACED", "CONFIRMED"].includes(o.orderStatus)
  ).length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusCounts = countByStatus(orders);
  const donutData = Object.entries(statusCounts)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      label: STATUS_LABELS[key] || key,
      value,
      color: STATUS_COLORS[key] || "#9ca3af",
    }));

  const ordersChartData = ordersByDay(orders);
  const revenueChartData = revenueByDay(orders);
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 6);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className={styles.dashboardLoading}>
          <div className={styles.loadingSpinner} />
          <p>Cargando dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Resumen ejecutivo en tiempo real de tu plataforma"
    >
      {error && (
        <div className={styles.dashboardError}>
          <span>⚠</span> {error}
        </div>
      )}

      {/* ─── Metric Cards ─────────────────────────────────────── */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Ingresos Totales"
          value={formatPrice(totalRevenue)}
          subtitle="Ventas acumuladas"
          icon="$"
          variant="accent"
        />
        <MetricCard
          title="Total Órdenes"
          value={totalOrders}
          subtitle={`${pendingOrders} pendientes`}
          icon="◎"
          variant="default"
        />
        <MetricCard
          title="Entregadas"
          value={deliveredOrders}
          subtitle={`${totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0}% del total`}
          icon="✓"
          variant="success"
        />
        <MetricCard
          title="Ticket Promedio"
          value={formatPrice(avgOrderValue)}
          subtitle="Por orden"
          icon="≈"
          variant="default"
        />
        <MetricCard
          title="Total Productos"
          value={totalProducts}
          subtitle="En catálogo"
          icon="◈"
          variant="default"
        />
        <MetricCard
          title="Sin Stock"
          value={outOfStock}
          subtitle={`${lowStock} con stock bajo`}
          icon="!"
          variant={outOfStock > 0 ? "danger" : "success"}
        />
      </div>

      {/* ─── Charts Row ───────────────────────────────────────── */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <MiniBarChart
            data={ordersChartData}
            title="Órdenes — últimos 7 días"
            color="#e8410a"
            height={110}
          />
        </div>
        <div className={styles.chartCard}>
          <MiniBarChart
            data={revenueChartData}
            title="Ingresos — últimos 7 días ($)"
            color="#0a0a0f"
            height={110}
          />
        </div>
        <div className={styles.chartCard}>
          <DonutChart data={donutData} title="Estado de Órdenes" size={150} />
        </div>
      </div>

      {/* ─── Bottom Row ───────────────────────────────────────── */}
      <div className={styles.bottomGrid}>
        {/* Recent Orders */}
        <div className={styles.recentOrdersCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Órdenes Recientes</h3>
            <Link href="/admin/orders" className={styles.cardLink}>
              Ver todas →
            </Link>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.dashTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.tableEmpty}>
                      No hay órdenes registradas.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.orderId}>#{order.id}</td>
                      <td>
                        {order.shippingAddress?.firstName}{" "}
                        {order.shippingAddress?.lastName}
                      </td>
                      <td className={styles.orderAmount}>
                        {formatPrice(order.totalDiscountedPrice)}
                      </td>
                      <td>
                        <span
                          className={styles.statusPill}
                          style={{
                            backgroundColor:
                              (STATUS_COLORS[order.orderStatus] || "#6b7280") + "20",
                            color: STATUS_COLORS[order.orderStatus] || "#6b7280",
                          }}
                        >
                          {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                        </span>
                      </td>
                      <td className={styles.orderDate}>
                        {formatDate(order.orderDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts */}
        <StockAlerts products={products} />
      </div>
    </AdminLayout>
  );
}
