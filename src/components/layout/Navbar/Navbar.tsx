import Link from "next/link";
import styles from "@/components/ui/scss/Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/products">ShopWave</Link>
      </div>

      <ul className={styles.links}>
        <li>
          <Link href="/products">Products</Link>
        </li>

        <li>
          <Link href="/cart">Cart</Link>
        </li>

        <li>
          <Link href="/orders">Orders</Link>
        </li>

        <li>
          <Link href="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
}