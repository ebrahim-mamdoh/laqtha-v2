// page.jsx — ADMIN DASHBOARD MAIN PAGE
// SERVER/CLIENT DECISION: Server Component.
// This is the top-level page — it should remain a thin Server Component
// that assembles child components. Client interactivity is isolated
// in *.client.jsx files only.

import styles from "./dashboard.module.css";
import StatCards from "./_components/StatCards.server";
import ChartsRow from "./_components/ChartsRow.client";
import DailyBarChart from "./_components/DailyBarChart.client";
import RecentOrders from "./_components/RecentOrders.server";

export const metadata = {
    title: "الرئيسية — لوحة المعلومات | لقطها Admin",
};

export default function AdminDashboardPage() {
    return (
        <div className={styles.page} dir="rtl">
            {/* ── Section 1: KPI Stats ─────────────────────────── */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📊 مؤشرات الأداء الرئيسية</h2>
                <StatCards />
            </div>

            {/* ── Section 2: Charts ────────────────────────────── */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📉 التحليلات البيانية</h2>
                <ChartsRow />
            </div>

            {/* ── Section 3: Daily activity + Recent orders ────── */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>🗓️ النشاط اليومي والطلبات الأخيرة</h2>
                <div className={styles.bottomRow}>
                    {/* Bar chart card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>
                                📊 الطلبات اليومية
                            </div>
                        </div>
                        <DailyBarChart />
                    </div>

                    {/* Recent orders table card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>
                                📋 آخر الطلبات
                            </div>
                            <a href="/admin/orders" className={styles.viewAll}>
                                عرض الكل ←
                            </a>
                        </div>
                        <RecentOrders />
                    </div>
                </div>
            </div>
        </div>
    );
}
