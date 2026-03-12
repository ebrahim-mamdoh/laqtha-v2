"use client";

import { useState } from "react";
import styles from "../settings.module.css";

export default function SecuritySection({ data }) {
    const [sessionData, setSessionData] = useState({
        currentLogin: data?.currentLogin ?? "",
        callbackUrl: data?.callbackUrl ?? "",
        ttl: data?.ttl ?? "",
    });

    const handleChange = (e) =>
        setSessionData({ ...sessionData, [e.target.name]: e.target.value });

    const handleReset = () => {
        if (window.confirm("هل أنت متأكد من إعادة تشغيل الجلسة؟")) {
            alert("تم إعادة تشغيل الجلسة بنجاح ⚡");
        }
    };

    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionHeaderIcon}>🛡️</span>
                الجلسة الأمنية
            </div>

            <div className={styles.formBody}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>تسجيل الدخول الحالي</label>
                    <input
                        name="currentLogin"
                        className={styles.formInput}
                        value={sessionData.currentLogin}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>عنوان Callback</label>
                    <input
                        name="callbackUrl"
                        className={styles.formInput}
                        value={sessionData.callbackUrl}
                        onChange={handleChange}
                        dir="ltr"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>مدة الجلسة — TTL (ثانية)</label>
                    <input
                        name="ttl"
                        className={styles.formInput}
                        value={sessionData.ttl}
                        onChange={handleChange}
                        dir="ltr"
                    />
                </div>

                <button className={styles.btnDanger} onClick={handleReset}>
                    ⚡ أعد تشغيل الجلسة بدون قائل
                </button>
            </div>
        </div>
    );
}
