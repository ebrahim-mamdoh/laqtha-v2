// page.jsx — ADMIN PAYMENTS PAGE
// SERVER COMPONENT (Entry point)

import styles from "./payments.module.css";
import PaymentsStats from "./_components/PaymentsStats.server";
import PaymentsSideCharts from "./_components/PaymentsSideCharts.client";
import PaymentsClient from "./payments.client";

export const metadata = {
    title: "المدفوعات — لوحة الإدارة | لقطها",
};

export default function PaymentsPage() {
    return (
        <div className={styles.page} dir="rtl">
            {/* ── Top KPI Stats ──────────────────────────────────── */}
            <PaymentsStats />

            {/* ── Main Layout (Table Right, Charts Left) ─────────── */}
            <div className={styles.contentGrid}>
                <PaymentsClient />
                <PaymentsSideCharts />
            </div>
        </div>
    );
}
