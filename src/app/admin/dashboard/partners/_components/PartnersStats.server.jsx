// PartnersStats.server.jsx
// SERVER COMPONENT for static rendering of the 6 KPI stats.

import styles from "../partners.module.css";

const STATS = [
    { label: "شركاء نشطون", value: "318", color: "var(--admin-text)" },
    { label: "انتظار موافقة", value: "12", color: "var(--admin-primary)" },
    { label: "موقوف", value: "8", color: "var(--admin-danger)" },
    { label: "إلغاء", value: "142", color: "var(--admin-success)" },
    { label: "متأخر", value: "98", color: "var(--admin-info)" },
    { label: "مستحقات معلقة", value: "248K ر.س", color: "var(--admin-warning)" },
];

export default function PartnersStats() {
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
