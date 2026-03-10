// page.jsx — ADMIN RATINGS PAGE
// SERVER COMPONENT (Entry point)

import styles from "./ratings.module.css";
import RatingsStats from "./_components/RatingsStats.server";
import RatingsClient from "./ratings.client";

export const metadata = {
    title: "تقييمات العملاء — لوحة الإدارة | لقطها",
};

export default function RatingsPage() {
    return (
        <div className={styles.page} dir="rtl">
            {/* ── KPI Stats ────────────────────────────────────── */}
            <div>
                <h2 className={styles.sectionTitle}>مراجعة التقييمات</h2>
                <RatingsStats />
            </div>

            {/* ── Filters + Table (client-managed) ─────────────── */}
            <div>
                <RatingsClient />
            </div>
        </div>
    );
}
