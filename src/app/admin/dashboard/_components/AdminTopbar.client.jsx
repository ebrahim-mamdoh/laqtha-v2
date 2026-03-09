"use client";
// AdminTopbar.client.jsx
// SERVER/CLIENT DECISION: Client component because it:
//   1. Manages dark/light theme toggle (writes to document.documentElement)
//   2. Renders the live date string which is client-dynamic

import { useState, useEffect, useRef } from "react";
import styles from "./AdminTopbar.module.css";

function formatArabicDate(date) {
    return date.toLocaleDateString("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function AdminTopbar() {
    const [theme, setTheme] = useState("dark");
    const [dateStr, setDateStr] = useState("");
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef(null);

    // Set date on mount (client-only to avoid hydration mismatch)
    useEffect(() => {
        setDateStr(formatArabicDate(new Date()));
    }, []);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        }
        if (notifOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notifOpen]);

    // Apply theme to the layout root element
    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        const root = document.getElementById("admin-layout-root");
        if (root) root.setAttribute("data-admin-theme", next);
    };

    return (
        <div className={styles.topbar}>
            {/* Page title — right side (RTL) */}
            <div className={styles.titleGroup}>
                <h1 className={styles.pageTitle}>لوحة المعلومات</h1>
                <span className={styles.pageSubtitle}>
                    مرحبًا، هذا ملخص نشاط اليوم
                </span>
            </div>

            {/* Search */}
            <div className={styles.searchWrap}>
                <div className={styles.searchInner}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        id="admin-search"
                        type="text"
                        placeholder="بحث في النظام..."
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* Right-side actions */}
            <div className={styles.actions}>
                {dateStr && <span className={styles.dateChip}>{dateStr}</span>}

                <button
                    className={styles.themeBtn}
                    onClick={toggleTheme}
                    title="تبديل الوضع"
                >
                    {theme === "dark" ? "☀️ فاتح" : "🌙 داكن"}
                </button>

                {/* Notifications Dropdown */}
                <div className={styles.notifWrapper} ref={notifRef}>
                    <div
                        className={styles.iconBtn}
                        title="الإشعارات"
                        onClick={() => setNotifOpen(!notifOpen)}
                    >
                        🔔
                        <span className={styles.notifBadge}>3</span>
                    </div>

                    {notifOpen && (
                        <div className={styles.notifDropdown}>
                            <div className={styles.notifHeader}>
                                <div className={styles.notifTitle}>الإشعارات 🔔</div>
                                <button className={styles.notifMarkRead}>تعليم الكل</button>
                            </div>

                            <div className={styles.notifList}>
                                <div className={styles.notifItem}>
                                    <div className={`${styles.notifIconWrap} ${styles.notifIconDanger}`}>🚨</div>
                                    <div className={styles.notifContent}>
                                        <div className={styles.notifBodyTitle}>تذكرة عاجلة: مشكلة دفع مكرر</div>
                                        <div className={styles.notifTime}>منذ 5 دقائق</div>
                                    </div>
                                    <div className={styles.notifUnreadDot} />
                                </div>

                                <div className={styles.notifItem}>
                                    <div className={`${styles.notifIconWrap} ${styles.notifIconWarning}`}>🤝</div>
                                    <div className={styles.notifContent}>
                                        <div className={styles.notifBodyTitle}>شريك جديد ينتظر موافقتك</div>
                                        <div className={styles.notifTime}>منذ 35 دقيقة</div>
                                    </div>
                                    <div className={styles.notifUnreadDot} />
                                </div>

                                <div className={styles.notifItem}>
                                    <div className={`${styles.notifIconWrap} ${styles.notifIconSuccess}`}>✅</div>
                                    <div className={styles.notifContent}>
                                        <div className={styles.notifBodyTitle}>تم إتمام 1,000 طلب اليوم!</div>
                                        <div className={styles.notifTime}>منذ ساعة</div>
                                    </div>
                                    <div className={styles.notifUnreadDot} />
                                </div>

                                <div className={styles.notifItem}>
                                    <div className={`${styles.notifIconWrap} ${styles.notifIconInfo}`}>📊</div>
                                    <div className={styles.notifContent}>
                                        <div className={styles.notifBodyTitle}>تقرير ديسمبر جاهز للتنزيل</div>
                                        <div className={styles.notifTime}>منذ ساعتين</div>
                                    </div>
                                    {/* Read notification has no dot */}
                                </div>
                            </div>

                            <div className={styles.notifFooter}>
                                <a href="/admin/dashboard/notifications" className={styles.notifViewAll}>
                                    عرض كل الإشعارات ←
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.statusDot} title="متصل" />
            </div>
        </div>
    );
}
