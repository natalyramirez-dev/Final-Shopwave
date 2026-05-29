"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar/Navbar";
import AdminGuard from "@/guards/AdminGuard";
import { adminProductService } from "@/services/admin-product.service";
import { productService } from "@/services/product.service";
import { CreateProductRequest } from "@/models/product.model";
import styles from "@/components/ui/scss/admin.module.scss";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProductRequest>({
    title: "", description: "", price: 0, discountedPrice: 0, discountPersent: 0,
    quantity: 0, brand: "", color: "", imageUrl: "", topLevelCategory: "", 
    secondLevelCategory: "", thirdLevelCategory: "", size: [{ name: "M", quantity: 10 }], 
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await productService.getProductById(productId);
        setFormData({
          title: product.title || "", description: product.description || "", price: product.price || 0,
          discountedPrice: product.discountedPrice || 0, discountPersent: product.discountPersent || 0,
          quantity: product.quantity || 0, brand: product.brand || "", color: product.color || "",
          imageUrl: product.imageUrl || "",
          topLevelCategory: product.category?.parentCategory?.parentCategory?.name || "",
          secondLevelCategory: product.category?.parentCategory?.name || "",
          thirdLevelCategory: product.category?.name || "",
          size: product.sizes || [{ name: "M", quantity: 10 }],
        });
      } catch (err: any) {
        setError(err.message || "Error al cargar los datos");
      } finally {
        setFetching(false);
      }
    };
    if (productId) loadProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "discountedPrice", "discountPersent", "quantity"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      await adminProductService.updateProduct(productId, formData);
      router.push("/admin/products"); 
    } catch (err: any) {
      setError(err.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className={styles.adminContainer}>
        <Navbar />
        <div className={styles.adminContent}>
          <div className={styles.header}>
            <h1>Editar Producto #{productId}</h1>
          </div>

          <div className={styles.card}>
            {fetching ? (
              <div className={styles.adminLoading}>Cargando datos del producto...</div>
            ) : (
              <>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Título del Producto</label><input type="text" name="title" value={formData.title} onChange={handleChange} required /></div>
                  <div className={styles.formGroup}><label>Marca</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} required /></div>
                  <div className={styles.formGroup}><label>Precio Regular ($)</label><input type="number" name="price" value={formData.price} onChange={handleChange} min="0" required /></div>
                  <div className={styles.formGroup}><label>Precio con Descuento ($)</label><input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} min="0" required /></div>
                  <div className={styles.formGroup}><label>% de Descuento</label><input type="number" name="discountPersent" value={formData.discountPersent} onChange={handleChange} min="0" max="100" /></div>
                  <div className={styles.formGroup}><label>Stock Inicial (Cantidad)</label><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0" required /></div>
                  <div className={styles.formGroup}><label>Color</label><input type="text" name="color" value={formData.color} onChange={handleChange} required /></div>
                  <div className={styles.formGroup}><label>URL de la Imagen</label><input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required /></div>
                  <div className={styles.formGroup}><label>Categoría Principal (Ej: Men)</label><input type="text" name="topLevelCategory" value={formData.topLevelCategory} onChange={handleChange} required /></div>
                  <div className={styles.formGroup}><label>Sub Categoría (Ej: Clothing)</label><input type="text" name="secondLevelCategory" value={formData.secondLevelCategory} onChange={handleChange} required /></div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Descripción</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} required /></div>
                  
                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "Actualizando..." : "Guardar Cambios"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}