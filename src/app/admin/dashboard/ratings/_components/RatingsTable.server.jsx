// RatingsTable.server.jsx
// SERVER/CLIENT DECISION: Server Component — static markup rendering the list.

import styles from "../ratings.module.css";

function getPillStyle(colorVar) {
    return {
        "--pill-color": colorVar,
        "--pill-borderColor": colorVar,
        "--pill-bg": "transparent",
    };
}

export default function RatingsTable({ ratings }) {
    if (!ratings || ratings.length === 0) {
        return (
            <div className={styles.tableCard}>
                <div className={styles.centerContainer}>لا توجد تقييمات تطابق بحثك.</div>
            </div>
        );
    }

    return (
        <div className={styles.tableCard}>
            {/* Table Header */}
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>تقييمات العملاء ⭐</div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table} dir="rtl">
                    <thead>
                        <tr>
                            <th>العميل</th>
                            <th>الخدمة</th>
                            <th>رقم الطلب</th>
                            <th>الشريك</th>
                            <th>التقييم</th>
                            <th>التعليق</th>
                            <th>التاريخ</th>
                            <th>الحالة</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.map((r) => (
                            <tr key={r.id}>
                                <td>
                                    <span className={styles.customerName}>{r.customer}</span>
                                </td>
                                <td>{r.service}</td>
                                <td>
                                    <span className={styles.orderId}>{r.orderId}</span>
                                </td>
                                <td>{r.partner}</td>
                                <td>
                                    <div className={styles.ratingWrap}>
                                        <span className={styles.ratingScore}>{r.ratingScore.toFixed(1)}</span>
                                        <span className={styles.ratingStars}>{"★".repeat(Math.round(r.ratingScore))}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.commentWrap}>
                                        {r.comment}
                                    </div>
                                </td>
                                <td>{r.date}</td>
                                <td>
                                    <span
                                        className={styles.pill}
                                        style={getPillStyle(r.statusColor)}
                                    >
                                        {r.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} title="عرض الطلب">👁️</button>
                                        <button className={styles.actionBtn} title="الرد على التقييم">💬</button>
                                        <button className={styles.actionBtn} title="إخفاء التقييم">🛑</button>
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
