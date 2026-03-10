// PaymentsStats.server.jsx
import styles from "../payments.module.css";

const STATS = [
    { label: "إيراد اليوم", value: "84,320 ر.س", color: "var(--admin-success)" },
    { label: "هذا الشهر", value: "1.2M ر.س", color: "var(--admin-text)" },
    { label: "صافي الربح", value: "78K~ ر.س", color: "var(--admin-primary)" },
    { label: "استردادات", value: "4,200 ر.س", color: "var(--admin-danger)" },
    { label: "مستحقات الشركاء", value: "12,840 ر.س", color: "var(--admin-danger)" },
    { label: "نجاح المعاملات", value: "98.4%", color: "var(--admin-info)" },
];

export default function PaymentsStats() {
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
