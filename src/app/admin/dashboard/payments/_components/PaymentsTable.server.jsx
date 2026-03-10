// PaymentsTable.server.jsx
// SERVER COMPONENT rendering the right-side table

import styles from "../payments.module.css";

function getPillStyle(colorVar) {
    return {
        "--pill-color": colorVar,
        "--pill-borderColor": "transparent",
        "--pill-bg": `color-mix(in srgb, ${colorVar} 15%, transparent)`,
    };
}

export default function PaymentsTable({ payments }) {
    if (!payments || payments.length === 0) {
        return (
            <div className={styles.centerContainer}>لا توجد معاملات تطابق بحثك.</div>
        );
    }

    return (
        <div className={styles.tableWrap}>
            <table className={styles.table} dir="rtl">
                <thead>
                    <tr>
                        <th>المعرّف</th>
                        <th>رقم الطلب</th>
                        <th>العميل</th>
                        <th>المبلغ</th>
                        <th>الطريقة</th>
                        <th>الحالة</th>
                        <th>الوقت</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((p) => (
                        <tr key={p.id}>
                            <td><span className={styles.txnId}>{p.id}</span></td>
                            <td><span className={styles.orderId}>{p.orderId}</span></td>
                            <td>{p.customer}</td>
                            <td>
                                <span className={styles.amount} style={{ color: p.amountColor }}>
                                    {p.amount}
                                </span>
                            </td>
                            <td>{p.method}</td>
                            <td>
                                <span
                                    className={styles.pill}
                                    style={getPillStyle(p.statusColor)}
                                >
                                    {p.status}
                                </span>
                            </td>
                            <td>{p.time}</td>
                            <td>
                                <div className={styles.actions}>
                                    <button className={styles.actionBtn} title="عرض">👁️</button>
                                    <button className={styles.actionBtn} title="إيصال">🧾</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
