"use client";

import { useState, useMemo } from "react";
import { usePayments } from "./usePayments";
import PaymentsFilters from "./_components/PaymentsFilters.client";
import PaymentsTable from "./_components/PaymentsTable.server";
import styles from "./payments.module.css";

export default function PaymentsClient() {
    const { data: payments, isLoading, isError } = usePayments();
    const [filters, setFilters] = useState({
        status: "",
        method: "",
        startDate: "",
        endDate: "",
    });

    const filteredPayments = useMemo(() => {
        if (!payments) return [];
        return payments; // Simplistic pass-through mock filter
    }, [payments, filters]);

    return (
        <div className={styles.tablePanel}>
            <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>آخر المعاملات 💳</div>
                <div className={styles.headerActions}>
                    <button className={styles.btnExport}>Excel 📊</button>
                    <button className={styles.btnExport}>كشف محاسبي 📄</button>
                </div>
            </div>

            <PaymentsFilters filters={filters} setFilters={setFilters} />

            {isLoading ? (
                <div className={styles.centerContainer}>جاري تحميل البيانات...</div>
            ) : isError ? (
                <div className={styles.centerContainer}>حدث خطأ في جلب المدفوعات.</div>
            ) : (
                <PaymentsTable payments={filteredPayments} />
            )}
        </div>
    );
}
