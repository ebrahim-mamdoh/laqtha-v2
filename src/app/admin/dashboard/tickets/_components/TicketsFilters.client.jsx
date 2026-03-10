"use client";
import styles from "../tickets.module.css";

export default function TicketsFilters({ filters, setFilters }) {
    const handleChange = (field, val) => {
        setFilters((prev) => ({ ...prev, [field]: val }));
    };

    return (
        <div className={styles.filtersBar}>
            <input
                type="text"
                className={styles.filterInput}
                placeholder="بحث برقم التذكرة أو اسم العميل..."
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
            />

            <select
                className={styles.filterSelect}
                value={filters.category}
                onChange={(e) => handleChange("category", e.target.value)}
            >
                <option value="">جميع التصنيفات</option>
                <option value="financial">مشكلة مالية</option>
                <option value="technical">مشكلة تقنية</option>
                <option value="general">استفسار عام</option>
            </select>

            <select
                className={styles.filterSelect}
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
            >
                <option value="">جميع الحالات</option>
                <option value="processing">قيد المعالجة</option>
                <option value="waiting">بانتظار رد العميل</option>
                <option value="closed">مغلقة</option>
            </select>

            <select
                className={styles.filterSelect}
                value={filters.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
            >
                <option value="">جميع الأولويات</option>
                <option value="high">عاجلة</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
            </select>

            <div className={styles.filterSpacer} />

            <button className={styles.btnExport}>تصدير 📄</button>
            <button className={styles.btnNew}>+ تذكرة جديدة</button>
        </div>
    );
}
