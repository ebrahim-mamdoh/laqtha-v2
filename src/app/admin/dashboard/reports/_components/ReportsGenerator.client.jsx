"use client";

import { useState } from "react";
import styles from "../reports.module.css";

export default function ReportsGenerator() {
    const [formData, setFormData] = useState({
        type: "revenue",
        from: "",
        to: "",
        account: "all",
        format: "pdf"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = () => {
        alert("جارٍ إنشاء التقرير... 🚀");
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>إنشاء تقرير مخصص 🛠️</div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>نوع التقرير</label>
                <select name="type" className={styles.formSelect} value={formData.type} onChange={handleChange}>
                    <option value="revenue">تقرير إيرادات</option>
                    <option value="users">تقرير مستخدمين</option>
                    <option value="partners">تقرير شركاء</option>
                </select>
            </div>

            <div className={styles.formGroupRow}>
                <div className={styles.formDateGroup}>
                    <label className={styles.formLabel}>إلى</label>
                    <input type="date" name="to" className={styles.formInput} value={formData.to} onChange={handleChange} dir="ltr" />
                </div>
                <div className={styles.formDateGroup}>
                    <label className={styles.formLabel}>من</label>
                    <input type="date" name="from" className={styles.formInput} value={formData.from} onChange={handleChange} dir="ltr" />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>عمليات حسب طريقة الدفع</label>
                <select name="account" className={styles.formSelect} value={formData.account} onChange={handleChange}>
                    <option value="all">الكل</option>
                    <option value="mada">مدى</option>
                    <option value="apple">Apple Pay</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>الصيغة</label>
                <select name="format" className={styles.formSelect} value={formData.format} onChange={handleChange}>
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV / Excel</option>
                </select>
            </div>

            <div className={styles.formNotice}>
                💡 تقرير مالي لن يتضمن عمولات الشركاء ورسوم بوابات الدفع (إيرادات صافية).
            </div>

            <button className={styles.btnSubmit} onClick={handleCreate}>
                إنشاء التقرير 📊
            </button>
        </div>
    );
}
