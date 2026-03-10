// RatingsStats.server.jsx
// SERVER COMPONENT for static rendering of the 6 KPI stats.

import styles from "../ratings.module.css";

const STATS = [
    { label: "المتوسط العام", value: "⭐ 4.7", color: "var(--admin-warning)" },
    { label: "إجمالي التقييمات", value: "8,210", color: "var(--admin-text)" },
    { label: "تم الرد عليها", value: "6,840", color: "var(--admin-success)" },
    { label: "تحتاج تدخل", value: "124", color: "var(--admin-danger)" },
    { label: "تقييمات إيجابية", value: "73%", color: "var(--admin-success)" },
    { label: "تقييمات سلبية", value: "8%", color: "var(--admin-danger)" },
];

export default function RatingsStats() {
    return (
        <div className={styles.statsGrid}>
            {STATS.map((s, i) => (
                <div key={i} className={styles.statCard}>
                    <div className={styles.statValue} style={{ "--stat-color": s.color }}>
                        {s.value}
                    </div>
                    <div className={styles.statLabel}>{s.label}</div>
                </div>
            ))}
        </div>
    );
}
