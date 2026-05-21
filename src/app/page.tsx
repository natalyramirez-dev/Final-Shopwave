import Link from "next/link";

export default function HomePage() {
  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1 style={styles.title}>ShopWave Fusion</h1>

        <p style={styles.description}>
          Bienvenido a la tienda online. Inicia sesión o crea una cuenta para
          continuar.
        </p>

        <div style={styles.buttons}>
          <Link href="/login" style={styles.primaryButton}>
            Iniciar sesión
          </Link>

          <Link href="/register" style={styles.secondaryButton}>
            Registrarse
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "#f5f5f5",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    padding: "40px",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "36px",
    marginBottom: "16px",
    color: "#111827",
  },
  description: {
    fontSize: "16px",
    color: "#4b5563",
    marginBottom: "28px",
  },
  buttons: {
    display: "flex",
    gap: "14px",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  },
  primaryButton: {
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#111827",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
  },
  secondaryButton: {
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#e5e7eb",
    color: "#111827",
    textDecoration: "none",
    fontWeight: 600,
  },
};