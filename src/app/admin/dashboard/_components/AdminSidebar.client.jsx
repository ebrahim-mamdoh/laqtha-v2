"use client";
// AdminSidebar.client.jsx
// SERVER/CLIENT DECISION: Client component because it needs to:
//   1. Read the current pathname (usePathname) to highlight the active link
//   2. Render navigation links that respond to client-side routing

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminSidebar.module.css";

const NAV_ITEMS = [
    { href: "/admin/dashboard", icon: "📊", label: "لوحة المعلومات", badge: null },
    { href: "/admin/dashboard/orders", icon: "📦", label: "الطلبات", badge: "12" },
    { href: "/admin/dashboard/tickets", icon: "🎫", label: "تذاكر الدعم", badge: "34" },
    { href: "/admin/dashboard/users", icon: "👥", label: "المستخدمون", badge: null },
    { href: "/admin/dashboard/partners", icon: "🤝", label: "الشركاء", badge: null },
    { href: "/admin/dashboard/payments", icon: "💳", label: "المدفوعات", badge: null },
    { href: "/admin/dashboard/ratings", icon: "⭐", label: "التقييمات", badge: null },
    { href: "/admin/dashboard/employees", icon: "👤", label: "الموظفون", badge: null },
    { href: "/admin/dashboard/reports", icon: "📈", label: "التقارير", badge: null },
    { href: "/admin/dashboard/notifications", icon: "🔔", label: "الإشعارات", badge: null },
    { href: "/admin/dashboard/settings", icon: "⚙️", label: "الإعدادات", badge: null },
    { href: "/admin/dashboard/logs", icon: "🗂️", label: "سجل النشاط", badge: null },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            {/* Brand */}
            <div className={styles.brand}>
                <div className={styles.brandIcon}>⚡</div>
                <div>
                    <span className={styles.brandName}>لقطها</span>
                    <span className={styles.brandSub}>Admin Panel</span>
                </div>
            </div>

            {/* Admin Profile Card */}
            <div className={styles.profileCard}>
                <div className={styles.avatarWrap}>
                    <div className={styles.avatar}>م</div>
                    <span className={styles.onlineDot} />
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.profileName}>محمود المصري</div>
                    <div className={styles.profileRole}>مدير النظام</div>
                </div>
            </div>

            {/* Navigation */}
            <div className={styles.navLabel}>القائمة الرئيسية</div>
            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {item.label}
                            {item.badge && (
                                <span className={styles.navBadge}>{item.badge}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.sidebarFooter}>v2.1.0 · لوحة الإدارة</div>
        </aside>
    );
}
