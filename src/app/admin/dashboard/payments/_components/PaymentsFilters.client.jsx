"use client";
import styles from "../payments.module.css";

export default function PaymentsFilters({ filters, setFilters }) {
    const handleChange = (field, val) => {
        setFilters((prev) => ({ ...prev, [field]: val }));
    };

    return (
        <div className={styles.filtersBar}>
            <select
                className={styles.filterSelect}
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
            >
                <option value="">جميع الحالات</option>
                <option value="success">ناجحة</option>
                <option value="processing">معالجة</option>
                <option value="failed">فشلت</option>
            </select>

            <select
                className={styles.filterSelect}
                value={filters.method}
                onChange={(e) => handleChange("method", e.target.value)}
            >
                <option value="">جميع الطرق</option>
                <option value="mada">مدى</option>
                <option value="card">بطاقة ائتمانية</option>
                <option value="apple">Apple Pay</option>
            </select>

            {/* Date Pickers representing mm/dd/yyyy */}
            <input
                type="date"
                className={styles.filterDate}
                value={filters.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
            />
            <input
                type="date"
                className={styles.filterDate}
                value={filters.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
            />

            <div className={styles.filterSpacer} />
        </div>
    );
}
