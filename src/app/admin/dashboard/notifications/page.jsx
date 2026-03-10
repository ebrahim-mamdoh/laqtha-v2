// page.jsx — ADMIN NOTIFICATIONS PAGE
// SERVER/CLIENT DECISION: Server Component.
// This page automatically inherits the UI shell from src/app/admin/dashboard/layout.jsx.

import styles from "./notifications.module.css";
import NotificationsClient from "./notifications.client";

export const metadata = {
    title: "مركز الإشعارات — لوحة الإدارة | لقطها",
};

export default function NotificationsPage() {
    return (
        <div className={styles.page} dir="rtl">
            <div>
                <h2 className={styles.sectionTitle}>مركز الإشعارات</h2>
                <NotificationsClient />
            </div>
        </div>
    );
}
