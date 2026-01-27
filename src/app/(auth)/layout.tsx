// ============================================================================
// Auth Layout
// Shared layout for authentication pages
// ============================================================================

import Link from 'next/link';
import styles from './layout.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {/* Brand Header */}
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>لقطة</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className={styles.main}>{children}</main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} لقطة. جميع الحقوق محفوظة.
          </p>
          <nav className={styles.footerNav}>
            <Link href="/terms">الشروط والأحكام</Link>
            <Link href="/privacy">سياسة الخصوصية</Link>
          </nav>
        </footer>
      </div>

      {/* Decorative Background */}
      <div className={styles.background}>
        <div className={styles.gradient} />
        <div className={styles.pattern} />
      </div>
    </div>
  );
}

export const metadata = {
  title: {
    template: '%s - لقطة',
    default: 'تسجيل الدخول - لقطة',
  },
};
