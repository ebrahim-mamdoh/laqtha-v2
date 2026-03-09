"use client";
// AdminTopbar.client.jsx
// SERVER/CLIENT DECISION: Client component because it:
//   1. Manages dark/light theme toggle (writes to document.documentElement)
//   2. Renders the live date string which is client-dynamic

import { useState, useEffect } from "react";
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

    // Set date on mount (client-only to avoid hydration mismatch)
    useEffect(() => {
        setDateStr(formatArabicDate(new Date()));
    }, []);

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

                <div className={styles.iconBtn} title="الإشعارات">
                    🔔
                    <span className={styles.notifBadge}>5</span>
                </div>

                <div className={styles.statusDot} title="متصل" />
            </div>
        </div>
    );
}
