// ============================================================================
// Customer Layout
// Protected layout for authenticated customer pages
// ============================================================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './layout.module.css';

// ============================================================================
// Types
// ============================================================================

interface CustomerLayoutProps {
  children: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const router = useRouter();
  const { isUserAuthenticated, isLoading, user, logout } = useAuth();

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isUserAuthenticated) {
      router.replace('/login?redirect=/profile');
    }
  }, [isUserAuthenticated, isLoading, router]);

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            لقطة
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              الرئيسية
            </Link>
            <Link href="/profile" className={styles.navLink}>
              الملف الشخصي
            </Link>
          </nav>

          <div className={styles.user}>
            <span className={styles.userName}>{user?.name || 'مستخدم'}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 لقطة - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
