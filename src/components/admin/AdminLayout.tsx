"use client";

import { useState } from "react";
import AdminGuard from "@/guards/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import styles from "@/components/ui/scss/adminDashboard.module.scss";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className={styles.adminShell}>
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className={styles.adminMain}>
          {/* Top bar */}
          <div className={styles.adminTopbar}>
            <button
              className={styles.menuToggle}
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <span />
              <span />
              <span />
            </button>
            <div className={styles.topbarBreadcrumb}>
              <span className={styles.topbarBrandMobile}>ShopWave</span>
              <span className={styles.topbarSeparator}>/</span>
              <span className={styles.topbarCurrent}>{title}</span>
            </div>
          </div>

          {/* Page header */}
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderText}>
              <h1 className={styles.pageTitle}>{title}</h1>
              {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
            </div>
            {actions && <div className={styles.pageHeaderActions}>{actions}</div>}
          </div>

          {/* Content */}
          <div className={styles.pageContent}>
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
