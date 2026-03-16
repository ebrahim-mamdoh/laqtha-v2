"use client";
import styles from "../users.module.css";

export default function UsersFilters({ filters, setFilters }) {
    const handleChange = (field, val) => {
        setFilters((prev) => {
            // Reset page to 1 when filters change (we'll implement page in parent)
            return { ...prev, [field]: val, page: 1 };
        });
    };

    return (
        <div className={styles.filtersBar}>
            <input
                type="text"
                className={styles.filterInput}
                placeholder="بحث بالاسم أو الجوال أو البريد..."
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
            />

            <select
                className={styles.filterSelect}
                value={filters.role}
                onChange={(e) => handleChange("role", e.target.value)}
            >
                <option value="customer">عميل (Customer)</option>
                <option value="driver">شريك (Partner/Driver)</option>
            </select>

            <div className={styles.filterSpacer} />

            <button className={styles.btnExport}>تصدير 📄</button>
            <button className={styles.btnNew}>+ مستخدم جديد</button>
        </div>
    );
}
