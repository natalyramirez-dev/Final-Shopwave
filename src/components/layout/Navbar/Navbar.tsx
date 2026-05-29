"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/components/ui/scss/Navbar.module.scss";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = String(user?.role || "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  const closeMenu = () => setMenuOpen(false);

  if (isLoading) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">ShopWave</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" onClick={closeMenu}>ShopWave</Link>
      </div>

      {/* Botón hamburguesa — solo visible en móvil */}
      <button
        className={styles.burger}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Abrir menú"
      >
        <span className={menuOpen ? styles.burgerLineTop    : ""}></span>
        <span className={menuOpen ? styles.burgerLineMid    : ""}></span>
        <span className={menuOpen ? styles.burgerLineBottom : ""}></span>
      </button>

      {/* Links — en móvil se muestran solo si menuOpen es true */}
      <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        {isAuthenticated && (
          <>
            {isAdmin && (
              <li>
                <Link href="/admin/products" onClick={closeMenu}
                  className={pathname.startsWith("/admin") ? styles.activeLink : ""}>
                  Panel Admin
                </Link>
              </li>
            )}
            <li>
              <Link href="/products" onClick={closeMenu}
                className={pathname === "/products" ? styles.activeLink : ""}>
                Products
              </Link>
            </li>
            <li>
              <Link href="/cart" onClick={closeMenu}
                className={pathname === "/cart" ? styles.activeLink : ""}>
                Cart
              </Link>
            </li>
            <li>
              <Link href="/orders" onClick={closeMenu}
                className={pathname === "/orders" ? styles.activeLink : ""}>
                Orders
              </Link>
            </li>
            <li>
              <Link href="/profile" onClick={closeMenu}
                className={pathname === "/profile" ? styles.activeLink : ""}>
                Profile
              </Link>
            </li>
            <li>
              <button type="button" onClick={() => { logout(); closeMenu(); }}
                className={styles.logoutButton}>
                Cerrar sesión
              </button>
            </li>
          </>
        )}

        {!isAuthenticated && (
          <>
            <li>
              <Link href="/login" onClick={closeMenu}
                className={pathname === "/login" ? styles.activeLink : ""}>
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" onClick={closeMenu}
                className={pathname === "/register" ? styles.activeLink : ""}>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
