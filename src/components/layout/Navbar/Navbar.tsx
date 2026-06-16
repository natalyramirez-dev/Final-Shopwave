"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/components/ui/scss/Navbar.module.scss";

type NavbarProps = {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
};

export default function Navbar({
  onLoginClick,
  onRegisterClick,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = String(user?.role || "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  const closeMenu = () => setMenuOpen(false);

  const handleLoginClick = () => {
    closeMenu();
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push("/login");
    }
  };

  const handleRegisterClick = () => {
    closeMenu();
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      router.push("/register");
    }
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    router.replace("/");
  };

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
        <Link href="/" onClick={closeMenu}>
          ShopWave
        </Link>
      </div>

      <button
        type="button"
        className={styles.burger}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Abrir menú"
      >
        <span className={menuOpen ? styles.burgerLineTop : ""}></span>
        <span className={menuOpen ? styles.burgerLineMid : ""}></span>
        <span className={menuOpen ? styles.burgerLineBottom : ""}></span>
      </button>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        {!isAuthenticated && (
          <>
            <li>
              <button
                type="button"
                onClick={handleLoginClick}
                className={styles.authButton}
              >
                Login
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={handleRegisterClick}
                className={styles.authButton}
              >
                Register
              </button>
            </li>
          </>
        )}

        {isAuthenticated && isAdmin && (
          <>
            <li>
              <Link
                href="/admin/products"
                onClick={closeMenu}
                className={
                  pathname.startsWith("/admin/products")
                    ? styles.activeLink
                    : ""
                }
              >
                Administrar Productos
              </Link>
            </li>

            <li>
              <Link
                href="/admin/orders"
                onClick={closeMenu}
                className={
                  pathname.startsWith("/admin/orders")
                    ? styles.activeLink
                    : ""
                }
              >
                Administrar Ordenes
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Cerrar sesión
              </button>
            </li>
          </>
        )}

        {isAuthenticated && !isAdmin && (
          <>
            <li>
              <Link
                href="/products"
                onClick={closeMenu}
                className={pathname === "/products" ? styles.activeLink : ""}
              >
                Productos
              </Link>
            </li>

            <li>
              <Link
                href="/cart"
                onClick={closeMenu}
                className={pathname === "/cart" ? styles.activeLink : ""}
              >
                Carrito
              </Link>
            </li>

            <li>
              <Link
                href="/orders"
                onClick={closeMenu}
                className={pathname === "/orders" ? styles.activeLink : ""}
              >
                Ordenes
              </Link>
            </li>

            <li>
              <Link
                href="/profile"
                onClick={closeMenu}
                className={pathname === "/profile" ? styles.activeLink : ""}
              >
                Mi Perfil
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Cerrar sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}