"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/components/ui/scss/adminDashboard.module.scss";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        const role = String(user?.role || "").toUpperCase();
        if (role === "ADMIN" || role === "ROLE_ADMIN") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.push("/");
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className={styles.adminLoading}>
        <p>Verificando credenciales...</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return null;
  }

  return <>{children}</>;
}
