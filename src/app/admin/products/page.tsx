"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import { productService } from "@/services/product.service";
import { adminProductService } from "@/services/admin-product.service";
import { Product } from "@/models/product.model";
import { CreateProductRequest } from "@/models/product.model";
import ProductForm from "@/components/admin/ProductForm";
import { formatPrice } from "@/utils/currency.util";
import styles from "@/components/ui/scss/adminDashboard.module.scss";

const PAGE_SIZE = 10;

type StockFilter = "all" | "ok" | "low" | "out";
type SortField = "id" | "title" | "price" | "quantity";
type SortDir = "asc" | "desc";

function getStockStatus(qty: number) {
  if (qty === 0) return "out";
  if (qty <= 5) return "low";
  return "ok";
}

export default function AdminProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    data: CreateProductRequest;
    originalCategory?: any;
  } | null>(null);

  // Table controls
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadProducts();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, stockFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  // ─── Derived state ────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      );
    }

    if (stockFilter !== "all") {
      result = result.filter((p) => getStockStatus(p.quantity) === stockFilter);
    }

    result.sort((a, b) => {
      let va: any = a[sortField];
      let vb: any = b[sortField];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, search, stockFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Stock summary counts
  const outCount = products.filter((p) => p.quantity === 0).length;
  const lowCount = products.filter((p) => p.quantity > 0 && p.quantity <= 5).length;
  const okCount = products.filter((p) => p.quantity > 5).length;

  // ─── Handlers ────────────────────────────────────────────────
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    const productData: CreateProductRequest = {
      title: product.title || "",
      description: product.description || "",
      price: product.price || 0,
      discountedPrice: product.discountedPrice || 0,
      discountPersent: product.discountPersent || 0,
      quantity: product.quantity || 0,
      brand: product.brand || "",
      color: product.color || "",
      imageUrl: product.imageUrl || "",
      topLevelCategory: product.category?.parentCategory?.parentCategory?.name || "",
      secondLevelCategory: product.category?.parentCategory?.name || "",
      thirdLevelCategory: product.category?.name || "",
      size: product.sizes || [{ name: "M", quantity: 10 }],
    };
    setSelectedProduct({
      id: product.id,
      data: productData,
      originalCategory: product.category,
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (data: CreateProductRequest) => {
    try {
      if (modalMode === "edit" && selectedProduct) {
        const updatePayload: any = {
          ...data,
          sizes: data.size,
          category: {
            id: selectedProduct.originalCategory?.id,
            name: data.thirdLevelCategory,
            parentCategory: {
              id: selectedProduct.originalCategory?.parentCategory?.id,
              name: data.secondLevelCategory,
              parentCategory: {
                id: selectedProduct.originalCategory?.parentCategory?.parentCategory?.id,
                name: data.topLevelCategory,
              },
            },
          },
        };
        delete updatePayload.size;
        delete updatePayload.topLevelCategory;
        delete updatePayload.secondLevelCategory;
        delete updatePayload.thirdLevelCategory;
        await adminProductService.updateProduct(selectedProduct.id, updatePayload);
      } else {
        await adminProductService.createProduct(data);
      }
      handleCloseModal();
      await loadProducts();
    } catch (err: any) {
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) return;
    try {
      await adminProductService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <main className={styles.pageWrapper}>
        <Navbar />
        <div className={styles.dashboardContent}>
          <div className={styles.tableLoading}>
            <div className={styles.loadingSpinner} />
            <p>Cargando catálogo...</p>
          </div>
        </div>
      </main>
    );
  }
  // ─── Render ──────────────────────────────────────────────────
  return (
    <main className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.dashboardContent}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Gestión de Productos</h1>
            <p className={styles.pageSubtitle}>{products.length} productos en catálogo</p>
          </div>
          <button className={styles.primaryBtn} onClick={handleOpenCreate}>
            + Nuevo Producto
          </button>
        </div>
      {error && <div className={styles.errorBanner}><span>⚠</span> {error}</div>}

      {/* Stock Summary Chips */}
      <div className={styles.stockSummary}>
        <button
          className={`${styles.stockChip} ${stockFilter === "all" ? styles.stockChipActive : ""}`}
          onClick={() => setStockFilter("all")}
        >
          Todos <span className={styles.chipCount}>{products.length}</span>
        </button>
        <button
          className={`${styles.stockChip} ${styles.stockChipOk} ${stockFilter === "ok" ? styles.stockChipActive : ""}`}
          onClick={() => setStockFilter("ok")}
        >
          ✓ OK <span className={styles.chipCount}>{okCount}</span>
        </button>
        <button
          className={`${styles.stockChip} ${styles.stockChipLow} ${stockFilter === "low" ? styles.stockChipActive : ""}`}
          onClick={() => setStockFilter("low")}
        >
          ⚡ Stock bajo <span className={styles.chipCount}>{lowCount}</span>
        </button>
        <button
          className={`${styles.stockChip} ${styles.stockChipOut} ${stockFilter === "out" ? styles.stockChipActive : ""}`}
          onClick={() => setStockFilter("out")}
        >
          ✕ Sin stock <span className={styles.chipCount}>{outCount}</span>
        </button>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        {/* Toolbar */}
        <div className={styles.tableToolbar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              type="text"
              placeholder="Buscar por nombre, marca, categoría o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>
          <div className={styles.tableInfo}>
            {filtered.length !== products.length && (
              <span className={styles.filterCount}>
                {filtered.length} de {products.length} resultados
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className={styles.tableLoading}>
            <div className={styles.loadingSpinner} />
            <p>Cargando catálogo...</p>
          </div>
        ) : (
          <div className={styles.tableResponsiveWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th
                    className={styles.sortableCol}
                    onClick={() => handleSort("id")}
                  >
                    ID{sortIndicator("id")}
                  </th>
                  <th>Imagen</th>
                  <th
                    className={styles.sortableCol}
                    onClick={() => handleSort("title")}
                  >
                    Producto{sortIndicator("title")}
                  </th>
                  <th>Categoría</th>
                  <th
                    className={styles.sortableCol}
                    onClick={() => handleSort("price")}
                  >
                    Precio{sortIndicator("price")}
                  </th>
                  <th
                    className={styles.sortableCol}
                    onClick={() => handleSort("quantity")}
                  >
                    Stock{sortIndicator("quantity")}
                  </th>
                  <th>Descuento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.tableEmpty}>
                      {search || stockFilter !== "all"
                        ? "No hay productos que coincidan con los filtros."
                        : "No hay productos registrados."}
                    </td>
                  </tr>
                ) : (
                  paginated.map((product) => {
                    const stock = getStockStatus(product.quantity);
                    return (
                      <tr key={product.id} className={styles.tableRow}>
                        <td className={styles.cellId}>#{product.id}</td>
                        <td>
                          <img
                            src={product.imageUrl || "/placeholder.jpg"}
                            alt={product.title}
                            className={styles.productThumb}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/56x56?text=N/A";
                            }}
                          />
                        </td>
                        <td>
                          <div className={styles.productCell}>
                            <span className={styles.productName}>{product.title}</span>
                            <span className={styles.productBrand}>{product.brand}</span>
                          </div>
                        </td>
                        <td className={styles.cellCategory}>
                          {product.category?.name || "—"}
                        </td>
                        <td>
                          <div className={styles.priceCell}>
                            <span className={styles.priceMain}>
                              {formatPrice(product.discountedPrice || product.price)}
                            </span>
                            {product.discountedPrice < product.price && (
                              <span className={styles.priceOriginal}>
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`${styles.stockBadge} ${
                              stock === "out"
                                ? styles.stockBadgeDanger
                                : stock === "low"
                                ? styles.stockBadgeWarning
                                : styles.stockBadgeOk
                            }`}
                          >
                            {product.quantity} uds
                          </span>
                        </td>
                        <td>
                          {product.discountPersent > 0 ? (
                            <span className={styles.discountBadge}>
                              -{product.discountPersent}%
                            </span>
                          ) : (
                            <span className={styles.noDiscount}>—</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              className={styles.editBtn}
                              onClick={() => handleOpenEdit(product)}
                              title="Editar producto"
                            >
                              ✎ Editar
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDelete(product.id)}
                              title="Eliminar producto"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
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
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedProduct?.data ?? null}
        mode={modalMode}
        productId={selectedProduct?.id}
      />
      </div>
    </main>
  );
}
