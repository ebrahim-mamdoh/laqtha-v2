'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { PartnerState } from '@/types';
import styles from './PartnerSidebar.module.css';

/* ============================================================================
   Navigation Configuration
   ============================================================================ */

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  visibleStates?: PartnerState[]; // If undefined, always visible
}

const partnerNavItems: NavItem[] = [
  {
    href: '/partner/dashboard',
    label: 'لوحة التحكم',
    icon: <DashboardIcon />,
    visibleStates: ['approved'],
  },
  {
    href: '/partner/items',
    label: 'عناصر الخدمة',
    icon: <ItemsIcon />,
    visibleStates: ['approved'],
  },
  {
    href: '/partner/profile',
    label: 'الملف الشخصي',
    icon: <ProfileIcon />,
    // Always visible
  },
  {
    href: '/partner/status',
    label: 'حالة الطلب',
    icon: <StatusIcon />,
    visibleStates: ['pending_otp', 'pending_approval', 'changes_required', 'rejected', 'suspended'],
  },
  {
    href: '/partner/settings',
    label: 'الإعدادات',
    icon: <SettingsIcon />,
    // Always visible
  },
];

/* ============================================================================
   Partner Sidebar Component
   ============================================================================ */

export function PartnerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { partner, partnerLogout } = useAuth();

  const partnerState = partner?.state || 'pending_approval';
  
  const isActive = (href: string) => pathname?.startsWith(href);

  // Filter navigation items based on partner state
  const visibleNavItems = partnerNavItems.filter((item) => {
    if (!item.visibleStates) return true;
    return item.visibleStates.includes(partnerState as PartnerState);
  });

  return (
    <aside className={[styles.sidebar, isCollapsed && styles.collapsed].filter(Boolean).join(' ')}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/partner/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>🏪</span>
          {!isCollapsed && <span className={styles.logoText}>بوابة الشريك</span>}
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

      {/* Partner Status Badge */}
      {partner && !isCollapsed && (
        <div className={styles.statusBadge}>
          <PartnerStateBadge state={partnerState as PartnerState} />
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {visibleNavItems.map((item) => (
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
      </nav>

      {/* Partner Info & Logout */}
      <div className={styles.footer}>
        {partner && !isCollapsed && (
          <div className={styles.partnerInfo}>
            <div className={styles.partnerLogo}>
              {partner.businessName?.charAt(0) || 'P'}
            </div>
            <div className={styles.partnerDetails}>
              <p className={styles.partnerName}>{partner.businessName}</p>
              <p className={styles.partnerType}>{partner.serviceType?.label || 'شريك'}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          className={styles.logoutButton}
          onClick={partnerLogout}
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
   Partner State Badge Component
   ============================================================================ */

interface PartnerStateBadgeProps {
  state: PartnerState;
}

function PartnerStateBadge({ state }: PartnerStateBadgeProps) {
  const stateConfig: Record<PartnerState, { label: string; className: string }> = {
    pending_otp: { label: 'بانتظار التحقق', className: styles.stateWarning },
    pending_approval: { label: 'قيد المراجعة', className: styles.stateWarning },
    changes_required: { label: 'يتطلب تعديلات', className: styles.stateInfo },
    rejected: { label: 'مرفوض', className: styles.stateDanger },
    approved: { label: 'معتمد', className: styles.stateSuccess },
    suspended: { label: 'موقوف', className: styles.stateDanger },
  };

  const config = stateConfig[state];

  return (
    <span className={[styles.badge, config.className].join(' ')}>
      {config.label}
    </span>
  );
}

/* ============================================================================
   Partner Layout Component
   ============================================================================ */

interface PartnerLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function PartnerLayout({ children, title, actions }: PartnerLayoutProps) {
  return (
    <div className={styles.layout}>
      <PartnerSidebar />
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

function ItemsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
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

function StatusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
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

export default PartnerSidebar;
