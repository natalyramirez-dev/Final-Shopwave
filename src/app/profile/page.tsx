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

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1>Mi perfil</h1>

        <div className={styles.formLike}>
          <div className={styles.field}>
            <span>Nombre</span>
            <strong>{user.firstName}</strong>
          </div>

          <div className={styles.field}>
            <span>Apellido</span>
            <strong>{user.lastName}</strong>
          </div>

          <div className={styles.field}>
            <span>Correo electrónico</span>
            <strong>{user.email}</strong>
          </div>

          <div className={styles.field}>
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