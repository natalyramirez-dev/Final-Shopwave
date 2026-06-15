"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import AdminGuard from "@/guards/AdminGuard";
import { adminOrderService } from "@/services/admin-order.service";
import { Order } from "@/models/order.model";
import styles from "@/components/ui/scss/admin.module.scss";

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, action: string) => {
    try {
      if (action === "CONFIRM") {
        await adminOrderService.confirmOrder(orderId);
      } else if (action === "SHIP") {
        await adminOrderService.shipOrder(orderId);
      } else if (action === "DELIVER") {
        await adminOrderService.deliverOrder(orderId);
      } else if (action === "CANCEL") {
        if (!window.confirm("¿Cancelar esta orden?")) return;
        await adminOrderService.cancelOrder(orderId);
      }
      await loadOrders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (orderId: number) => {
    if (!window.confirm("¿Eliminar permanentemente este registro?")) return;
    try {
      await adminOrderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Intl.DateTimeFormat("es-BO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(dateString));
  };

  return (
    <AdminGuard>
      <div className={styles.adminContainer}>
        <Navbar />
        <div className={styles.adminContent}>
          <div className={styles.header}>
            <h1>Gestión de Pedidos</h1>
            <p>Monitoreo global de órdenes y control de envíos.</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.card}>
            {loading ? (
              <div className={styles.adminLoading}>Cargando registros...</div>
            ) : (
              <div className={styles.tableResponsive}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Flujo de Envío</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                          No hay órdenes registradas en el sistema.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                          </td>
                          <td>{formatDate(order.orderDate)}</td>
                          <td>${order.totalDiscountedPrice}</td>
                          <td>
                            <span className={styles.statusPill}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td>
                            <div className={styles.statusActions}>
                              {order.orderStatus === "PENDING" && (
                                <button className={styles.actionBtn} onClick={() => handleUpdateStatus(order.id, "CONFIRM")}>
                                  Confirmar Pago
                                </button>
                              )}
                              {order.orderStatus === "CONFIRMED" && (
                                <button className={styles.actionBtn} onClick={() => handleUpdateStatus(order.id, "SHIP")}>
                                  Marcar Enviado
                                </button>
                              )}
                              {order.orderStatus === "SHIPPED" && (
                                <button className={styles.actionBtn} onClick={() => handleUpdateStatus(order.id, "DELIVER")}>
                                  Marcar Entregado
                                </button>
                              )}
                              {["PENDING", "CONFIRMED", "PLACED"].includes(order.orderStatus) && (
                                <button className={styles.cancelBtn} onClick={() => handleUpdateStatus(order.id, "CANCEL")}>
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <button className={styles.deleteBtn} onClick={() => handleDelete(order.id)}>
                                Borrar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}