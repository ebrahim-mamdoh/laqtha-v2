// OrdersStats.server.jsx
// SERVER/CLIENT DECISION: Server Component — pure static display, no interactivity.
// In production: replace STATS constant with an async fetch().

import styles from "../orders.module.css";

const STATS = [
    {
        icon: "📋",
        label: "إجمالي الطلبات",
        value: "1,284",
        accent: "var(--admin-primary)",
    },
    {
        icon: "🆕",
        label: "طلبات جديدة",
        value: "12",
        accent: "var(--admin-info)",
    },
    {
        icon: "⚙️",
        label: "قيد التنفيذ",
        value: "74",
        accent: "var(--admin-warning)",
    },
    {
        icon: "✅",
        label: "مكتملة",
        value: "84",
        accent: "var(--admin-success)",
    },
    {
        icon: "❌",
        label: "ملغاة",
        value: "1,208",
        accent: "var(--admin-danger)",
    },
];

export default function OrdersStats() {
    return (
        <div className={styles.statsGrid}>
            {STATS.map((s) => (
                <div
                    key={s.label}
                    className={styles.statCard}
                    style={{ "--stat-accent": s.accent }}
                >
                    <div className={styles.statIcon}>{s.icon}</div>
                    <div className={styles.statValue}>{s.value}</div>
                    <div className={styles.statLabel}>{s.label}</div>
                </div>
            ))}
        </div>
    );
}
