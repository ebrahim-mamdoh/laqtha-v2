// UsersTable.server.jsx
// SERVER/CLIENT DECISION: Server Component — static markup rendering the list.

import styles from "../users.module.css";

function getPillStyle(colorVar) {
    return {
        "--pill-color": colorVar,
        "--pill-borderColor": colorVar,
        "--pill-bg": "transparent",
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
                            <th>الجوال / البريد</th>
                            <th>المدينة</th>
                            <th>تاريخ التسجيل</th>
                            <th>الطلبات</th>
                            <th>الإنفاق</th>
                            <th>وسم</th>
                            <th>آخر نشاط</th>
                            <th>العضوية</th>
                            <th>الحالة</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>
                                    <div className={styles.userNameWrap}>
                                        <div className={styles.userAvatar}>
                                            {u.name.charAt(0)}
                                        </div>
                                        {u.name}
                                    </div>
                                </td>
                                <td>{u.contact}</td>
                                <td>{u.city}</td>
                                <td>{u.joinDate}</td>
                                <td>{u.orders}</td>
                                <td>
                                    <span className={styles.spending}>{u.spending}</span>
                                </td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={getPillStyle(u.tagColor)}
                                    >
                                        {u.tag}
                                    </span>
                                </td>
                                <td>{u.lastActive}</td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={{
                                            "--pill-color": u.membershipColor,
                                            "--pill-bg": `color-mix(in srgb, ${u.membershipColor} 15%, transparent)`,
                                        }}
                                    >
                                        {u.membership}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={{
                                            "--pill-color": u.statusColor,
                                            "--pill-bg": `color-mix(in srgb, ${u.statusColor} 15%, transparent)`,
                                        }}
                                    >
                                        {u.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} title="عرض">👁️</button>
                                        <button className={styles.actionBtn} title="تعديل">✏️</button>
                                        <button className={styles.actionBtn} title="صلاحيات">🔑</button>
                                        <button className={styles.actionBtn} title="حظر">🛑</button>
                                        <button className={styles.actionBtn} title="حذف">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
