// page.jsx - ADMIN EMPLOYEES
// SERVER COMPONENT (Entry point)

import styles from "./employees.module.css";
import EmployeesStats from "./_components/EmployeesStats.server";
import EmployeesClient from "./employees.client";

export const metadata = {
    title: "إدارة الموظفين — لوحة الإدارة | لقطها",
};

export default function EmployeesPage() {
    return (
        <div className={styles.page} dir="rtl">
            <div>
                <h2 className={styles.sectionTitle}>إدارة فريق العمل</h2>
                <EmployeesStats />
            </div>

            <div>
                <EmployeesClient />
            </div>
        </div>
    );
}
