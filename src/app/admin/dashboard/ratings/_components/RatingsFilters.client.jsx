"use client";
import styles from "../ratings.module.css";

export default function RatingsFilters({ filters, setFilters }) {
    const handleChange = (field, val) => {
        setFilters((prev) => ({ ...prev, [field]: val }));
    };

    return (
        <div className={styles.filtersBar}>
            <input
                type="text"
                className={styles.filterInput}
                placeholder="بحث برقم الطلب أو اسم العميل..."
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
            />

            <select
                className={styles.filterSelect}
                value={filters.score}
                onChange={(e) => handleChange("score", e.target.value)}
            >
                <option value="">جميع التقييمات</option>
                <option value="5">5 نجوم</option>
                <option value="4">4 نجوم</option>
                <option value="3">3 نجوم</option>
                <option value="2">نجومتان</option>
                <option value="1">نجمة واحدة</option>
            </select>

            <select
                className={styles.filterSelect}
                value={filters.partner}
                onChange={(e) => handleChange("partner", e.target.value)}
            >
                <option value="">جميع الشركاء</option>
                <option value="Premium">بريميوم جدة</option>
                <option value="Sharqia">الشرقية</option>
            </select>

            <select
                className={styles.filterSelect}
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
            >
                <option value="">جميع الحالات</option>
                <option value="published">منشور</option>
                <option value="hidden">مخفي</option>
            </select>

            <div className={styles.filterSpacer} />

            <button className={styles.btnExport}>تصدير 📄</button>
        </div>
    );
}
