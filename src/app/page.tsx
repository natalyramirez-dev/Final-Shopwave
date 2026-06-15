"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Hero from "@/components/layout/Hero/Hero";
import styles from "@/components/ui/scss/home.module.scss";
import TeamCard from "@/components/ui/TeamCard/TeamCard";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";

const team = [
  { name: "Camilo Rodriguez", role: "Full Stack Developer", image: "/team/camilo.jpeg" },
  { name: "Nataly Ramirez", role: "Full Stack Developer", image: "/team/nataly.webp" },
  { name: "Dabner Orozco", role: "Full Stack Developer", image: "/team/dabner.jpeg" },
  { name: "Luis Aguilar", role: "Full Stack Developer", image: "/team/luis.jpg" },
  { name: "Maria Jose Sandoval", role: "Full Stack Developer", image: "/team/Majo.jpeg" },
];

export default function HomePage() {
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);

  return ( 
    <main className={styles.container}>
      <Navbar
        onLoginClick={() => setAuthModal("login")}
        onRegisterClick={() => setAuthModal("register")}
      />

      <Hero />

      {/* About */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <span className={styles.label}>Nuestra historia</span>
          <h2>Nacimos para romper el molde.</h2>
          <p>
            ShopWave nació de una idea simple: la moda y el streetwear merecen
            un espacio donde la cultura del drop se encuentre con el estilo
            cotidiano. Somos un equipo apasionado por las sneakers, la ropa y
            todo lo que define una generación.
          </p>
          <p>
            Desde nuestros inicios curadamos cada pieza pensando en quienes no
            siguen tendencias — las crean.
          </p>
        </div>

        <div className={styles.aboutStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Productos</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>12k</span>
            <span className={styles.statLabel}>Clientes</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>5</span>
            <span className={styles.statLabel}>Años</span>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.teamSection}>
        <div className={styles.teamHeader}>
          <span className={styles.label}>El equipo</span>
          <h2>Las personas detrás de ShopWave.</h2>
        </div>

        <div className={styles.teamGrid}>
          {team.map((member) => (
            <TeamCard
              key={member.name}
              name={member.name}
              role={member.role}
              image={member.image}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2>¿Listo para explorar?</h2>
        <p>Descubre nuestra colección completa de sneakers y moda.</p>
        <Link href="/products" className={styles.ctaButton}>
          Ver productos
        </Link>
      </section>

      {authModal === "login" && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onSwitchToRegister={() => setAuthModal("register")}
        />
      )}

      {authModal === "register" && (
        <RegisterModal
          onClose={() => setAuthModal(null)}
          onSwitchToLogin={() => setAuthModal("login")}
        />
      )}
    </main>
  );
}