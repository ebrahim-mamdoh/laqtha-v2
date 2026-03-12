// page.jsx — ADMIN SETTINGS PAGE
// SERVER COMPONENT (Entry point)

import styles from "./settings.module.css";
import SettingsClient from "./settings.client";

export const metadata = {
    title: "الإعدادات — لوحة الإدارة | لقطها",
};

export default function SettingsPage() {
    return (
        <div className={styles.page} dir="rtl">
            <div className={styles.pageTitle}>
                ⚙️ الإعدادات
            </div>
            <SettingsClient />
        </div>
    );
}
