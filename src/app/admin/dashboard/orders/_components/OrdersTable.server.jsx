// OrdersTable.server.jsx
// SERVER/CLIENT DECISION: Server Component — pure table markup, no interactivity.
// In production: receive `orders` as a prop from the parent page's async fetch().

import styles from "../orders.module.css";

const STATUS_MAP = {
    pending: { label: "قيد الانتظار", cls: styles.statusNew },
    "in-progress": { label: "قيد التنفيذ", cls: styles.statusProcessing },
    completed: { label: "مكتمل", cls: styles.statusCompleted },
    cancelled: { label: "ملغي", cls: styles.statusCancelled },
};

export default function OrdersTable({ orders = [], meta, onPageChange, onViewClick, onCancelClick }) {
    return (
        <div className={styles.tableCard}>
            {/* Header */}
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>
                    📦 جميع الطلبات والحجوزات
                    <span className={styles.tableCount}>{meta?.total || 0} نتيجة</span>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrap}>
                <table className={styles.table} dir="rtl">
                    <thead>
                        <tr>
                            <th>رقم الطلب</th>
                            <th>اسم العميل</th>
                            <th>نوع الخدمة</th>
                            <th>الشريك</th>
                            <th>الحالة</th>
                            <th>تاريخ الإنشاء</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const st = STATUS_MAP[order.state] ?? STATUS_MAP.pending;
                            return (
                                <tr key={order.id}>
                                    <td>
                                        <span className={styles.orderId}>{order.number}</span>
                                    </td>
                                    <td>
                                        <span className={styles.customer} title={order.customerEmail}>{order.customerName}</span>
                                    </td>
                                    <td>{order.service}</td>
                                    <td>
                                        <span title={order.partnerContact}>{order.partnerName}</span>
                                    </td>
                                    <td>
                                        <span className={`${styles.status} ${st.cls}`}>
                                            {order.stateLabel || st.label}
                                        </span>
                                    </td>
                                    <td>{order.createdAt}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.actionBtn}
                                                title="عرض"
                                                aria-label={`عرض الطلب ${order.id}`}
                                                onClick={() => onViewClick?.(order.id)}
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className={styles.actionBtn}
                                                title="تعديل"
                                                aria-label={`تعديل الطلب ${order.id}`}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                title={order.stateLabel !== "مؤكد" ? "لا يمكن إلغاء هذا الطلب" : "إلغاء"}
                                                aria-label={`إلغاء الطلب ${order.id}`}
                                                disabled={order.stateLabel !== "مؤكد"}
                                                onClick={() => onCancelClick?.(order.id)}
                                                style={{ opacity: order.stateLabel !== "مؤكد" ? 0.4 : 1, cursor: order.stateLabel !== "مؤكد" ? "not-allowed" : "pointer" }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>
                        عرض الصفحات (توجد {meta.total} نتائج)
                    </span>
                    <div className={styles.pageControls}>
                        <button 
                            className={styles.pageBtn} 
                            disabled={meta.page <= 1}
                            onClick={() => onPageChange?.(meta.page - 1)}
                        >‹</button>
                        
                        {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                            let startPage = 1;
                            if (meta.totalPages > 5) {
                                startPage = Math.max(1, meta.page - 2);
                                if (startPage + 4 > meta.totalPages) {
                                    startPage = meta.totalPages - 4;
                                }
                            }
                            const pageNum = startPage + i;
                            
                            return (
                                <button 
                                    key={pageNum}
                                    className={`${styles.pageBtn} ${meta.page === pageNum ? styles.pageBtnActive : ''}`}
                                    onClick={() => onPageChange?.(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {meta.totalPages > 5 && meta.page < meta.totalPages - 2 && (
                            <>
                                <span style={{ color: "var(--admin-muted)", padding: "0 4px" }}>...</span>
                                <button 
                                    className={styles.pageBtn}
                                    onClick={() => onPageChange?.(meta.totalPages)}
                                >
                                    {meta.totalPages}
                                </button>
                            </>
                        )}

                        <button 
                            className={styles.pageBtn} 
                            disabled={!meta.totalPages || meta.page >= meta.totalPages}
                            onClick={() => onPageChange?.(meta.page + 1)}
                        >›</button>
                    </div>
                </div>
            )}
        </div>
    );
}
