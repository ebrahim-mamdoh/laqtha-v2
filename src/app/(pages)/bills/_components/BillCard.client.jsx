"use client";

import React from "react";
import styles from "../bills.module.css";

const QRIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9h6V3H3v6zm1-5h4v4H4V4zm-1 17h6v-6H3v6zm1-5h4v4H4v-4zM15 3v6h6V3h-6zm1 1h4v4h-4V4zM13 13h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm0-4h2v2h-2v-2zm-2 2h2v2h-2v-2zM13 17h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2z" fill="currentColor" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 5v6m4-6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function formatCurrency(val) {
    return new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: "SAR",
    }).format(val).replace("SAR", "ر.س");
}

const BillCard = React.memo(({ bill, onQR, onDelete }) => {
    const isCompleted = bill.status === "مكتمل";

    return (
        <div className={styles.billCard}>
            <div className={styles.cardTop}>
                <div className={styles.cardInvoice}>#{bill.invoiceNumber}</div>
                <div className={styles.cardAmount}>{formatCurrency(bill.amount)}</div>
            </div>

            <div className={styles.cardBody}>
                <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>الاسم</span>
                    <span className={styles.cardValue}>{bill.name}</span>
                </div>

                <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>النوع</span>
                    <span className={styles.cardValue}>{bill.type || "حجز"}</span>
                </div>

                <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>الحالة</span>
                    <span className={`${styles.statusBadge} ${isCompleted ? styles.statusCompleted : styles.statusPending}`}>
                        {bill.status}
                    </span>
                </div>

                <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>تاريخ البدء</span>
                    <span className={styles.cardValue}>
                        {new Date(bill.date).toLocaleDateString("en-GB")}
                    </span>
                </div>

                <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>الإجراءات</span>
                    <div className={styles.actionGroup}>
                        <button className={styles.actionBtn} onClick={() => onDelete(bill)}>
                            <DeleteIcon />
                        </button>
                        <button className={styles.actionBtn} onClick={() => onQR(bill)}>
                            <QRIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

BillCard.displayName = 'BillCard';

export default BillCard;
