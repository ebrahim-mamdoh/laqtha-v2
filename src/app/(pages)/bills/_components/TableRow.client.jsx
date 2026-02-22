"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../bills.module.css";

const DotsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

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

const TableRow = React.memo(({ bill, onQR, onDelete }) => {
    const isCompleted = bill.status === "مكتمل";
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!showMenu) return;
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    return (
        <tr className={styles.tbodyRow} style={{ position: showMenu ? "relative" : "", zIndex: showMenu ? 100 : "" }}>
            <td>
                <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" className={styles.checkbox} />
                    <span>{bill.invoiceNumber || "0334"}</span>
                </div>
            </td>
            <td>
                <span className={styles.storeName}>{bill.name}</span>
            </td>
            <td>{bill.type || "حجز"}</td>
            <td>{formatCurrency(bill.amount)}</td>
            <td>
                <span className={`${styles.statusBadge} ${isCompleted ? styles.statusCompleted : styles.statusPending}`}>
                    {bill.status}
                </span>
            </td>
            <td>{new Date(bill.date).toLocaleDateString("en-GB")}</td>
            <td>{bill.endDate ? new Date(bill.endDate).toLocaleDateString("en-GB") : new Date(bill.date).toLocaleDateString("en-GB")}</td>
            <td>
                <div className={styles.actionGroup}>
                    <button className={styles.actionBtn} onClick={() => onDelete(bill)} title="حذف">
                        <DeleteIcon />
                    </button>
                    <button className={styles.actionBtn} onClick={() => onQR(bill)} title="رمز QR">
                        <QRIcon />
                    </button>

                    <div className={styles.dotsContainer} ref={menuRef}>
                        <button
                            className={styles.actionBtn}
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <DotsIcon />
                        </button>

                        {showMenu && (
                            <div className={styles.dotsDropdown}>
                                <button className={styles.dotsItem} onClick={() => { setShowMenu(false); console.log("Reorder", bill.id); }}>
                                    اعادة الطلب
                                </button>
                                <button className={styles.dotsItem} onClick={() => { setShowMenu(false); console.log("Print", bill.id); }}>
                                    طباعة الفاتورة
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
});

TableRow.displayName = 'TableRow';

export default TableRow;
