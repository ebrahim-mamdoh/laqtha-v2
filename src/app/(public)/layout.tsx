'use client';

import { PublicHeader } from '@/layouts/PublicHeader/PublicHeader';
import styles from './layout.module.css';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <PublicHeader />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>لقطة</h3>
            <p className={styles.footerDescription}>
              منصة لاكتشاف أفضل الخدمات في المملكة العربية السعودية
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerSectionTitle}>روابط سريعة</h4>
            <nav className={styles.footerNav}>
              <a href="/services">الخدمات</a>
              <a href="/about">عن لقطة</a>
              <a href="/contact">تواصل معنا</a>
            </nav>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerSectionTitle}>للشركاء</h4>
            <nav className={styles.footerNav}>
              <a href="/partner/register">انضم كشريك</a>
              <a href="/partner/login">دخول الشركاء</a>
            </nav>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerSectionTitle}>تواصل معنا</h4>
            <nav className={styles.footerNav}>
              <a href="mailto:support@laqtha.sa">support@laqtha.sa</a>
              <a href="tel:+966500000000">+966 50 000 0000</a>
            </nav>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} لقطة. جميع الحقوق محفوظة.</p>
          <nav className={styles.footerBottomNav}>
            <a href="/terms">الشروط والأحكام</a>
            <a href="/privacy">سياسة الخصوصية</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
