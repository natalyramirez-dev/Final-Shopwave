"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/components/ui/scss/admin.module.scss";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const userRole = user?.role as string | undefined;

    if (userRole !== "ADMIN" && userRole !== "ROLE_ADMIN") {
      router.replace("/"); 
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, router]);

  if (!isAuthorized) {
    return (
      <div className={styles.adminLoading}>
        <p>Verificando permisos de administrador...</p>
      </div>
    );
  }

  return <>{children}</>;
}