"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import styles from "./ChatHeader.module.css";

export default function ChatHeader({ isOpen, onToggleSidebar }) {
  const { user } = useAuth() || {};

  return (
    <header className={styles.header}>
      {/* ====== Desktop layout ====== */}
      <div className={styles.desktopHeader}>
        {/* يمين: بيانات المستخدم */}
        <div className={styles.userBox}>
          <div className={styles.avatar}>
            <Image src="/images/avatar.svg" alt="avatar" width={44} height={44} />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || "ضيف"}</div>
            <div className={styles.userBalance}>
              <span className={styles.balanceValue}>357,368 ر.س</span>
            </div>
          </div>
        </div>

        {/* يسار: الأزرار / الأيقونات */}
        <div className={styles.left}>
          <Image src="/icons/chat_svg/Color_Mode.svg" alt="الوضع الليلي" width={34} height={34} />
          <Image src="/icons/chat_svg/Bell_pin.svg" alt="الإشعارات" width={34} height={34} />
        </div>
      </div>

      {/* ====== Mobile layout ====== */}
      <div className={styles.mobileHeader}>
        {/* يمين: زر القائمة */}
        <button
          className={styles.toggleBtn}
          onClick={onToggleSidebar}
          aria-label="فتح القائمة"
        >
          ☰
        </button>

        {/* المنتصف: صورة واسم المستخدم */}
        <div className={styles.mobileUser}>
          <div className={styles.avatar}>
            <Image src="/images/avatar.svg" alt="avatar" width={40} height={40} />
          </div>
          <div className={styles.userName}>{user?.name || "ضيف"}</div>
        </div>

        {/* اليسار: أيقونة الجرس */}
        <button className={styles.bellBtn}>
          <Image src="/icons/chat_svg/Bell_pin.svg" alt="الإشعارات" width={28} height={28} />
        </button>
      </div>

      
    </header>
  );
}
