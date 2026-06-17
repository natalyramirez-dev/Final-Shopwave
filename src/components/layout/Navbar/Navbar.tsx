"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
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
  const { theme, toggleTheme } = useTheme();
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

  const themeToggleButton = (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Activar modo oscuro" : "Activar modo claro"
      }
      title={theme === "light" ? "Modo oscuro" : "Modo claro"}
    >
      {theme === "light" ? (
        // Icono de luna (ofrece cambiar A oscuro)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Icono de sol (ofrece cambiar A claro)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );

  if (isLoading) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">ShopWave</Link>
        </div>
        {themeToggleButton}
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

      <div className={styles.rightControls}>
        {themeToggleButton}

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
      </div>

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
                href="/admin/dashboard"
                onClick={closeMenu}
                className={
                  pathname.startsWith("/admin/dashboard")
                    ? styles.activeLink
                    : ""
                }
              >
                Dashboard Admin
              </Link>
            </li>

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
