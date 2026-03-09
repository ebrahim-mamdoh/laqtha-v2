// StatCards.server.jsx
// SERVER/CLIENT DECISION: Server Component.
// Pure presentational data display — no interactivity, no state.
// Receives static data (could be from an async server fetch later).

import styles from "./StatCards.module.css";

// ── Data definitions ─────────────────────────────────────────────────────────
// In production these would come from an async fetch/db call in the parent page.
const STAT_ROWS = [
    [
        {
            icon: "📋",
            label: "إجمالي الطلبات",
            value: "1,284",
            badge: "+2.1%",
            badgeType: "up",
            footer: "أمس 1,083 · بالأمس 74%",
            accent: "var(--admin-primary)",
            iconBg: "var(--admin-primary-soft)",
        },
        {
            icon: "💰",
            label: "إجمالي الإيرادات",
            value: "84,320",
            badge: "+7%",
            badgeType: "up",
            footer: "مقارنة بالأسبوع الماضي · ريال",
            accent: "var(--admin-success)",
            iconBg: "var(--admin-success-soft)",
        },
        {
            icon: "👥",
            label: "إجمالي المستخدمين",
            value: "42,881",
            badge: "+1%",
            badgeType: "up",
            footer: "آخر 30 يوم",
            accent: "var(--admin-info)",
            iconBg: "var(--admin-info-soft)",
        },
        {
            icon: "🎫",
            label: "التذاكر النشطة",
            value: "34",
            badge: "+8%",
            badgeType: "down",
            footer: "تحتاج إلى مراجعة فورية",
            accent: "var(--admin-danger)",
            iconBg: "var(--admin-danger-soft)",
        },
    ],
    [
        {
            icon: "🤝",
            label: "الشركاء",
            value: "318",
            badge: "+2",
            badgeType: "up",
            footer: "الجدد هذا الشهر: 12",
            accent: "var(--admin-accent)",
            iconBg: "var(--admin-accent-soft)",
        },
        {
            icon: "⭐",
            label: "متوسط التقييم",
            value: "4.7",
            badge: "ممتاز",
            badgeType: "up",
            footer: "من 9,210 تقييم",
            accent: "var(--admin-warning)",
            iconBg: "var(--admin-warning-soft)",
        },
        {
            icon: "🚀",
            label: "معدل الإتمام",
            value: "94%",
            badge: "+1%",
            badgeType: "up",
            footer: "مقارنة بـ 76% الشهر الماضي",
            accent: "var(--admin-success)",
            iconBg: "var(--admin-success-soft)",
        },
        {
            icon: "🔄",
            label: "معدل الاحتفاظ",
            value: "68%",
            badge: "-3%",
            badgeType: "down",
            footer: "يحتاج متابعة · هدف: 5.4%",
            accent: "var(--admin-warning)",
            iconBg: "var(--admin-warning-soft)",
        },
    ],
];

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
