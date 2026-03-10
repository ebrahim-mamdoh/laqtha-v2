// page.jsx — ADMIN PARTNERS PAGE
// SERVER COMPONENT (Entry point)

import styles from "./partners.module.css";
import PartnersStats from "./_components/PartnersStats.server";
import PartnersClient from "./partners.client";

export const metadata = {
    title: "إدارة الشركاء — لوحة الإدارة | لقطها",
};

export default function PartnersPage() {
    return (
        <div className={styles.page} dir="rtl">
            {/* ── KPI Stats ────────────────────────────────────── */}
            <div>
                <h2 className={styles.sectionTitle}>إدارة شبكة الشركاء</h2>
                <PartnersStats />
            </div>

            {/* ── Filters + Table (client-managed) ─────────────── */}
            <div>
                <PartnersClient />
            </div>
        </div>
    );
}
