// page.jsx - ADMIN REPORTS
// SERVER COMPONENT (Entry point)

import styles from "./reports.module.css";
import ReportsClient from "./reports.client";

export const metadata = {
    title: "التقارير والإحصاءات — لوحة الإدارة | لقطها",
};

export default function ReportsPage() {
    return (
        <div className={styles.page} dir="rtl">
            <div>
                <h2 className={styles.sectionTitle}>التقارير والإحصاءات 📊</h2>
                <ReportsClient />
            </div>
        </div>
    );
}
