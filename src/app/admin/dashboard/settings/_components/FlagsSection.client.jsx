"use client";

import { useState } from "react";
import styles from "../settings.module.css";

export default function FlagsSection({ data }) {
    const [flags, setFlags] = useState({
        maintenanceMode: data?.maintenanceMode ?? false,
        featuredListings: data?.featuredListings ?? true,
        liveChat: data?.liveChat ?? true,
    });

    const toggle = (key) => setFlags((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionHeaderIcon}>🚩</span>
                فاصل التحارير (System Flags)
            </div>

            <div className={styles.toggleRow}>
                <div className={styles.toggleLabelGroup}>
                    <div className={styles.toggleTitle}>وضع الصيانة</div>
                    <div className={styles.toggleDesc}>إيقاف الوصول العام للمنصة مؤقتاً</div>
                </div>
                <label className={styles.switch}>
                    <input type="checkbox" checked={flags.maintenanceMode} onChange={() => toggle("maintenanceMode")} />
                    <span className={styles.slider} />
                </label>
            </div>

            <div className={styles.toggleRow}>
                <div className={styles.toggleLabelGroup}>
                    <div className={styles.toggleTitle}>قوائم المميزة</div>
                    <div className={styles.toggleDesc}>تفعيل إبراز الشركاء المدفوعين أعلى نتائج البحث</div>
                </div>
                <label className={styles.switch}>
                    <input type="checkbox" checked={flags.featuredListings} onChange={() => toggle("featuredListings")} />
                    <span className={styles.slider} />
                </label>
            </div>

            <div className={styles.toggleRow}>
                <div className={styles.toggleLabelGroup}>
                    <div className={styles.toggleTitle}>الدردشة المباشرة</div>
                    <div className={styles.toggleDesc}>تفعيل نظام الدعم الفوري عبر الشات</div>
                </div>
                <label className={styles.switch}>
                    <input type="checkbox" checked={flags.liveChat} onChange={() => toggle("liveChat")} />
                    <span className={styles.slider} />
                </label>
            </div>

            <div className={styles.infoRow}>
                <div className={styles.infoLabel}>معرّف MF API</div>
                <div className={styles.infoValue}>{data?.mfApiId ?? "MF-#####133-0231"}</div>
            </div>

            <div className={styles.infoRow}>
                <div className={styles.infoLabel}>عناوين IP المسموح بها</div>
                <div className={styles.infoValue}>{data?.mfapiUrl1 ?? "192.168.1.1"}</div>
                <div className={styles.infoValue}>{data?.mfapiUrl2 ?? "192.168.1.1"}</div>
            </div>
        </div>
    );
}
