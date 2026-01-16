"use client";

import React, { useState } from "react";
import styles from "./NotificationPopup.module.css";

// Mock Data
const NOTIFICATIONS_DATA = [
    {
        id: 1,
        title: 'تم قبول الفزعة من طرف "حمزة.د"',
        description: "يسعدنا انضمامك الى عائلة لقطها يمكنك استكشاف كل ميزاتنا الان بالمجان",
        isRead: false,
        timestamp: "2 mins ago",
    },
    {
        id: 2,
        title: "مرحبا محمد",
        description: "يسعدنا انضمامك الى عائلة لقطها يمكنك استكشاف كل ميزاتنا الان بالمجان",
        isRead: true,
        timestamp: "1 hour ago",
    },
];

export default function NotificationPopup({ onClose }) {
    const [activeTab, setActiveTab] = useState("all");
    const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

    // Filter logic
    const filteredNotifications = notifications.filter((notif) => {
        if (activeTab === "unread") return !notif.isRead;
        if (activeTab === "read") return notif.isRead;
        return true; // 'all'
    });

    // Counts   
    const allCount = notifications.length;
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const readCount = notifications.filter((n) => n.isRead).length;

    const handleDelete = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <div className={styles.popupContainer}>
            <div className={styles.header}>
                <div className={styles.title}>الاشعارات</div>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === "all" ? styles.active : ""}`}
                        onClick={() => setActiveTab("all")}
                    >
                        الكل
                        <span className={styles.badge}>{allCount}</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "unread" ? styles.active : ""}`}
                        onClick={() => setActiveTab("unread")}
                    >
                        غير المرئية
                        <span className={styles.badge}>{unreadCount}</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "read" ? styles.active : ""}`}
                        onClick={() => setActiveTab("read")}
                    >
                        المرئية
                        <span className={styles.badge}>{readCount}</span>
                    </button>
                </div>
            </div>

            <div className={styles.notificationList}>
                {filteredNotifications.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>
                        لا توجد اشعارات
                    </div>
                )}
                {filteredNotifications.map((notif) => (
                    <div key={notif.id} className={styles.card}>
                        {/* Delete/Actions (Left in LTR, but RTL is set on container) 
                Since direction is RTL:
                First element is Right side visually? No.
                Standard CSS: First element in DOM is first in flow.
                RTL: First element is on the Right.
                
                Looking at image:
                Right side: "Laqtha" + Icon.
                Middle: Text.
                Left side: Trash can.

                So in RTL DOM:
                1. Rightmost element (Brand + Icon)
                2. Middle (Text)
                3. Leftmost element (Trash)
            */}

                        {/* 1. Brand & Icon (Right) */}
                        <div className={styles.iconSection}>
                            <div className={styles.iconWrapper}>
                                {/* Chat Icon SVG */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                                        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 9H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 13H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className={styles.brandName}>لقطها</span>
                        </div>

                        {/* 2. Text Content (Middle) */}
                        <div className={styles.content}>
                            <div className={styles.cardTitle}>{notif.title}</div>
                            <div className={styles.cardBody}>{notif.description}</div>
                        </div>

                        {/* 3. Delete Action (Left) */}
                        <div className={styles.actions} onClick={() => handleDelete(notif.id)}>
                            {/* Trash Icon SVG */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
