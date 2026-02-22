import React from "react";
import styles from "../bills.module.css";

function formatCurrency(val) {
    return new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: "SAR",
    }).format(val).replace("SAR", "ر.س");
}

const StatCard = ({ title, value }) => (
    <div className={styles.statCard}>
        <div className={styles.statTitle}>{title}</div>
        <div className={styles.statValue}>{formatCurrency(value)}</div>
    </div>
);

export default StatCard;
