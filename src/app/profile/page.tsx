"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/utils/token.util";
import styles from "@/components/ui/scss/profile.module.scss";

interface TokenPayload {
  iss: string;
  sub: string;
  username: string;
  authorities: string;
  iat: number;
  exp: number;
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { logout } = useAuth();
  const [payload, setPayload] = useState<TokenPayload | null>(null);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const decodedPayload = JSON.parse(atob(token.split(".")[1]));
      setPayload(decodedPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  if (!payload) {
    return (
      <main className={styles.container}>
        <section className={styles.card}>
          <p>Cargando perfil...</p>
        </section>
      </main>
    );
  }

  const expirationDate = new Date(payload.exp * 1000);

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <div className={styles.avatar}>
          {payload.username.charAt(0).toUpperCase()}
        </div>

        <div className={styles.header}>
          <p className={styles.label}>Mi perfil</p>
          <h1>{payload.username}</h1>
          <span className={styles.role}>{payload.authorities}</span>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span>Correo</span>
            <strong>{payload.username}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Usuario autenticado</span>
            <strong>{payload.sub}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Rol</span>
            <strong>{payload.authorities}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Sesión expira</span>
            <strong>{expirationDate.toLocaleString()}</strong>
          </div>
        </div>

        <button type="button" onClick={logout} className={styles.logoutButton}>
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}