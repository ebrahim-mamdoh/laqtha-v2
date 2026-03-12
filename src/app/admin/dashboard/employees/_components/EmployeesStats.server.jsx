// EmployeesStats.server.jsx
import styles from "../employees.module.css";

const STATS = [
    { label: "الإجمالي", value: "24", color: "var(--admin-text)" },
    { label: "متصل الآن", value: "18", color: "var(--admin-primary)" },
    { label: "دعم فني", value: "8", color: "var(--admin-info)" },
    { label: "مدير حسابات", value: "6", color: "var(--admin-primary)" },
    { label: "متوسط وقت الرد", value: "1.8 ساعة", color: "var(--admin-warning)" },
];

export default function EmployeesStats() {
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
