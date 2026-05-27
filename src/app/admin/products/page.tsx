"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/guards/AdminGuard";
import { productService } from "@/services/product.service";
import { adminProductService } from "@/services/admin-product.service";
import { Product } from "@/models/product.model";
import styles from "@/components/ui/scss/admin.module.scss";

export default function AdminProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) return;
    
    try {
      await adminProductService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Producto eliminado con éxito");
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <AdminGuard>
      <div className={styles.adminContainer}>
        <div className={styles.header}>
          <h1>Gestión de Productos</h1>
          <Link href="/admin/products/create" className={styles.createBtn}>
            + Nuevo Producto
          </Link>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {loading ? (
          <div className={styles.adminLoading}>Cargando catálogo...</div>
        ) : (
          <div className={styles.tableWrapper}>
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
                    <td colSpan={7} className={styles.emptyTable}>No hay productos registrados.</td>
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
    </AdminGuard>
  );
}