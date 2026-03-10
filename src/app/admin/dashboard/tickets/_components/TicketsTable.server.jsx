// TicketsTable.server.jsx
// SERVER/CLIENT DECISION: Server Component — static markup rendering the list.
// In practice, this receives filtered data from the client orchestrator.

import styles from "../tickets.module.css";

// Helper to determine text colors and borders for pills
function getPillStyle(colorVar) {
    // We use the color variable as the text color.
    // We compute a soft background based on it using CSS variables.
    // To keep it simple, the CSS variable is something like var(--admin-danger).
    // We map that to background: var(--admin-danger-soft) if needed.
    // Actually, we can just use the color var directly in inline-styles.
    return {
        "--pill-color": colorVar,
        "--pill-borderColor": colorVar,
        "--pill-bg": "transparent",
    };
}

export default function TicketsTable({ tickets }) {
    if (!tickets || tickets.length === 0) {
        return (
            <div className={styles.tableCard}>
                <div className={styles.centerContainer}>لا توجد تذاكر تطابق بحثك.</div>
            </div>
        );
    }

    return (
        <div className={styles.tableCard}>
            {/* Table Header */}
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>تذاكر الدعم الفني</div>
                <div className={styles.tableCount}>
                    <span className={styles.pill} style={getPillStyle("var(--admin-text)")}>
                        {tickets.length} نتيجة
                    </span>
                </div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table} dir="rtl">
                    <thead>
                        <tr>
                            <th>رقم التذكرة</th>
                            <th>العميل</th>
                            <th>الجهة</th>
                            <th>التصنيف</th>
                            <th>المشكلة</th>
                            <th>الأولوية</th>
                            <th>حالة SLA</th>
                            <th>الموظف</th>
                            <th>التاريخ</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((t) => (
                            <tr key={t.id}>
                                <td>
                                    <span className={styles.ticketId}>{t.id}</span>
                                </td>
                                <td>
                                    <span className={styles.customer}>{t.customer}</span>
                                </td>
                                <td>{t.entity}</td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={getPillStyle(t.categoryColor)}
                                    >
                                        {t.category}
                                    </span>
                                </td>
                                <td>{t.subject}</td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={getPillStyle(t.priorityColor)}
                                    >
                                        {t.priority}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={getPillStyle(t.slaColor)}
                                    >
                                        {t.sla}
                                    </span>
                                </td>
                                <td>{t.assignee}</td>
                                <td>{t.date}</td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={{
                                            "--pill-color": t.statusColor,
                                            "--pill-bg": `color-mix(in srgb, ${t.statusColor} 15%, transparent)`,
                                        }}
                                    >
                                        {t.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} title="عرض">👁️</button>
                                        <button className={styles.actionBtn} title="تعديل">✏️</button>
                                        <button className={styles.actionBtn} title="حل">✅</button>
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
