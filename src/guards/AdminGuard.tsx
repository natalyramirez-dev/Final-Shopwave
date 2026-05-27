"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/components/ui/scss/admin.module.scss";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        // Normalizamos el rol a mayúsculas para evitar errores
        const role = String(user?.role || "").toUpperCase();
        if (role === "ADMIN" || role === "ROLE_ADMIN") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.push("/"); // Expulsar al usuario silenciosamente
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Pantalla de carga mientras lee el token
  if (isLoading || isAuthorized === null) {
    return (
      <div className={styles.adminLoading}>
        <p>Verificando credenciales...</p>
      </div>
    );
  }

  // Si no es admin, no renderizamos NADA para evitar que la página se congele
  // mientras el router de Next.js procesa el envío a la página de inicio (/)
  if (isAuthorized === false) {
    return null; 
  }

  // Si es admin, mostramos el contenido
  return <>{children}</>;
}