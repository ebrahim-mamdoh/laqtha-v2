"use client";

import styles from "../partners.module.css";
import { usePartnersStats } from "../usePartnersStats";

export default function PartnersStats() {
    const { data: statsData, isLoading, isError } = usePartnersStats();
    
    // Fallback while loading
    const displayStats = statsData?.overview || {};
    const fallbackValue = isLoading ? "..." : "0";

    const STATS = [
        { label: "إجمالي الشركاء", value: displayStats.total ?? fallbackValue, color: "var(--admin-text)" },
        { label: "شركاء نشطون", value: displayStats.approved ?? fallbackValue, color: "var(--admin-success)" },
        { label: "انتظار موافقة", value: displayStats.pendingApproval ?? fallbackValue, color: "var(--admin-primary)" },
        { label: "تسجيلات حديثة", value: displayStats.recentRegistrations ?? fallbackValue, color: "var(--admin-info)" },
        { label: "موقوف", value: displayStats.suspended ?? fallbackValue, color: "var(--admin-warning)" },
        { label: "إلغاء", value: displayStats.rejected ?? fallbackValue, color: "var(--admin-danger)" },
    ];

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
