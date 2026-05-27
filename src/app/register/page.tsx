"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth.service";
import styles from "@/components/ui/scss/register.module.scss";

export default function RegisterPage() {
  const router = useRouter();

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
      await register(form);
      router.push("/login");
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
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Link href="/" className={styles.backButton}>
          ← Volver al inicio
        </Link>

        <h1>Crear cuenta</h1>

        <input
          placeholder="Nombre"
          value={form.firstName}
          onChange={(event) => handleChange("firstName", event.target.value)}
          required
        />

        <input
          placeholder="Apellido"
          value={form.lastName}
          onChange={(event) => handleChange("lastName", event.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(event) => handleChange("email", event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(event) => handleChange("password", event.target.value)}
          required
        />

        <input
          placeholder="Celular"
          value={form.mobile}
          onChange={(event) => handleChange("mobile", event.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </main>
  );
}