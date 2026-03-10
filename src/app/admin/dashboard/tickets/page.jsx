// page.jsx — ADMIN TICKETS PAGE
// SERVER COMPONENT (Entry point)

import styles from "./tickets.module.css";
import TicketsStats from "./_components/TicketsStats.server";
import TicketsClient from "./tickets.client";

export const metadata = {
    title: "تذاكر الدعم الفني — لوحة الإدارة | لقطها",
};

export default function TicketsPage() {
    return (
        <div className={styles.page} dir="rtl">
            {/* ── KPI Stats ────────────────────────────────────── */}
            <div>
                <h2 className={styles.sectionTitle}>متابعة ومعالجة التذاكر</h2>
                <TicketsStats />
            </div>

            {/* ── Filters + Table (client-managed) ─────────────── */}
            <div>
                <TicketsClient />
            </div>
        </div>
    );
}
