"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./setLayout.module.css";

const SIDEBAR_ITEMS = [
  { id: "general", label: "الإعدادات العامة", href: "/settings/general" },
  { id: "profile", label: "الملف الشخصي", href: "/settings/profile" },
  { id: "notifications", label: "الإشعارات", href: "/settings/notifications" },
  { id: "delete", label: "حذف الحساب", href: "/settings/delete-account" },
];

export default function SettingsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname() || "/settings";
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ تحويل تلقائي عند زيارة /settings إلى /settings/general
  useEffect(() => {
    if (pathname === "/GeneralSettings") {
      router.replace("/GeneralSettings/general");
    }
  }, [pathname, router]);

  // إغلاق القائمة الجانبية عند تغيير المسار
  useEffect(() => setMobileOpen(false), [pathname]);

  const isSubRoute =
    pathname !== "/settings" && pathname.startsWith("/settings");

  return (
    <div className={`container-fluid ${styles.settingsWrapper}`} dir="rtl">
      <div className="row g-3">

        {/* الشريط الجانبي (للديسكتوب) */}
        <aside className={`col-md-3 ${styles.sidebar} d-none d-md-block`}>
          <div className={styles.sidebarInner}>
            <nav className={styles.navList}>
              {SIDEBAR_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`${styles.navItem} ${
                      active ? styles.active : ""
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* الهيدر للموبايل */}
        <div className="d-md-none col-12">
          <div className={styles.mobileHeaderRow}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMobileOpen(true)}
            >
              ☰ الأقسام
            </button>
            <div className={styles.mobileTitle}>الإعدادات</div>
          </div>
        </div>

        {/* منطقة المحتوى */}
        <main className="col-12 col-md-9">
          <div
            className={`${styles.mobileSubHeader} d-md-none ${
              isSubRoute ? "" : styles.hidden
            }`}
          >
            <button
              className={styles.backBtn}
              onClick={() => router.push("/settings")}
            >
              ← الرجوع
            </button>
            <div className={styles.subTitle}>
              {SIDEBAR_ITEMS.find((i) => pathname === i.href)?.label ||
                "الإعدادات"}
            </div>
          </div>

          {/* عرض الصفحات الفرعية داخل نفس الصفحة */}
          <div className={styles.contentWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className={styles.motionInner}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* القائمة الجانبية المتحركة للموبايل */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          transition={{ duration: 0. }}
          >
            <motion.div
              className={styles.mobileDrawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className={styles.mobileDrawerHeader}>
                <button
                  className={styles.closeBtn}
                  onClick={() => setMobileOpen(false)}
                >
                  ✕
                </button>
                <h6>أقسام الإعدادات</h6>
              </div>

              <nav className={styles.mobileNavList}>
                {SIDEBAR_ITEMS.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`${styles.mobileNavItem} ${
                        active ? styles.activeMobile : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
