// page.jsx — ACCESS DENIED PAGE (Admin surface)
// SERVER/CLIENT DECISION: Server Component.
// Pure static display — no state or effects needed.
// Shown when role !== "admin".

import Link from "next/link";
import "../dashboard/admin.theme.css";
import styles from "./access-denied.module.css";

export const metadata = {
    title: "غير مصرح — لوحة الإدارة",
};

export default function AccessDeniedPage() {
    return (
        <div className={styles.page} data-admin-theme="dark">
            <div className={styles.card}>
                <span className={styles.icon}>🔒</span>
                <h1 className={styles.title}>غير مصرح بالدخول</h1>
                <p className={styles.subtitle}>
                    صلاحياتك الحالية لا تسمح لك بالوصول إلى لوحة الإدارة.
                    <br />
                    إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع مسؤول النظام.
                </p>
                <Link href="/chat" className={styles.backBtn}>
                    ← العودة للتطبيق
                </Link>
            </div>
        </div>
    );
}
