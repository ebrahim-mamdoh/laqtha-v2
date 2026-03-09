// RecentOrders.server.jsx
// SERVER/CLIENT DECISION: Server Component — pure table rendering, no interactivity.
// In production: replace ORDERS with an async fetch() call.

import styles from "./BottomRow.module.css";

const ORDERS = [
    {
        id: "LQ-00116",
        customer: "عبدالله الدخيل",
        type: "فندق",
        amount: "850 ريال",
        status: "success",
    },
    {
        id: "LQ-00134",
        customer: "سارة المطيري",
        type: "مطعم",
        amount: "340 ريال",
        status: "success",
    },
    {
        id: "LQ-00139",
        customer: "خالد العنزي",
        type: "سياحة",
        amount: "1,200 ريال",
        status: "pending",
    },
    {
        id: "LQ-00114",
        customer: "نورة المروعي",
        type: "نقل",
        amount: "1,500 ريال",
        status: "success",
    },
];

const STATUS_MAP = {
    success: { label: "ناجح", cls: styles.statusSuccess },
    pending: { label: "معلق", cls: styles.statusPending },
    cancelled: { label: "ملغي", cls: styles.statusCancelled },
};

export default function RecentOrders() {
    return (
        <table className={styles.table} dir="rtl">
            <thead>
                <tr>
                    <th>رقم الطلب</th>
                    <th>العميل</th>
                    <th>الخدمة</th>
                    <th>المبلغ</th>
                    <th>الحالة</th>
                </tr>
            </thead>
            <tbody>
                {ORDERS.map((order) => {
                    const st = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
                    return (
                        <tr key={order.id}>
                            <td>
                                <span className={styles.orderId}>{order.id}</span>
                            </td>
                            <td>{order.customer}</td>
                            <td>{order.type}</td>
                            <td>
                                <span className={styles.amount}>{order.amount}</span>
                            </td>
                            <td>
                                <span className={`${styles.status} ${st.cls}`}>
                                    {st.label}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
