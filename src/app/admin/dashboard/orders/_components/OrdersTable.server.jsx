// OrdersTable.server.jsx
// SERVER/CLIENT DECISION: Server Component — pure table markup, no interactivity.
// In production: receive `orders` as a prop from the parent page's async fetch().

import styles from "../orders.module.css";

const STATUS_MAP = {
    new: { label: "جديد", cls: styles.statusNew },
    processing: { label: "قيد التنفيذ", cls: styles.statusProcessing },
    completed: { label: "مكتمل", cls: styles.statusCompleted },
    cancelled: { label: "ملغي", cls: styles.statusCancelled },
};

const ORDERS = [
    {
        id: "LQ-00141",
        customer: "عبدالله الدخيل",
        type: "فندق",
        partner: "فندق الريتز",
        amount: "850 ريال",
        status: "completed",
        date: "2026-03-08",
    },
    {
        id: "LQ-00140",
        customer: "سارة المطيري",
        type: "مطعم",
        partner: "Shake Shack",
        amount: "340 ريال",
        status: "completed",
        date: "2026-03-08",
    },
    {
        id: "LQ-00139",
        customer: "خالد العنزي",
        type: "سياحة",
        partner: "رحلة الرياض",
        amount: "1,200 ريال",
        status: "processing",
        date: "2026-03-07",
    },
    {
        id: "LQ-00138",
        customer: "نورة المروعي",
        type: "نقل",
        partner: "كريم",
        amount: "1,500 ريال",
        status: "completed",
        date: "2026-03-07",
    },
    {
        id: "LQ-00137",
        customer: "فهد العتيبي",
        type: "خدمة",
        partner: "Apple Play",
        amount: "250 ريال",
        status: "new",
        date: "2026-03-07",
    },
    {
        id: "LQ-00136",
        customer: "منى القحطاني",
        type: "فندق",
        partner: "فندق القصر",
        amount: "2,148 ريال",
        status: "cancelled",
        date: "2026-03-06",
    },
];

export default function OrdersTable({ orders = ORDERS }) {
    return (
        <div className={styles.tableCard}>
            {/* Header */}
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>
                    📦 جميع الطلبات والحجوزات
                    <span className={styles.tableCount}>{orders.length} نتيجة</span>
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
                            <th>المبلغ</th>
                            <th>الحالة</th>
                            <th>تاريخ الإنشاء</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const st = STATUS_MAP[order.status] ?? STATUS_MAP.new;
                            return (
                                <tr key={order.id}>
                                    <td>
                                        <span className={styles.orderId}>{order.id}</span>
                                    </td>
                                    <td>
                                        <span className={styles.customer}>{order.customer}</span>
                                    </td>
                                    <td>{order.type}</td>
                                    <td>{order.partner}</td>
                                    <td>
                                        <span className={styles.amount}>{order.amount}</span>
                                    </td>
                                    <td>
                                        <span className={`${styles.status} ${st.cls}`}>
                                            {st.label}
                                        </span>
                                    </td>
                                    <td>{order.date}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.actionBtn}
                                                title="عرض"
                                                aria-label={`عرض الطلب ${order.id}`}
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
                                                title="حذف"
                                                aria-label={`حذف الطلب ${order.id}`}
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
            <div className={styles.pagination}>
                <span className={styles.pageInfo}>
                    عرض 1–{orders.length} من أصل 1,284 طلب
                </span>
                <div className={styles.pageControls}>
                    <button className={styles.pageBtn} disabled>«</button>
                    <button className={styles.pageBtn} disabled>‹</button>
                    <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                    <button className={styles.pageBtn}>2</button>
                    <button className={styles.pageBtn}>3</button>
                    <span style={{ color: "var(--admin-muted)", padding: "0 4px" }}>...</span>
                    <button className={styles.pageBtn}>43</button>
                    <button className={styles.pageBtn}>›</button>
                    <button className={styles.pageBtn}>»</button>
                </div>
            </div>
        </div>
    );
}
