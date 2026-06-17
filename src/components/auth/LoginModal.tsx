"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "@/components/ui/scss/auth-modal.module.scss";

type LoginModalProps = {
  onClose: () => void;
  onSwitchToRegister: () => void;
};

export default function LoginModal({
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      onClose();
    } catch {
      setError("Correo o contraseña incorrectos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className={styles.form}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar modal de inicio de sesión"
        >
          ×
        </button>

        <h1 id="login-modal-title">Iniciar sesión</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email" className={styles.fieldLabel}>
            Correo electrónico
          </label>
          <input
            ref={firstInputRef}
            id="login-email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="email"
          />

          <label htmlFor="login-password" className={styles.fieldLabel}>
            Contraseña
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isSubmitting}
              autoComplete="current-password"
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
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>

          <p className={styles.switchText}>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className={styles.switchButton}
              onClick={onSwitchToRegister}
            >
              Regístrate
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
