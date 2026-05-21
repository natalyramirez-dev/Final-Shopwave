"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "@/components/ui/scss/login.module.scss";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await login({ email, password });
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </main>
  );
}