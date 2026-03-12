"use client";

import { useState } from "react";
import { useSaveWalletSettings } from "../useSettings";
import styles from "../settings.module.css";

export default function WalletSettingsSection({ data }) {
    const [form, setForm] = useState({
        stripeKey: data?.stripeKey ?? "",
        stripePublicKey: data?.stripePublicKey ?? "",
        minPayout: data?.minPayout ?? 15,
        payoutWindowDays: data?.payoutWindowDays ?? "14",
        description: data?.description ?? "",
        withdrawalDescription: data?.withdrawalDescription ?? "",
    });

    const { mutate: save, isPending } = useSaveWalletSettings();
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionHeaderIcon}>💳</span>
                إعدادات المحفظة
            </div>

            <div className={styles.formBody}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>مفتاح Stripe السري (Secret Key)</label>
                    <input
                        name="stripeKey"
                        type="password"
                        className={styles.formInput}
                        value={form.stripeKey}
                        onChange={handleChange}
                        dir="ltr"
                        placeholder="sk_live_••••••••••••••"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>مفتاح Stripe العام (Public Key)</label>
                    <input
                        name="stripePublicKey"
                        type="password"
                        className={styles.formInput}
                        value={form.stripePublicKey}
                        onChange={handleChange}
                        dir="ltr"
                        placeholder="pk_live_••••••••••••••"
                    />
                </div>

                <div className={styles.formGroupRow}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>حد أدنى للصرف (ر.س)</label>
                        <input
                            name="minPayout"
                            type="number"
                            className={styles.formInput}
                            value={form.minPayout}
                            onChange={handleChange}
                            dir="ltr"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>نافذة السحب (أيام)</label>
                        <input
                            name="payoutWindowDays"
                            type="number"
                            className={styles.formInput}
                            value={form.payoutWindowDays}
                            onChange={handleChange}
                            dir="ltr"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>وصف النظام</label>
                    <textarea
                        name="description"
                        className={styles.formTextarea}
                        value={form.description}
                        onChange={handleChange}
                        rows={2}
                    />
                    <span className={styles.formNote}>
                        حصة من العقود يتلقى نظام الدفع المتكامل المالكة 5% من كل معاملة ناجحة.
                    </span>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>وصف الاسترداد</label>
                    <textarea
                        name="withdrawalDescription"
                        className={styles.formTextarea}
                        value={form.withdrawalDescription}
                        onChange={handleChange}
                        rows={2}
                    />
                    <span className={styles.formNote}>
                        دعم طريقة شاملة للنظام المالكة المتكاملة بنسبة 5%.
                    </span>
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
