"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/components/ui/scss/Navbar.module.scss";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();

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
        <Link href="/">ShopWave</Link>
      </div>

      <ul className={styles.links}>
        {isAuthenticated && (
          <>
            <li>
              <Link
                href="/products"
                className={pathname === "/products" ? styles.activeLink : ""}
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                href="/cart"
                className={pathname === "/cart" ? styles.activeLink : ""}
              >
                Cart
              </Link>
            </li>

            <li>
              <Link
                href="/orders"
                className={pathname === "/orders" ? styles.activeLink : ""}
              >
                Orders
              </Link>
            </li>

            <li>
              <Link
                href="/profile"
                className={pathname === "/profile" ? styles.activeLink : ""}
              >
                Profile
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={logout}
                className={styles.logoutButton}
              >
                Cerrar sesión
              </button>
            </li>
          </>
        )}

        {!isAuthenticated && (
          <>
            <li>
              <Link
                href="/login"
                className={pathname === "/login" ? styles.activeLink : ""}
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                href="/register"
                className={pathname === "/register" ? styles.activeLink : ""}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}