// layout.jsx — ADMIN DASHBOARD SHELL
// SERVER/CLIENT DECISION: Server Component.
// The layout itself has no interactivity — sidebar & topbar
// components that need the client are imported as .client.jsx files.

import "./admin.theme.css";
import styles from "./layout.module.css";
import AdminSidebar from "./_components/AdminSidebar.client";
import AdminTopbar from "./_components/AdminTopbar.client";

export const metadata = {
    title: "لوحة المعلومات - إدارة لقطها",
    description: "لوحة تحكم المشرفين لإدارة النظام",
};

export default function AdminDashboardLayout({ children }) {
    return (
        <div
            id="admin-layout-root"
            className={styles.layoutRoot}
            data-admin-theme="dark"
            dir="rtl"
        >
            {/* Sidebar — right side (RTL) */}
            <div className={styles.sidebar}>
                <AdminSidebar />
            </div>

            {/* Main area */}
            <div className={styles.mainArea}>
                {/* Topbar */}
                <div className={styles.topbar}>
                    <AdminTopbar />
                </div>

                {/* Page content */}
                <main className={styles.pageContent}>{children}</main>
            </div>
        </div>
    );
}
