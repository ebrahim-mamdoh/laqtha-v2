"use client";

import { useState } from "react";
import { useNotifications, useMarkAllNotificationsRead } from "./useNotifications";
import styles from "./notifications.module.css";

// Helper to grab emoji/color class per type
function getIconForType(type) {
    switch (type) {
        case "danger": return { emoji: "🚨", cls: styles.iconDanger };
        case "warning": return { emoji: "🤝", cls: styles.iconWarning };
        case "success": return { emoji: "✅", cls: styles.iconSuccess };
        case "info":
        default: return { emoji: "🛡️", cls: styles.iconInfo };
    }
}

export default function NotificationsClient() {
    const { data: notifications, isLoading, isError } = useNotifications();
    const { mutate: markAllRead, isPending } = useMarkAllNotificationsRead();

    // Settings mock state
    const [settings, setSettings] = useState({
        urgentTickets: true,
        newPartners: true,
        dailyReports: true,
    });

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    if (isLoading) {
        return <div className={styles.centerContainer}>جاري تحميل الإشعارات...</div>;
    }

    if (isError) {
        return <div className={styles.centerContainer}>حدث خطأ أثناء جلب الإشعارات.</div>;
    }

    const hasUnread = notifications?.some((n) => !n.isRead);

    return (
        <div>
            <div className={styles.notifCard}>
                {/* Header */}
                <div className={styles.headerRow}>
                    <div className={styles.headerTitle}>مركز الإشعارات 🔔</div>
                    {hasUnread && (
                        <button
                            className={styles.markReadBtn}
                            onClick={() => markAllRead()}
                            disabled={isPending}
                        >
                            {isPending ? "جاري التحديث..." : "تعليم الكل كمقروء"}
                        </button>
                    )}
                </div>

                {/* List */}
                <div className={styles.notifList}>
                    {notifications?.length === 0 ? (
                        <div className={styles.centerContainer}>لا توجد إشعارات حاليًا.</div>
                    ) : (
                        notifications?.map((notif) => {
                            const { emoji, cls } = getIconForType(notif.type);
                            return (
                                <div key={notif.id} className={styles.notifItem}>
                                    <div className={`${styles.notifIconWrap} ${cls}`}>{emoji}</div>
                                    <div className={styles.notifContent}>
                                        <div className={styles.notifBodyTitle}>{notif.title}</div>
                                        <div className={styles.notifTime}>{notif.timeAgo}</div>
                                    </div>
                                    {!notif.isRead && <div className={styles.notifUnreadDot} />}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className={styles.settingsCard}>
                <div className={styles.headerRow}>
                    <div className={styles.headerTitle}>إعدادات الإشعارات ⚙️</div>
                </div>

                <div className={styles.settingItem}>
                    <div className={styles.settingLabelGroup}>
                        <div className={styles.settingTitle}>تذاكر الدعم العاجلة</div>
                        <div className={styles.settingDesc}>إشعار فوري عند وجود تذاكر لم يتم الرد عليها</div>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={settings.urgentTickets}
                            onChange={() => toggleSetting('urgentTickets')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.settingItem}>
                    <div className={styles.settingLabelGroup}>
                        <div className={styles.settingTitle}>طلبات الشركاء الجدد</div>
                        <div className={styles.settingDesc}>إشعار عند تسجيل شريك جديد للمراجعة</div>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={settings.newPartners}
                            onChange={() => toggleSetting('newPartners')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.settingItem}>
                    <div className={styles.settingLabelGroup}>
                        <div className={styles.settingTitle}>تقارير يومية</div>
                        <div className={styles.settingDesc}>ملخص الأداء اليومي (مبيعات، شكاوى، تقييم)</div>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={settings.dailyReports}
                            onChange={() => toggleSetting('dailyReports')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

            </div>
        </div>
    );
}
