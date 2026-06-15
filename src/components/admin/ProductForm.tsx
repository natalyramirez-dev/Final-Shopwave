"use client";

import { useState, useEffect, useRef } from "react";
import { CreateProductRequest } from "@/models/product.model";
import styles from "@/components/ui/scss/adminDashboard.module.scss";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductRequest) => Promise<void>;
  initialData?: CreateProductRequest | null;
  mode: "create" | "edit";
  productId?: number;
}

const defaultFormData: CreateProductRequest = {
  title: "",
  description: "",
  price: "" as unknown as number,
  discountedPrice: "" as unknown as number,
  discountPersent: "" as unknown as number,
  quantity: "" as unknown as number,
  brand: "",
  color: "",
  imageUrl: "",
  topLevelCategory: "",
  secondLevelCategory: "",
  thirdLevelCategory: "",
  size: [{ name: "M", quantity: 10 }],
};

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  productId,
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductRequest>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoading(false);
      setFormData(mode === "edit" && initialData ? initialData : defaultFormData);
    }
  }, [isOpen, mode, initialData]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const parsedValue = ["price", "discountedPrice", "discountPersent", "quantity"].includes(name)
        ? (value === "" ? ("" as unknown as number) : Number(value))
        : value;

      const next = { ...prev, [name]: parsedValue };

      if (name === "price" || name === "discountPersent") {
        const price = name === "price" ? parsedValue : prev.price;
        const discount = name === "discountPersent" ? parsedValue : prev.discountPersent;
        if (price !== "" && discount !== "" && Number(price) > 0 && Number(discount) >= 0) {
          next.discountedPrice = Math.round(Number(price) * (1 - Number(discount) / 100));
        } else {
          next.discountedPrice = "" as unknown as number;
        }
      }

      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(
        err.message?.toLowerCase().includes("data too long")
          ? "La descripción es demasiado larga. Por favor acórtala."
          : err.message || "Ocurrió un error. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  const isEdit = mode === "edit";

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleBlock}>
            <span className={styles.modalBadge}>
              {isEdit ? "Edición" : "Nuevo"}
            </span>
            <h2 id="modal-title" className={styles.modalTitle}>
              {isEdit ? `Editar Producto #${productId}` : "Crear Nuevo Producto"}
            </h2>
          </div>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Cerrar formulario"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body scrolleable */}
        <div className={styles.modalBody}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Título del Producto</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Chaqueta de cuero premium"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Marca</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Ej: Nike, Adidas..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio Regular ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>% de Descuento</label>
              <input
                type="number"
                name="discountPersent"
                value={formData.discountPersent}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio con Descuento ($)</label>
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Stock Inicial (Cantidad)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Ej: Negro, Rojo..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>URL de la Imagen</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoría Principal (Ej: Hombre)</label>
              <input
                type="text"
                name="topLevelCategory"
                value={formData.topLevelCategory}
                onChange={handleChange}
                placeholder="Ej: Hombre, Mujer..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Sub Categoría (Ej: Ropa)</label>
              <input
                type="text"
                name="secondLevelCategory"
                value={formData.secondLevelCategory}
                onChange={handleChange}
                placeholder="Ej: Ropa, Calzado..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoría Específica (Ej: Poleras)</label>
              <input
                type="text"
                name="thirdLevelCategory"
                value={formData.thirdLevelCategory}
                onChange={handleChange}
                placeholder="Ej: Poleras, Jeans..."
                required
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Descripción (máx. 250 caracteres)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={250}
                placeholder="Describe el producto brevemente..."
                required
              />
              <small className={styles.charCount}>
                {formData.description.length}/250
              </small>
            </div>

            {/* Acciones del formulario */}
            <div className={`${styles.modalActions} ${styles.fullWidth}`}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading
                  ? isEdit ? "Guardando..." : "Creando..."
                  : isEdit ? "Guardar Cambios" : "Crear Producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
