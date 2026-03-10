"use client";
import styles from "../partners.module.css";

export default function PartnersFilters({ filters, setFilters }) {
    const handleChange = (field, val) => {
        setFilters((prev) => ({ ...prev, [field]: val }));
    };

    return (
        <div className={styles.filtersBar}>
            <input
                type="text"
                className={styles.filterInput}
                placeholder="بحث باسم الشريك..."
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
            />

            <select
                className={styles.filterSelect}
                value={filters.sector}
                onChange={(e) => handleChange("sector", e.target.value)}
            >
                <option value="">جميع القطاعات</option>
                <option value="accommodation">الإقامة</option>
                <option value="restaurants">المطاعم</option>
                <option value="entertainment">الترفيه</option>
            </select>

            <select
                className={styles.filterSelect}
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
            >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="pending">معلق</option>
            </select>

            <div className={styles.filterSpacer} />

            <button className={styles.btnExport}>تصدير 📄</button>
            <button className={styles.btnNew}>+ إضافة شريك</button>
        </div>
    );
}
