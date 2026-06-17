"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import { adminOrderService } from "@/services/admin-order.service";
import { Order } from "@/models/order.model";
import { formatPrice } from "@/utils/currency.util";
import styles from "@/components/ui/scss/adminDashboard.module.scss";

type StatusFilter = "all" | "PENDING" | "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type SortField = "id" | "orderDate" | "totalDiscountedPrice";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PLACED: "Colocado",
  CONFIRMED: "Confirmado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PLACED: "#3b82f6",
  CONFIRMED: "#8b5cf6",
  SHIPPED: "#06b6d4",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("es-BO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // P-04: error de acción (reemplaza alert())
  const [adminError, setAdminError] = useState<string | null>(null);
  // P-04: confirmación inline por fila (reemplaza window.confirm())
  const [confirmingId, setConfirmingId] = useState<{
    orderId: number;
    action: "CANCEL" | "DELETE";
  } | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("orderDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.getAllOrders();
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  const showAdminError = (msg: string) => {
    setAdminError(msg);
    setTimeout(() => setAdminError(null), 4000);
  };

  // ─── Derived ─────────────────────────────────────────────────
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const filtered = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          String(o.id).includes(q) ||
          o.shippingAddress?.firstName?.toLowerCase().includes(q) ||
          o.shippingAddress?.lastName?.toLowerCase().includes(q) ||
          o.shippingAddress?.city?.toLowerCase().includes(q) ||
          o.orderId?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }

    result.sort((a, b) => {
      let va: any, vb: any;
      if (sortField === "orderDate") {
        va = new Date(a.orderDate || 0).getTime();
        vb = new Date(b.orderDate || 0).getTime();
      } else if (sortField === "totalDiscountedPrice") {
        va = a.totalDiscountedPrice || 0;
        vb = b.totalDiscountedPrice || 0;
      } else {
        va = a.id;
        vb = b.id;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalDiscountedPrice || 0), 0);

  // ─── Handlers ────────────────────────────────────────────────
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };
  const si = (field: SortField) => sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  const handleUpdateStatus = async (orderId: number, action: string) => {
    if (action === "CANCEL") {
      setConfirmingId({ orderId, action: "CANCEL" });
      return;
    }
    try {
      setActionLoading(orderId);
      if (action === "CONFIRM") await adminOrderService.confirmOrder(orderId);
      else if (action === "SHIP") await adminOrderService.shipOrder(orderId);
      else if (action === "DELIVER") await adminOrderService.deliverOrder(orderId);
      await loadOrders();
    } catch (err: any) {
      showAdminError(err.message || "No se pudo actualizar el estado de la orden.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmingId) return;
    const { orderId, action } = confirmingId;
    setConfirmingId(null);

    try {
      setActionLoading(orderId);
      if (action === "CANCEL") {
        await adminOrderService.cancelOrder(orderId);
        await loadOrders();
      } else if (action === "DELETE") {
        await adminOrderService.deleteOrder(orderId);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (err: any) {
      showAdminError(err.message || "No se pudo completar la acción.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (orderId: number) => {
    setConfirmingId({ orderId, action: "DELETE" });
  };

  const statusFilterTabs: { value: StatusFilter; label: string }[] = [
    { value: "all", label: `Todos (${orders.length})` },
    { value: "PENDING", label: `Pendiente (${statusCounts.PENDING || 0})` },
    { value: "PLACED", label: `Colocado (${statusCounts.PLACED || 0})` },
    { value: "CONFIRMED", label: `Confirmado (${statusCounts.CONFIRMED || 0})` },
    { value: "SHIPPED", label: `Enviado (${statusCounts.SHIPPED || 0})` },
    { value: "DELIVERED", label: `Entregado (${statusCounts.DELIVERED || 0})` },
    { value: "CANCELLED", label: `Cancelado (${statusCounts.CANCELLED || 0})` },
  ];

return (
  <main className={styles.pageWrapper}>
    <Navbar />
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gestión de Órdenes</h1>
          <p className={styles.pageSubtitle}>
            Monitoreo global de {orders.length} pedidos · Ingresos: {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      {error && <div className={styles.errorBanner} role="alert"><span aria-hidden="true">⚠</span> {error}</div>}

      {/* P-08: error de acción con aria-live */}
      <div aria-live="polite" aria-atomic="true">
        {adminError && (
          <div className={styles.errorBanner} role="alert">
            <span aria-hidden="true">⚠</span> {adminError}
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className={styles.statusTabs} role="tablist" aria-label="Filtrar por estado">
        {statusFilterTabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={statusFilter === tab.value}
            className={`${styles.statusTab} ${statusFilter === tab.value ? styles.statusTabActive : ""}`}
            onClick={() => setStatusFilter(tab.value)}
            style={
              statusFilter === tab.value && tab.value !== "all"
                ? {
                    borderColor: STATUS_COLORS[tab.value] || "#e8410a",
                    color: STATUS_COLORS[tab.value] || "#e8410a",
                  }
                : {}
            }
          >
            {tab.value !== "all" && (
              <span
                className={styles.statusTabDot}
                style={{ backgroundColor: STATUS_COLORS[tab.value] }}
                aria-hidden="true"
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        {/* Toolbar */}
        <div className={styles.tableToolbar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">⌕</span>
            <label htmlFor="admin-orders-search" className={styles.srOnly}>Buscar órdenes</label>
            <input
              id="admin-orders-search"
              type="text"
              placeholder="Buscar por ID, cliente o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch("")} aria-label="Limpiar búsqueda">✕</button>
            )}
          </div>
          {filtered.length !== orders.length && (
            <span className={styles.filterCount} aria-live="polite">
              {filtered.length} de {orders.length} resultados
            </span>
          )}
        </div>

        {loading ? (
          <div className={styles.tableLoading} role="status" aria-label="Cargando órdenes">
            <div className={styles.loadingSpinner} aria-hidden="true" />
            <p>Cargando órdenes...</p>
          </div>
        ) : (
          <div className={styles.tableResponsiveWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th className={styles.sortableCol} onClick={() => handleSort("id")}>
                    ID{si("id")}
                  </th>
                  <th>Cliente</th>
                  <th>Destino</th>
                  <th className={styles.sortableCol} onClick={() => handleSort("orderDate")}>
                    Fecha{si("orderDate")}
                  </th>
                  <th className={styles.sortableCol} onClick={() => handleSort("totalDiscountedPrice")}>
                    Total{si("totalDiscountedPrice")}
                  </th>
                  <th>Items</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.tableEmpty}>
                      {search || statusFilter !== "all"
                        ? "No hay órdenes que coincidan con los filtros."
                        : "No hay órdenes registradas."}
                    </td>
                  </tr>
                ) : (
                  paginated.map((order) => {
                    const isConfirming = confirmingId?.orderId === order.id;
                    return (
                    <tr key={order.id} className={`${styles.tableRow} ${actionLoading === order.id ? styles.tableRowLoading : ""}`}>
                      <td className={styles.cellId}>#{order.id}</td>
                      <td>
                        <div className={styles.customerCell}>
                          <div className={styles.customerAvatar} aria-hidden="true">
                            {(order.shippingAddress?.firstName?.[0] || "?").toUpperCase()}
                          </div>
                          <div>
                            <div className={styles.customerName}>
                              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                            </div>
                            <div className={styles.customerPhone}>
                              {order.shippingAddress?.mobile || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.cellLocation}>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </td>
                      <td className={styles.cellDate}>{formatDate(order.orderDate)}</td>
                      <td>
                        <span className={styles.amountText}>
                          {formatPrice(order.totalDiscountedPrice)}
                        </span>
                        {order.discounte > 0 && (
                          <span className={styles.discountBadge}>
                            -{formatPrice(order.discounte)}
                          </span>
                        )}
                      </td>
                      <td className={styles.cellItems}>{order.totalItem} ítem(s)</td>
                      <td>
                        <span
                          className={styles.statusPillDynamic}
                          style={{
                            backgroundColor: (STATUS_COLORS[order.orderStatus] || "#6b7280") + "20",
                            color: STATUS_COLORS[order.orderStatus] || "#6b7280",
                          }}
                        >
                          {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                        </span>
                      </td>
                      <td>
                        {/* P-04: confirmación inline en vez de window.confirm() */}
                        {isConfirming ? (
                          <div className={styles.confirmRow}>
                            <span className={styles.confirmText}>
                              {confirmingId!.action === "DELETE" ? "¿Eliminar?" : "¿Cancelar?"}
                            </span>
                            <button className={styles.confirmYesBtn} onClick={handleConfirmAction}>Sí</button>
                            <button className={styles.confirmNoBtn} onClick={() => setConfirmingId(null)}>No</button>
                          </div>
                        ) : (
                          <div className={styles.orderActions}>
                            {order.orderStatus === "PENDING" && (
                              <button
                                className={styles.flowBtn}
                                onClick={() => handleUpdateStatus(order.id, "CONFIRM")}
                                disabled={actionLoading === order.id}
                                title="Confirmar pago"
                              >
                                ✓ Confirmar
                              </button>
                            )}
                            {order.orderStatus === "CONFIRMED" && (
                              <button
                                className={styles.flowBtn}
                                onClick={() => handleUpdateStatus(order.id, "SHIP")}
                                disabled={actionLoading === order.id}
                                title="Marcar como enviado"
                              >
                                ✈ Enviar
                              </button>
                            )}
                            {order.orderStatus === "SHIPPED" && (
                              <button
                                className={styles.flowBtn}
                                onClick={() => handleUpdateStatus(order.id, "DELIVER")}
                                disabled={actionLoading === order.id}
                                title="Marcar como entregado"
                              >
                                ⊕ Entregar
                              </button>
                            )}
                            {["PENDING", "PLACED", "CONFIRMED"].includes(order.orderStatus) && (
                              <button
                                className={styles.cancelFlowBtn}
                                onClick={() => handleUpdateStatus(order.id, "CANCEL")}
                                disabled={actionLoading === order.id}
                                title="Cancelar orden"
                              >
                                ✕
                              </button>
                            )}
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDelete(order.id)}
                              title="Eliminar registro"
                            >
                              🗑
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );})
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Página {currentPage} de {totalPages} ({filtered.length} resultados)
            </span>
            <div className={styles.paginationControls}>
              <button className={styles.pageBtn} onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
              <button className={styles.pageBtn} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) page = i + 1;
                else if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
                return (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              <button className={styles.pageBtn} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
              <button className={styles.pageBtn} onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  </main>
);
}
