"use client";

import styles from "@/components/ui/scss/adminDashboard.module.scss";

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  title: string;
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  if (endAngle - startAngle >= 360) endAngle = startAngle + 359.99;
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

export default function DonutChart({ data, title, size = 160 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className={styles.chartWrapper}>
        <div className={styles.chartHeader}>
          <span className={styles.chartTitle}>{title}</span>
        </div>
        <p className={styles.chartEmpty}>Sin datos disponibles</p>
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeW = size * 0.14;

  let cumAngle = 0;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 360;
    const slice = { ...d, startAngle: cumAngle, endAngle: cumAngle + angle };
    cumAngle += angle;
    return slice;
  });

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <span className={styles.chartTitle}>{title}</span>
      </div>
      <div className={styles.donutLayout}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.donutSvg}>
          {/* Background track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0eeea" strokeWidth={strokeW} />
          {slices.map((s, i) => (
            <path
              key={i}
              d={describeArc(cx, cy, r, s.startAngle, s.endAngle)}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeW}
              strokeLinecap="butt"
            >
              <title>{s.label}: {s.value}</title>
            </path>
          ))}
          {/* Center text */}
          <text x={cx} y={cy - 6} textAnchor="middle" className={styles.donutCenter}>
            {total}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" className={styles.donutCenterLabel}>
            Total
          </text>
        </svg>
        <div className={styles.donutLegend}>
          {data.map((d, i) => (
            <div key={i} className={styles.donutLegendItem}>
              <span className={styles.donutLegendDot} style={{ backgroundColor: d.color }} />
              <span className={styles.donutLegendLabel}>{d.label}</span>
              <span className={styles.donutLegendValue}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
