"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/components/ui/scss/authGuard.module.scss";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Si no está autenticado → manda al login
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className={styles.guardScreen} role="status" aria-label="Verificando sesión">
        <div className={styles.spinner} aria-hidden="true" />
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.guardScreen} role="status" aria-label="Redirigiendo">
        <div className={styles.spinner} aria-hidden="true" />
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return <>{children}</>;
};
