"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { register } from "@/services/auth.service";
import styles from "@/components/ui/scss/auth-modal.module.scss";

type RegisterModalProps = {
  onClose: () => void;
  onSwitchToLogin: () => void;
};

export default function RegisterModal({
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await register({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
      });

      onSwitchToLogin();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo registrar al usuario. Intenta nuevamente";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-modal-title"
        className={styles.form}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar modal de registro"
        >
          ×
        </button>

        <h1 id="register-modal-title">Crear cuenta</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="register-firstName" className={styles.fieldLabel}>
            Nombre
          </label>
          <input
            ref={firstInputRef}
            id="register-firstName"
            placeholder="Nombre"
            value={form.firstName}
            onChange={(event) => handleChange("firstName", event.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="given-name"
          />

          <label htmlFor="register-lastName" className={styles.fieldLabel}>
            Apellido
          </label>
          <input
            id="register-lastName"
            placeholder="Apellido"
            value={form.lastName}
            onChange={(event) => handleChange("lastName", event.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="family-name"
          />

          <label htmlFor="register-email" className={styles.fieldLabel}>
            Correo electrónico
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="email"
          />

          <label htmlFor="register-password" className={styles.fieldLabel}>
            Contraseña
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              required
              minLength={6}
              disabled={isSubmitting}
              autoComplete="new-password"
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((current) => !current)}
              disabled={isSubmitting}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img
                src={showPassword ? "/close_eye.svg" : "/eye.svg"}
                alt=""
                className={styles.passwordIcon}
              />
            </button>
          </div>

          <label htmlFor="register-mobile" className={styles.fieldLabel}>
            Celular
          </label>
          <input
            id="register-mobile"
            type="tel"
            placeholder="Celular"
            value={form.mobile}
            onChange={(event) => handleChange("mobile", event.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="tel"
          />

          <div aria-live="polite" aria-atomic="true">
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrarme"}
          </button>

          <p className={styles.switchText}>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              className={styles.switchButton}
              onClick={onSwitchToLogin}
            >
              Inicia sesión
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
