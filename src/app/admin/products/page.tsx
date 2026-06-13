"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import AdminGuard from "@/guards/AdminGuard";
import { productService } from "@/services/product.service";
import { adminProductService } from "@/services/admin-product.service";
import { Product } from "@/models/product.model";
import { CreateProductRequest } from "@/models/product.model";
import ProductForm from "@/components/admin/ProductForm";
import styles from "@/components/ui/scss/admin.module.scss";

export default function AdminProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    data: CreateProductRequest;
  } | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (product: Product) => {
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
    setSelectedProduct({ id: product.id, data: productData });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (data: CreateProductRequest) => {
    if (modalMode === "edit" && selectedProduct) {
      await adminProductService.updateProduct(selectedProduct.id, data);
    } else {
      await adminProductService.createProduct(data);
    }
    await loadProducts();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await adminProductService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <AdminGuard>
      <div className={styles.adminContainer}>
        <Navbar />
        <div className={styles.adminContent}>
          <div className={styles.header}>
            <h1>Gestión de Productos</h1>
            <button className={styles.createBtn} onClick={handleOpenCreate}>
              + Nuevo Producto
            </button>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.card}>
            {loading ? (
              <div className={styles.adminLoading}>Cargando catálogo...</div>
            ) : (
              <div className={styles.tableResponsive}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Imagen</th>
                      <th>Título</th>
                      <th>Marca</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{ textAlign: "center", color: "#777" }}
                        >
                          No hay productos registrados.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className={styles.productImage}
                            />
                          </td>
                          <td>{product.title}</td>
                          <td>{product.brand}</td>
                          <td>${product.price}</td>
                          <td>{product.quantity}</td>
                          <td>
                            <div className={styles.actions}>
                              <button
                                className={styles.editBtn}
                                onClick={() => handleOpenEdit(product)}
                              >
                                Editar
                              </button>
                              <button
                                className={styles.deleteBtn}
                                onClick={() => handleDelete(product.id)}
                              >
                                Eliminar
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

      {/* Modal reutilizable */}
      <ProductForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedProduct?.data ?? null}
        mode={modalMode}
        productId={selectedProduct?.id}
      />
    </AdminGuard>
  );
}
