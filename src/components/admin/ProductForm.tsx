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

type FieldErrors = Partial<Record<keyof CreateProductRequest, string>>;

function validate(formData: CreateProductRequest): FieldErrors {
  const errors: FieldErrors = {};

  if (!formData.title.trim()) {
    errors.title = "El título es obligatorio.";
  } else if (formData.title.trim().length < 3) {
    errors.title = "El título debe tener al menos 3 caracteres.";
  }

  if (!formData.brand.trim()) {
    errors.brand = "La marca es obligatoria.";
  }

  if (formData.price == null || formData.price === (""  as unknown as number)) {
    errors.price = "El precio es obligatorio.";
  } else if (Number(formData.price) <= 0) {
    errors.price = "El precio debe ser mayor a 0.";
  }

  if (formData.discountedPrice == null || formData.discountedPrice === ("" as unknown as number)) {
    errors.discountPersent = "El descuento debe estar entre 0 y 100.";
  }

  if (formData.quantity == null || formData.quantity === ("" as unknown as number)) {
    errors.discountedPrice = "El precio con descuento es obligatorio.";
  } else if (Number(formData.discountedPrice) < 0) {
    errors.discountedPrice = "El precio con descuento no puede ser negativo.";
  } else if (Number(formData.price) > 0 && Number(formData.discountedPrice) > Number(formData.price)) {
    errors.discountedPrice = "No puede ser mayor al precio regular.";
  }

  if (formData.quantity == null || formData.quantity === ("" as unknown as number)) {
    errors.quantity = "El stock es obligatorio.";
  } else if (Number(formData.quantity) < 0) {
    errors.quantity = "El stock no puede ser negativo.";
  }

  if (!formData.color.trim()) {
    errors.color = "El color es obligatorio.";
  }

  if (!formData.imageUrl.trim()) {
    errors.imageUrl = "La URL de la imagen es obligatoria.";
  } else {
    try {
      new URL(formData.imageUrl);
    } catch {
      errors.imageUrl = "Ingresa una URL válida (https://...).";
    }
  }

  if (!formData.topLevelCategory.trim()) {
    errors.topLevelCategory = "La categoría principal es obligatoria.";
  }

  if (!formData.secondLevelCategory.trim()) {
    errors.secondLevelCategory = "La sub categoría es obligatoria.";
  }

  if (!formData.thirdLevelCategory.trim()) {
    errors.thirdLevelCategory = "La categoría específica es obligatoria.";
  }

  if (!formData.description.trim()) {
    errors.description = "La descripción es obligatoria.";
  } else if (formData.description.trim().length < 10) {
    errors.description = "La descripción debe tener al menos 10 caracteres.";
  }

  return errors;
}

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  productId,
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductRequest>(defaultFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CreateProductRequest, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setLoading(false);
      setFieldErrors({});
      setTouched({});
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

      if (touched[name as keyof CreateProductRequest]) {
        const errs = validate(next);
        setFieldErrors((prev) => ({ ...prev, [name]: errs[name as keyof CreateProductRequest] }));
      }

      return next;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(formData);
    setFieldErrors((prev) => ({ ...prev, [name]: errs[name as keyof CreateProductRequest] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(defaultFormData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as typeof touched
    );
    setTouched(allTouched);

    const errs = validate(formData);
    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) {
      setSubmitError("Corrige los errores antes de continuar.");
      return;
    }

    setLoading(true);
    setSubmitError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setSubmitError(
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

  const Field = ({
    label,
    name,
    children,
    fullWidth,
  }: {
    label: string;
    name: keyof CreateProductRequest;
    children: React.ReactNode;
    fullWidth?: boolean;
  }) => (
    <div className={`${styles.formGroup} ${fullWidth ? styles.fullWidth : ""}`}>
      <label>{label}</label>
      {children}
      {fieldErrors[name] && (
        <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
          {fieldErrors[name]}
        </span>
      )}
    </div>
  );

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
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleBlock}>
            <span className={styles.modalBadge}>{isEdit ? "Edición" : "Nuevo"}</span>
            <h2 id="modal-title" className={styles.modalTitle}>
              {isEdit ? `Editar Producto #${productId}` : "Crear Nuevo Producto"}
            </h2>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar formulario" type="button">
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          {submitError && <div className={styles.errorMessage}>{submitError}</div>}

          <form onSubmit={handleSubmit} noValidate className={styles.formGrid}>
            <Field label="Título del Producto" name="title">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Chaqueta de cuero premium"
              />
            </Field>

            <Field label="Marca" name="brand">
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Nike, Adidas..."
              />
            </Field>

            <Field label="Precio Regular ($)" name="price">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
              />
            </Field>

            <Field label="% de Descuento" name="discountPersent">
              <input
                type="number"
                name="discountPersent"
                value={formData.discountPersent}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
                max="100"
                placeholder="0"
              />
            </Field>

            <Field label="Precio con Descuento ($)" name="discountedPrice">
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
              />
            </Field>

            <Field label="Stock Inicial (Cantidad)" name="quantity">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
              />
            </Field>

            <Field label="Color" name="color">
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Negro, Rojo..."
              />
            </Field>

            <Field label="URL de la Imagen" name="imageUrl">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://..."
              />
            </Field>

            <Field label="Categoría Principal (Ej: Hombre)" name="topLevelCategory">
              <input
                type="text"
                name="topLevelCategory"
                value={formData.topLevelCategory}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Hombre, Mujer..."
              />
            </Field>

            <Field label="Sub Categoría (Ej: Ropa)" name="secondLevelCategory">
              <input
                type="text"
                name="secondLevelCategory"
                value={formData.secondLevelCategory}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Ropa, Calzado..."
              />
            </Field>

            <Field label="Categoría Específica (Ej: Poleras)" name="thirdLevelCategory">
              <input
                type="text"
                name="thirdLevelCategory"
                value={formData.thirdLevelCategory}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Poleras, Jeans..."
              />
            </Field>

            <Field label="Descripción (máx. 250 caracteres)" name="description" fullWidth>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                maxLength={250}
                placeholder="Describe el producto brevemente..."
              />
              <small className={styles.charCount}>
                {formData.description.length}/250
              </small>
            </Field>

            <div className={`${styles.modalActions} ${styles.fullWidth}`}>
              <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
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