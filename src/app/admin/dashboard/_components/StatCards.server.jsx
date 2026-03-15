"use client";

import styles from "./StatCards.module.css";
import { useDashboardOverview } from "../overview/useOverview";

function StatCard({ icon, label, value, badge, badgeType, footer, accent, iconBg }) {
    const badgeClass =
        badgeType === "up"
            ? styles.badgeUp
            : badgeType === "down"
                ? styles.badgeDown
                : styles.badgeWarning;

    return (
        <div
            className={styles.card}
            style={{ "--card-accent": accent, "--card-icon-bg": iconBg }}
        >
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>{icon}</div>
                <span className={`${styles.badge} ${badgeClass}`}>{badge}</span>
            </div>
            <div className={styles.value}>{value}</div>
            <div className={styles.label}>{label}</div>
            <div className={styles.cardFooter}>{footer}</div>
        </div>
    );
}

export default function StatCards() {
    const { data: stats, isLoading, isError } = useDashboardOverview();

    // Fallback display while loading or on error
    const displayStats = stats || {};
    const fallbackValue = isLoading ? "..." : "0";

    const STAT_ROWS = [
        [
            {
                icon: "📋",
                label: "إجمالي الطلبات",
                value: displayStats.todayOrders ?? fallbackValue,
                badge: "يومي",
                badgeType: "up",
                footer: "الطلبات المستلمة اليوم",
                accent: "var(--admin-primary)",
                iconBg: "var(--admin-primary-soft)",
            },
            {
                icon: "💰",
                label: "إجمالي الإيرادات",
                value: displayStats.todayRevenue ?? fallbackValue,
                badge: "يومي",
                badgeType: "up",
                footer: "الإيرادات المحققة اليوم · ريال",
                accent: "var(--admin-success)",
                iconBg: "var(--admin-success-soft)",
            },
            {
                icon: "👥",
                label: "إجمالي المستخدمين",
                value: displayStats.totalUsers ?? fallbackValue,
                badge: "إجمالي",
                badgeType: "up",
                footer: "جميع المستخدمين المسجلين",
                accent: "var(--admin-info)",
                iconBg: "var(--admin-info-soft)",
            },
            {
                icon: "🎫",
                label: "التذاكر النشطة",
                value: displayStats.openTickets ?? fallbackValue,
                badge: "نشط",
                badgeType: "warning",
                footer: "تذاكر الدعم الفني المفتوحة",
                accent: "var(--admin-danger)",
                iconBg: "var(--admin-danger-soft)",
            },
        ],
        [
            {
                icon: "🤝",
                label: "الشركاء النشطين",
                value: displayStats.activePartners ?? fallbackValue,
                badge: "نشط",
                badgeType: "up",
                footer: "شركاء تقديم الخدمة المعتمدين",
                accent: "var(--admin-accent)",
                iconBg: "var(--admin-accent-soft)",
            },
            {
                icon: "⭐",
                label: "الحجوزات المعلقة",
                value: displayStats.pendingBookings ?? fallbackValue,
                badge: "معلق",
                badgeType: "warning",
                footer: "حجوزات بانتظار التأكيد",
                accent: "var(--admin-warning)",
                iconBg: "var(--admin-warning-soft)",
            },
            {
                icon: "🚀",
                label: "مسترجعات اليوم",
                value: displayStats.todayRefunds ?? fallbackValue,
                badge: "يومي",
                badgeType: "down",
                footer: "المبالغ المسترجعة للعملاء اليوم",
                accent: "var(--admin-success)",
                iconBg: "var(--admin-success-soft)",
            },
            {
                icon: "⏳",
                label: "طلبات الشراكة المعلقة",
                value: displayStats.pendingPartnerApprovals ?? fallbackValue,
                badge: "جديد",
                badgeType: "warning",
                footer: "شركاء بانتظار الموافقة",
                accent: "var(--admin-warning)",
                iconBg: "var(--admin-warning-soft)",
            },
        ],
    ];

    return (
        <>
            {STAT_ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className={styles.grid}>
                    {row.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>
            ))}
        </>
    );
}
