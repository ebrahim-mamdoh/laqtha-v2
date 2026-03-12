// EmployeesTable.server.jsx
// SERVER/CLIENT DECISION: Server Component rendering.

import styles from "../employees.module.css";

function getPillStyle(colorVar) {
    return {
        "--pill-color": colorVar,
        "--pill-borderColor": colorVar,
        "--pill-bg": "transparent",
    };
}

export default function EmployeesTable({ employees }) {
    if (!employees || employees.length === 0) {
        return (
            <div className={styles.tableCard}>
                <div className={styles.centerContainer}>لا يوجد موظفين مسجلين.</div>
            </div>
        );
    }

    return (
        <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>إدارة الموظفين 👤</div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table} dir="rtl">
                    <thead>
                        <tr>
                            <th>الموظف</th>
                            <th>الدور</th>
                            <th>القسم</th>
                            <th>وقت الاستجابة</th>
                            <th>التذاكر المحلولة</th>
                            <th>التذاكر المفتوحة</th>
                            <th>التقييم</th>
                            <th>التواصل</th>
                            <th>الحالة</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((e) => (
                            <tr key={e.id}>
                                <td>
                                    <div className={styles.employeeWrap}>
                                        <div className={styles.avatar}>{e.initials}</div>
                                        <span className={styles.empName}>{e.name}</span>
                                    </div>
                                </td>
                                <td>{e.role}</td>
                                <td>{e.department}</td>
                                <td>
                                    <span className={styles.statNumber} style={{ color: e.responseColor }}>
                                        {e.responseTime}
                                    </span>
                                </td>
                                <td><span className={styles.statNumber} style={{ color: 'var(--admin-success)' }}>{e.solvedTickets}</span></td>
                                <td><span className={styles.statNumber} style={{ color: 'var(--admin-warning)' }}>{e.openTickets}</span></td>
                                <td>
                                    <div className={styles.ratingWrap}>
                                        <span className={styles.ratingStars}>{"★".repeat(Math.round(e.ratingScore))}</span>
                                    </div>
                                </td>
                                <td>{e.lastSeen}</td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={getPillStyle(e.statusColor)}
                                    >
                                        {e.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} title="حظر">🛑</button>
                                        <button className={styles.actionBtn} title="تعديل الدور">✏️</button>
                                        <button className={styles.actionBtn} title="مراسلة">💬</button>
                                        <button className={styles.actionBtn} title="سجل النشاط">📜</button>
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
