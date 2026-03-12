"use client";

import { useState } from "react";
import { useSaveSystemSettings } from "../useSettings";
import styles from "../settings.module.css";

export default function SystemSettingsSection({ data }) {
    const [form, setForm] = useState({
        name: data?.name ?? "",
        email: data?.email ?? "",
        phone: data?.phone ?? "",
        country: data?.country ?? "",
    });

    const { mutate: save, isPending } = useSaveSystemSettings();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionHeaderIcon}>⚙️</span>
                إعدادات النظام
            </div>

            <div className={styles.formBody}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>اسم المنصة</label>
                    <input
                        name="name"
                        className={styles.formInput}
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>البريد الإلكتروني</label>
                    <input
                        name="email"
                        type="email"
                        className={styles.formInput}
                        value={form.email}
                        onChange={handleChange}
                        dir="ltr"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>رقم الهاتف</label>
                    <input
                        name="phone"
                        className={styles.formInput}
                        value={form.phone}
                        onChange={handleChange}
                        dir="ltr"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>العملة</label>
                    <select name="country" className={styles.formSelect} value={form.country} onChange={handleChange}>
                        <option value="ريال سعودي (SAR)">ريال سعودي (SAR)</option>
                        <option value="درهم إماراتي (AED)">درهم إماراتي (AED)</option>
                        <option value="دولار أمريكي (USD)">دولار أمريكي (USD)</option>
                    </select>
                </div>

                <button
                    className={styles.btnSave}
                    onClick={() => save(form)}
                    disabled={isPending}
                >
                    {isPending ? "جاري الحفظ..." : "💾 حفظ"}
                </button>
            </div>
        </div>
    );
}
