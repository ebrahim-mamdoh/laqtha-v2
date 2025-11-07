"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useSettingsLayout from "./useSettingsLayout";
import styles from "./setLayout.module.css";

export default function SettingsLayoutClient({ children }) {
  const {
    pathname,
    currentTabLabel,
    mobileOpen,
    openMenu,
    closeMenu,
    navigateToRoot,
    sidebarItems,
  } = useSettingsLayout();

  const isSubRoute = pathname !== "/settings";

  return (
    <div className={`container-fluid ${styles.settingsWrapper}`} dir="rtl">
      <div className="row g-3">

        {/* ===== Desktop Sidebar ===== */}
        <aside className={`col-md-3 ${styles.sidebar} d-none d-md-block`}>
          <nav className={styles.navList}>
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.navItem} ${
                  pathname.startsWith(item.href) ? styles.active : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* ===== Mobile Header ===== */}
        <div className="d-md-none col-12">
          <div className={styles.mobileHeaderRow}>
            <button className={styles.mobileMenuBtn} onClick={openMenu}>
              ☰ الأقسام
            </button>
            <div className={styles.mobileTitle}>الإعدادات</div>
          </div>
        </div>

        {/* ===== Content Area ===== */}
        <main className="col-12 col-md-9">
          {isSubRoute && (
            <div className={`${styles.mobileSubHeader} d-md-none`}>
              <button className={styles.backBtn} onClick={navigateToRoot}>
                ← الرجوع
              </button>
              <div className={styles.subTitle}>{currentTabLabel}</div>
            </div>
          )}

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
        </main>
      </div>

      {/* ===== Mobile Drawer ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.mobileDrawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className={styles.mobileDrawerHeader}>
                <button className={styles.closeBtn} onClick={closeMenu}>
                  ✕
                </button>
                <h6>أقسام الإعدادات</h6>
              </div>

              <nav className={styles.mobileNavList}>
                {sidebarItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={styles.mobileNavItem}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
