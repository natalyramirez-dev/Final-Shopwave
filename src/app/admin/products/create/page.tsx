"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar/Navbar";
import AdminGuard from "@/guards/AdminGuard";
import { adminProductService } from "@/services/admin-product.service";
import { CreateProductRequest } from "@/models/product.model";
import styles from "@/components/ui/scss/admin.module.scss";

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProductRequest>({
    title: "", description: "", price: 0, discountedPrice: 0, discountPersent: 0,
    quantity: 0, brand: "", color: "", imageUrl: "", topLavelCategory: "", 
    secondLavelCategory: "", thirdLavelCategory: "", size: [{ name: "M", quantity: 10 }], 
  });

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
      await adminProductService.createProduct(formData);
      router.push("/admin/products"); 
    } catch (err: any) {
      setError(err.message || "Error al crear el producto");
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
            <h1>Crear Nuevo Producto</h1>
          </div>

          <div className={styles.card}>
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
              <div className={styles.formGroup}><label>Categoría Principal (Ej: Men)</label><input type="text" name="topLavelCategory" value={formData.topLavelCategory} onChange={handleChange} required /></div>
              <div className={styles.formGroup}><label>Sub Categoría (Ej: Clothing)</label><input type="text" name="secondLavelCategory" value={formData.secondLavelCategory} onChange={handleChange} required /></div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Descripción</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} required /></div>
              
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Creando..." : "Crear Producto"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}