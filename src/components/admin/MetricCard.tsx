"use client";

import styles from "@/components/ui/scss/adminDashboard.module.scss";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: { value: number; label: string };
  variant?: "default" | "success" | "warning" | "danger" | "accent";
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
}: MetricCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div className={`${styles.metricCard} ${styles[`metricCard--${variant}`]}`}>
      <div className={styles.metricCardHeader}>
        <div className={`${styles.metricIcon} ${styles[`metricIcon--${variant}`]}`}>
          <span>{icon}</span>
        </div>
        {trend && (
          <span className={`${styles.metricTrend} ${isPositive ? styles.trendUp : styles.trendDown}`}>
            {isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricTitle}>{title}</div>
      {subtitle && <div className={styles.metricSubtitle}>{subtitle}</div>}
    </div>
  );
}
