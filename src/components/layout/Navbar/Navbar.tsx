"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/components/ui/scss/Navbar.module.scss";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">ShopWave</Link>
      </div>

      <ul className={styles.links}>
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
      </ul>
    </nav>
  );
}