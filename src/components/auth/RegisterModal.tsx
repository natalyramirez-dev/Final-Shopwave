"use client";

import { FormEvent, useState } from "react";
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

        <h1>Crear cuenta</h1>

        <input
          placeholder="Nombre"
          value={form.firstName}
          onChange={(event) => handleChange("firstName", event.target.value)}
          required
          disabled={isSubmitting}
        />

        <input
          placeholder="Apellido"
          value={form.lastName}
          onChange={(event) => handleChange("lastName", event.target.value)}
          required
          disabled={isSubmitting}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(event) => handleChange("email", event.target.value)}
          required
          disabled={isSubmitting}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(event) => handleChange("password", event.target.value)}
          required
          minLength={6}
          disabled={isSubmitting}
        />

        <input
          type="tel"
          placeholder="Celular"
          value={form.mobile}
          onChange={(event) => handleChange("mobile", event.target.value)}
          required
          disabled={isSubmitting}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
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
    </section>
  );
}