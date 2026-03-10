// UsersStats.server.jsx
// SERVER COMPONENT for static rendering of the 5 KPI stats.

import styles from "../users.module.css";

const STATS = [
    { label: "موقوفون", value: "421", color: "var(--admin-danger)" },
    { label: "مميزون VIP", value: "3,420", color: "var(--admin-primary)" },
    { label: "جدد اليوم", value: "247", color: "var(--admin-success)" },
    { label: "نشطون", value: "38,420", color: "var(--admin-success)" },
    { label: "الإجمالي", value: "42,881", color: "var(--admin-text)" },
];

export default function UsersStats() {
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
