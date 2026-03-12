"use client";

import { useState } from "react";
import styles from "../settings.module.css";

export default function WebhooksSection({ data }) {
    const [webhooks, setWebhooks] = useState({
        webhook1: data?.webhook1 ?? "",
        webhook2: data?.webhook2 ?? "",
    });

    const handleChange = (e) =>
        setWebhooks({ ...webhooks, [e.target.name]: e.target.value });

    const handleSave = () => {
        alert("تم حفظ إعدادات الـ Webhooks بنجاح ✅");
    };

    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionHeaderIcon}>🔗</span>
                المرسلات التقنية (Webhooks)
            </div>

            <div className={styles.formBody}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>رابط الـ Webhook الأول</label>
                    <textarea
                        name="webhook1"
                        className={styles.formTextarea}
                        value={webhooks.webhook1}
                        onChange={handleChange}
                        rows={2}
                        dir="ltr"
                    />
                    <span className={styles.formNote}>
                        عنوان الوصول في الوقت الأسلوب الذي RRR للأحداث الخارجية...
                    </span>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>رابط الـ Webhook الثاني</label>
                    <textarea
                        name="webhook2"
                        className={styles.formTextarea}
                        value={webhooks.webhook2}
                        onChange={handleChange}
                        rows={2}
                        dir="ltr"
                    />
                    <span className={styles.formNote}>
                        شبك الاتصال على إرسال إشعار لكل حدث ERC0935...
                    </span>
                </div>

                <button className={styles.btnSave} onClick={handleSave}>
                    💾 حفظة القيام
                </button>
            </div>
        </div>
    );
}
