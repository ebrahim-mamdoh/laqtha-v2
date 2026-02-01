// sidebar.jsx
"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchByRoute } from "@/lib/prefetchHelpers";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { href: "/chat", label: "الدردشة", icon: "/icons/Out.svg" },
  { href: "/wallet", label: "المحفظة", icon: "/icons/Wallet_alt.svg" },
  { href: "/bills", label: "الفواتير", icon: "/icons/Form.svg" },
  { href: "/advance", label: "فزعة", icon: "/icons/Fire.svg" },
  { href: "/settings", label: "الإعدادات", icon: "/icons/Setting_alt_line.svg" },
];

export default function Sidebar({ isOpen = true, onToggle, onLogout }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth(); // ✅ استدعاء user من الكونتكست
  const queryClient = useQueryClient(); // ✅ Get query client for prefetching

  // ✅ Prefetch handler with useCallback for performance
  const handlePrefetch = useCallback((href) => {
    const prefetchFn = prefetchByRoute[href];
    if (prefetchFn) {
      prefetchFn(queryClient);
    }
  }, [queryClient]);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (typeof onLogout === "function") {
      onLogout();
    } else if (typeof logout === "function") {
      logout();
      router.push("/login");
    } else {
      router.push("/login");
    }
  };

  const isActiveFor = (href) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      aria-expanded={isOpen}
    >
      {/* top: logo + toggle */}
      <div className={styles.topWrap}>
        <div className={styles.logo}>
          {isOpen ? (
            <Image
              src="/images/logo.png"
              alt="لقطها"
              width={120}
              height={36}
              className={styles.logoImg}
            />
          ) : (
            <Image
              src="/icons/Book.svg"
              alt="لقطها"
              width={36}
              height={36}
              className={styles.logoIcon}
            />
          )}
        </div>

        <button
          type="button"
          className={`${styles.toggleBtn} ${isOpen ? styles.toggleOpen : ""}`}
          onClick={onToggle}
          aria-label={isOpen ? "إغلاق الشريط الجانبي" : "فتح الشريط الجانبي"}
          aria-expanded={isOpen}
        >
          {isOpen ? "‹" : "›"}
        </button>
      </div>

      {/* center: nav items */}
      <nav className={styles.nav}>
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map((item) => {
            const active = isActiveFor(item.href);
            return (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.active : ""}`}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => handlePrefetch(item.href)} // ✅ Prefetch on hover
                >
                  <span className={styles.iconWrapper}>
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={22}
                      height={22}
                      className={`${styles.icon} ${active ? styles.iconActive : ""}`}
                    />
                  </span>
                  <span className={styles.label}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* bottom: support / profile / logout */}
      <div className={styles.bottom}>
        {isOpen ? (
          <>
            {/* Support Button */}
            <Link href="/privacy" className={styles.SupportLink}>
              <img src="/icons/Chield_check.svg" alt="الدعم الفني" width={20} height={20} />
              <span className={styles.text}>سياسة الخصوصية</span>
            </Link>
             <Link href="/terms" className={styles.SupportLink}>
              <img src="/icons/User_alt.svg" alt="الدعم الفني" width={20} height={20} />
              <span className={styles.text}> شروط الاستخدام</span>
            </Link>
             <Link href="/questions" className={styles.SupportLink}>
              <img src="/icons/Chat.svg" alt="الدعم الفني" width={20} height={20} />
              <span className={styles.text}> الأسئلة الشائعة</span>
            </Link>
             <Link href="/partner/register" className={styles.SupportLink}>
              <img src="/icons/Chat.svg" alt="الدعم الفني" width={20} height={20} />
              <span className={styles.text}>انضمام كشريك</span>
            </Link>
            <Link href="mailto:ebrahimmadoh3@gmail.com" className={styles.SupportLink}>
              <img src="/icons/chat_svg/Headphones_fill.svg" alt="الدعم الفني" width={20} height={20} />
              <span className={styles.text}> الدعم الفني</span>
            </Link>
          
            {/* Profile Card */}
            <div className={styles.profileCard}>
              <div className={styles.info}>
                <div className={styles.avatar}>
                  <Image
                    src="/images/avatar.svg"
                    alt="avatar"
                    width={44}
                    height={44}
                  />
                </div>

                <div className={styles.profileText}>
                  <div className={styles.profileName}>
                    {user?.name ? user.name.slice(0, 7) : "مستخدم"}
                  </div>
                </div>
                <img src="/icons/chat_svg/Group.SVG" alt="خروج" width={18} height={18} />

              </div>

              {/* add account  Button */}
              <button
                type="button"
                className={styles.addAccountBtn}
                onClick={() => router.push("/register")}
              >
                <Image src="/icons/chat_svg/User_add.svg" alt="إضافة حساب" width={18} height={18} />
                <span>إضافة حساب</span>
              </button>


              {/* Logout Button */}
              <button
                type="button"
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                <img src="/icons/Out.svg" alt="خروج" width={18} height={18} />
                <span>تسجيل الخروج</span>
              </button>
            </div>



          </>
        ) : (
          <>
            {/* Closed: only avatar */}
            <div className={styles.avatar}>
              <Image
                src="/images/avatar.svg"
                alt="avatar"
                width={44}
                height={44}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
