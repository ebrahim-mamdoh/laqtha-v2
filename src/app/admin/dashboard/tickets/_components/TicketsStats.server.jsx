// TicketsStats.server.jsx
// SERVER COMPONENT for static rendering of the 6 KPI stats.

import styles from "../tickets.module.css";

const STATS = [
    { label: "مفتوحة", value: "34", color: "var(--admin-text)" },
    { label: "مغلقة", value: "7", color: "var(--admin-danger)" },
    { label: "متوسطة", value: "15", color: "var(--admin-text)" },
    { label: "متأخرة", value: "12", color: "var(--admin-success)" },
    { label: "مغلقة هذا الشهر", value: "248", color: "var(--admin-text)" },
    { label: "متوسط وقت الحل", value: "2.4 ساعة", color: "var(--admin-info)" },
];

export default function TicketsStats() {
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
