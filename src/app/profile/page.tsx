"use client";

import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import styles from "@/components/ui/scss/profile.module.scss";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <main className={styles.container}>
        <section className={styles.card}>
          <p>Cargando perfil...</p>
        </section>
      </main>
    );
  }

  const initials = `${user.firstName?.charAt(0) ?? ""}${
    user.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <div className={styles.avatar}>
          {initials || user.email.charAt(0).toUpperCase()}
        </div>

        <div className={styles.header}>
          <p className={styles.label}>Mi perfil</p>
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <span className={styles.emailBadge}>{user.email}</span>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span>Nombre</span>
            <strong>{user.firstName}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Apellido</span>
            <strong>{user.lastName}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Correo electrónico</span>
            <strong>{user.email}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Celular</span>
            <strong>{user.mobile}</strong>
          </div>
        </div>

        <button type="button" onClick={logout} className={styles.logoutButton}>
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}