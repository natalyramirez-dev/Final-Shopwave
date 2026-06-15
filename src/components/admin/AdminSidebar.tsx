"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/components/ui/scss/adminDashboard.module.scss";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  match?: string;
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⬡", match: "/admin/dashboard" },
  { href: "/admin/products", label: "Productos", icon: "◈", match: "/admin/products" },
  { href: "/admin/orders", label: "Órdenes", icon: "◎", match: "/admin/orders" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div className={styles.sidebarOverlay} onClick={onClose} />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        {/* Logo / Brand */}
        <div className={styles.sidebarBrand}>
          <Link href="/" className={styles.brandLink} onClick={onClose}>
            <span className={styles.brandLogo}>SW</span>
            <div className={styles.brandText}>
              <span className={styles.brandName}>ShopWave</span>
              <span className={styles.brandRole}>Admin Panel</span>
            </div>
          </Link>
          <button className={styles.sidebarCloseBtn} onClick={onClose} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className={styles.sidebarUserCard}>
          <div className={styles.sidebarAvatar}>
            {user?.firstName?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className={styles.sidebarUserInfo}>
            <span className={styles.sidebarUserName}>
              {user?.firstName} {user?.lastName}
            </span>
            <span className={styles.sidebarUserBadge}>Administrador</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          <span className={styles.sidebarNavLabel}>NAVEGACIÓN</span>
          <ul className={styles.sidebarNavList}>
            {navItems.map((item) => {
              const isActive = item.match
                ? pathname.startsWith(item.match)
                : pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.sidebarNavItem} ${isActive ? styles.sidebarNavItemActive : ""}`}
                    onClick={onClose}
                  >
                    <span className={styles.sidebarNavIcon}>{item.icon}</span>
                    <span className={styles.sidebarNavText}>{item.label}</span>
                    {isActive && <span className={styles.sidebarNavIndicator} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.sidebarBottomLink} onClick={onClose}>
            <span>←</span>
            <span>Ir a la tienda</span>
          </Link>
          <button className={styles.sidebarLogoutBtn} onClick={handleLogout}>
            <span>⏻</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
