'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './AdminSidebar.module.css';

/* ============================================================================
   Navigation Configuration
   ============================================================================ */

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const adminNavigation: NavSection[] = [
  {
    title: 'الرئيسية',
    items: [
      { href: '/admin/dashboard', label: 'لوحة التحكم', icon: <DashboardIcon /> },
    ],
  },
  {
    title: 'إدارة النظام',
    items: [
      { href: '/admin/service-types', label: 'أنواع الخدمات', icon: <ServiceTypesIcon /> },
      { href: '/admin/partners', label: 'الشركاء', icon: <PartnersIcon /> },
      { href: '/admin/service-items', label: 'العناصر', icon: <ItemsIcon /> },
    ],
  },
  {
    title: 'إدارة المستخدمين',
    items: [
      { href: '/admin/users', label: 'المستخدمين', icon: <UsersIcon /> },
      { href: '/admin/profile', label: 'الملف الشخصي', icon: <ProfileIcon /> },
    ],
  },
];

/* ============================================================================
   Admin Sidebar Component
   ============================================================================ */

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <aside className={[styles.sidebar, isCollapsed && styles.collapsed].filter(Boolean).join(' ')}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>📊</span>
          {!isCollapsed && <span className={styles.logoText}>لوحة الإدارة</span>}
        </Link>
        <button
          type="button"
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'توسيع' : 'طي'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {adminNavigation.map((section) => (
          <div key={section.title} className={styles.section}>
            {!isCollapsed && (
              <h3 className={styles.sectionTitle}>{section.title}</h3>
            )}
            <ul className={styles.navList}>
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      styles.navLink,
                      isActive(item.href) && styles.navLinkActive,
                    ].filter(Boolean).join(' ')}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className={styles.footer}>
        {user && !isCollapsed && (
          <div className={styles.userInfo}>
            <span className={styles.userAvatar}>
              {user.name?.charAt(0) || 'A'}
            </span>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userRole}>مدير النظام</p>
            </div>
          </div>
        )}
        <button
          type="button"
          className={styles.logoutButton}
          onClick={logout}
          title={isCollapsed ? 'تسجيل الخروج' : undefined}
        >
          <LogoutIcon />
          {!isCollapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}

/* ============================================================================
   Admin Layout Component
   ============================================================================ */

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, actions }: AdminLayoutProps) {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        {(title || actions) && (
          <header className={styles.pageHeader}>
            {title && <h1 className={styles.pageTitle}>{title}</h1>}
            {actions && <div className={styles.pageActions}>{actions}</div>}
          </header>
        )}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

/* ============================================================================
   Icons
   ============================================================================ */

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function ServiceTypesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function PartnersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ItemsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default AdminSidebar;
