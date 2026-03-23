// TicketsTable.server.jsx
// SERVER/CLIENT DECISION: Server Component — static markup rendering the list.
// In practice, this receives filtered data from the client orchestrator.

import styles from "../tickets.module.css";

// Helper to determine text colors and borders for pills
function getPillStyle(colorVar) {
    return {
        "--pill-color": colorVar,
        "--pill-borderColor": colorVar,
        "--pill-bg": "transparent",
    };
}

function formatDate(isoString) {
    if (!isoString || isoString === "-") return "-";
    try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('ar-SA', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    } catch {
        return isoString;
    }
}

function getPriorityColor(val) {
    if (val === "عاجلة" || val === "high") return "var(--admin-danger)";
    if (val === "متوسطة" || val === "medium") return "var(--admin-warning)";
    if (val === "منخفضة" || val === "low") return "var(--admin-success)";
    return "var(--admin-muted)";
}

function getStatusColor(val) {
    if (val === "مفتوحة" || val === "open") return "var(--admin-warning)";
    if (val === "قيد المعالجة" || val === "in_progress") return "var(--admin-primary)";
    if (val === "مغلقة" || val === "closed") return "var(--admin-success)";
    return "var(--admin-muted)";
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
                            <th>البريد الإلكتروني</th>
                            <th>التصنيف</th>
                            <th>المشكلة</th>
                            <th>الأولوية</th>
                            <th>الحالة</th>
                            <th>تاريخ الإنشاء</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((t) => (
                            <tr key={t.id}>
                                <td>
                                    <span className={styles.ticketId}>{t.number}</span>
                                </td>
                                <td>
                                    <span className={styles.customer}>{t.customer}</span>
                                </td>
                                <td>{t.email}</td>
                                <td>{t.category}</td>
                                <td>{t.issue}</td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={getPillStyle(getPriorityColor(t.priority))}
                                    >
                                        {t.priority}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={{
                                            "--pill-color": getStatusColor(t.status),
                                            "--pill-bg": `color-mix(in srgb, ${getStatusColor(t.status)} 15%, transparent)`,
                                        }}
                                    >
                                        {t.status}
                                    </span>
                                </td>
                                <td>{formatDate(t.createdAt)}</td>
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
