// page.jsx — ADMIN USERS PAGE
// SERVER COMPONENT (Entry point)

import styles from "./users.module.css";
import UsersStats from "./_components/UsersStats.server";
import UsersClient from "./users.client";

export const metadata = {
    title: "إدارة المستخدمين — لوحة الإدارة | لقطها",
};

export default function UsersPage() {
    return (
        <div className={styles.page} dir="rtl">
            {/* ── KPI Stats ────────────────────────────────────── */}
            <div>
                <h2 className={styles.sectionTitle}>عرض وإدارة حسابات العملاء</h2>
                <UsersStats />
            </div>

            {/* ── Filters + Table (client-managed) ─────────────── */}
            <div>
                <UsersClient />
            </div>
        </div>
    );
}
