"use client";

import { FormEvent, useState } from "react";
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
    <section className={styles.overlay} onClick={onClose}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
        >
          ×
        </button>

        <h1>Iniciar sesión</h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isSubmitting}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={isSubmitting}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
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
    </section>
  );
}