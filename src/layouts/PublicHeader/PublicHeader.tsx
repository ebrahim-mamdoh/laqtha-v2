'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './PublicHeader.module.css';

/* ============================================================================
   Navigation Items
   ============================================================================ */

const publicNavItems = [
  { href: '/', label: 'الرئيسية' },
  { href: '/services', label: 'الخدمات' },
  { href: '/about', label: 'عن لقطة' },
  { href: '/contact', label: 'تواصل معنا' },
];

const customerNavItems = [
  { href: '/customer/favorites', label: 'المفضلة' },
  { href: '/customer/history', label: 'سجل التصفح' },
];

/* ============================================================================
   Public Header Component
   ============================================================================ */

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>لقطة</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {publicNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    styles.navLink,
                    isActive(item.href) && styles.navLinkActive,
                  ].filter(Boolean).join(' ')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {isAuthenticated && user ? (
            <>
              {/* Customer Quick Links */}
              <div className={styles.customerLinks}>
                {customerNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.customerLink}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* User Menu */}
              <UserMenu user={user} onLogout={logout} />
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginButton}>
                تسجيل الدخول
              </Link>
              <Link href="/register" className={styles.registerButton}>
                إنشاء حساب
              </Link>
              <Link href="/partner/login" className={styles.partnerLink}>
                شريك؟
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="فتح القائمة"
          >
            <span className={styles.hamburger} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <MobileMenu
          isAuthenticated={isAuthenticated}
          user={user}
          onClose={closeMobileMenu}
          onLogout={logout}
        />
      )}
    </header>
  );
}

/* ============================================================================
   User Menu Component
   ============================================================================ */

interface UserMenuProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.userMenu}>
      <button
        type="button"
        className={styles.userMenuTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.userAvatar}>
          {user.name.charAt(0)}
        </span>
        <span className={styles.userName}>{user.name}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className={styles.userMenuDropdown}>
          <div className={styles.userMenuHeader}>
            <p className={styles.userMenuName}>{user.name}</p>
            <p className={styles.userMenuEmail}>{user.email}</p>
          </div>
          <div className={styles.userMenuDivider} />
          <Link href="/customer/profile" className={styles.userMenuItem}>
            الملف الشخصي
          </Link>
          <Link href="/customer/settings" className={styles.userMenuItem}>
            الإعدادات
          </Link>
          <div className={styles.userMenuDivider} />
          <button
            type="button"
            className={styles.userMenuLogout}
            onClick={onLogout}
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   Mobile Menu Component
   ============================================================================ */

interface MobileMenuProps {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  onClose: () => void;
  onLogout: () => void;
}

function MobileMenu({ isAuthenticated, user, onClose, onLogout }: MobileMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      <div className={styles.mobileMenuOverlay} onClick={onClose} />
      <nav className={styles.mobileMenu}>
        <div className={styles.mobileMenuHeader}>
          <span className={styles.mobileMenuTitle}>القائمة</span>
          <button
            type="button"
            className={styles.mobileMenuClose}
            onClick={onClose}
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>
        </div>

        <ul className={styles.mobileNavList}>
          {publicNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  styles.mobileNavLink,
                  isActive(item.href) && styles.mobileNavLinkActive,
                ].filter(Boolean).join(' ')}
                onClick={onClose}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {isAuthenticated && user ? (
          <>
            <div className={styles.mobileMenuDivider} />
            <ul className={styles.mobileNavList}>
              {customerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/customer/profile"
                  className={styles.mobileNavLink}
                  onClick={onClose}
                >
                  الملف الشخصي
                </Link>
              </li>
            </ul>
            <div className={styles.mobileMenuDivider} />
            <button
              type="button"
              className={styles.mobileLogoutButton}
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              تسجيل الخروج
            </button>
          </>
        ) : (
          <>
            <div className={styles.mobileMenuDivider} />
            <div className={styles.mobileAuthButtons}>
              <Link
                href="/login"
                className={styles.mobileLoginButton}
                onClick={onClose}
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className={styles.mobileRegisterButton}
                onClick={onClose}
              >
                إنشاء حساب
              </Link>
            </div>
            <Link
              href="/partner/login"
              className={styles.mobilePartnerLink}
              onClick={onClose}
            >
              هل أنت شريك؟ سجل دخولك هنا
            </Link>
          </>
        )}
      </nav>
    </>
  );
}

/* ============================================================================
   Icons
   ============================================================================ */

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default PublicHeader;
