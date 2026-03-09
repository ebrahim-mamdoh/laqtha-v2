// page.jsx — ADMIN ORDERS PAGE
// SERVER/CLIENT DECISION: Server Component.
// This page lives under src/app/admin/dashboard/orders/
// and automatically inherits the Sidebar + Topbar from:
//   src/app/admin/dashboard/layout.jsx
// The admin.theme.css is already imported by that layout — no re-import needed.

import styles from "./orders.module.css";
import OrdersStats from "./_components/OrdersStats.server";
import OrdersClient from "./orders.client";

export const metadata = {
    title: "الطلبات — لوحة الإدارة | لقطها",
};

export default function OrdersPage() {
    return (
        <div className={styles.page} dir="rtl">
            {/* ── KPI Stats ────────────────────────────────────── */}
            <div>
                <h2 className={styles.sectionTitle}>📦 إحصائيات الطلبات</h2>
                <OrdersStats />
            </div>

            {/* ── Filters + Table (client-managed) ─────────────── */}
            <div>
                <h2 className={styles.sectionTitle}>📋 قائمة الطلبات</h2>
                <OrdersClient />
            </div>
        </div>
    );
}
