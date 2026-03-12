"use client";
import styles from "../employees.module.css";

export default function EmployeesFilters({ filters, setFilters }) {
    const handleChange = (field, val) => {
        setFilters((prev) => ({ ...prev, [field]: val }));
    };

    return (
        <div className={styles.filtersBar}>
            <button className={styles.btnNew}>+ موظف جديد</button>

            <div className={styles.filterSpacer} />

            <button className={styles.btnExport}>تصدير 📄</button>
        </div>
    );
}
