"use client";

import styles from "./BottomRow.module.css";
import { useRecentActivity } from "../overview/useOverview";

const STATUS_MAP = {
    success: { label: "ناجح", cls: styles.statusSuccess },
    completed: { label: "ناجح", cls: styles.statusSuccess },
    pending: { label: "معلق", cls: styles.statusPending },
    pending_approval: { label: "معلق", cls: styles.statusPending },
    cancelled: { label: "ملغي", cls: styles.statusCancelled },
    rejected: { label: "ملغي", cls: styles.statusCancelled },
};

export default function RecentOrders() {
    const { data: orders = [], isLoading, isError } = useRecentActivity();

    if (isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted, gray)' }}>جاري التحميل...</div>;
    }

    if (isError) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-danger)' }}>حدث خطأ في تحميل آخر الطلبات</div>;
    }

    if (orders.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted, gray)' }}>لا يوجد نشاط أخير لعرضه</div>;
    }

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
                {orders.map((order) => {
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
