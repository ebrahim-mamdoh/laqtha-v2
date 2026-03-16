// UsersTable.server.jsx
// SERVER/CLIENT DECISION: Server Component — static markup rendering the list.

import styles from "../users.module.css";

function getPillStyle(colorVar) {
    return {
        "--pill-color": colorVar,
        "--pill-borderColor": colorVar,
        "--pill-bg": `color-mix(in srgb, ${colorVar} 15%, transparent)`,
    };
}

export default function UsersTable({ users }) {
    if (!users || users.length === 0) {
        return (
            <div className={styles.tableCard}>
                <div className={styles.centerContainer}>لا يوجد مستخدمين يطابقون بحثك.</div>
            </div>
        );
    }

    return (
        <div className={styles.tableCard}>
            {/* Table Header */}
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>إدارة المستخدمين</div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table} dir="rtl">
                    <thead>
                        <tr>
                            <th>المستخدم</th>
                            <th>رقم الجوال</th>
                            <th>البريد الإلكتروني</th>
                            <th>الدور</th>
                            <th>المحفظة</th>
                            <th>تاريخ التسجيل</th>
                            <th>الحالة</th>
                            <th>آخر نشاط</th>
                            <th>الأصدقاء</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => {
                            const isCustomer = u.role === "customer";
                            const roleLabel = isCustomer ? "عميل" : "شريك";
                            const roleColor = isCustomer ? "var(--admin-primary, #3b82f6)" : "var(--admin-secondary, #8b5cf6)"; // Blue / Purple
                            
                            const isActive = u.status === "active";
                            const statusLabel = isActive ? "نشط" : "غير موثق";
                            const statusColor = isActive ? "var(--admin-success, green)" : "var(--admin-warning, yellow)";

                            return (
                                <tr key={u.id}>
                                    <td>
                                        <div className={styles.userNameWrap}>
                                            <div className={styles.userAvatar}>
                                                {u.name ? u.name.charAt(0) : "م"}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <span>{u.name}</span>
                                                {u.isGoogleUser && (
                                                    <span style={{ fontSize: "0.7rem", color: "var(--admin-text-muted, gray)", display: "flex", gap: "4px", alignItems: "center" }}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" stroke="none"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" stroke="none"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" stroke="none"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" stroke="none"/></svg>
                                                        مستخدم جوجل
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td><span dir="ltr" style={{ display: 'inline-block' }}>{u.phone || "-"}</span></td>
                                    <td><span style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>{u.email || "-"}</span></td>
                                    <td>
                                        <span
                                            className={styles.pill}
                                            style={getPillStyle(roleColor)}
                                        >
                                            {roleLabel}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={styles.spending}>{u.walletBalance?.toLocaleString("ar-SA") || 0} ر.س</span>
                                    </td>
                                    <td>
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("ar-SA") : "-"}
                                    </td>
                                    <td>
                                        <span
                                            className={styles.pill}
                                            style={{
                                                ...getPillStyle(statusColor),
                                                border: "none",
                                            }}
                                        >
                                            {statusLabel}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>
                                            {u.lastActive ? new Date(u.lastActive).toLocaleDateString("ar-SA") : "لا يوجد نشاط"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {u.friendsCount}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn} title="عرض حساب المستخدم">👁️</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
