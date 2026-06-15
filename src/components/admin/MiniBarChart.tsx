"use client";

import styles from "@/components/ui/scss/adminDashboard.module.scss";

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
  color?: string;
  height?: number;
}

export default function MiniBarChart({
  data,
  title,
  color = "#e8410a",
  height = 120,
}: BarChartProps) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;
  const gap = barWidth * 0.25;

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <span className={styles.chartTitle}>{title}</span>
        <span className={styles.chartMax}>Máx: {max}</span>
      </div>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className={styles.barSvg}
        aria-label={title}
      >
        <defs>
          <linearGradient id={`grad-${title.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const barH = max > 0 ? (d.value / max) * (height - 12) : 0;
          const x = i * barWidth + gap / 2;
          const w = barWidth - gap;
          const y = height - barH - 2;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={barH}
                rx="2"
                fill={`url(#grad-${title.replace(/\s/g, "")})`}
              />
              <title>{`${d.label}: ${d.value}`}</title>
            </g>
          );
        })}
      </svg>
      {/* X-axis labels */}
      <div className={styles.chartLabels}>
        {data.map((d, i) => (
          <span key={i} className={styles.chartLabel}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
