"use client";
import styles from "../users.module.css";

export default function UsersFilters({ filters, setFilters }) {
    const handleChange = (field, val) => {
        setFilters((prev) => ({ ...prev, [field]: val }));
    };

    return (
        <div className={styles.filtersBar}>
            <input
                type="text"
                className={styles.filterInput}
                placeholder="بحث بالاسم أو الجوال..."
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
            />

            <select
                className={styles.filterSelect}
                value={filters.city}
                onChange={(e) => handleChange("city", e.target.value)}
            >
                <option value="">جميع المدن</option>
                <option value="Jeddah">جدة</option>
                <option value="Riyadh">الرياض</option>
                <option value="Makkah">مكة</option>
            </select>

            <select
                className={styles.filterSelect}
                value={filters.membership}
                onChange={(e) => handleChange("membership", e.target.value)}
            >
                <option value="">جميع العضويات</option>
                <option value="VIP">VIP</option>
                <option value="Normal">عادي</option>
            </select>

            <select
                className={styles.filterSelect}
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
            >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="blocked">محظور</option>
            </select>

            <div className={styles.filterSpacer} />

            <button className={styles.btnExport}>تصدير 📄</button>
            <button className={styles.btnNew}>+ مستخدم جديد</button>
        </div>
    );
}
