'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePartnerStats, usePartnerItems } from '@/hooks';
import { PartnerLayout } from '@/layouts';
import { Card, Badge, Spinner, Skeleton } from '@/components/ui';
import { StatsCard } from '@/components/ui/Card/Card';
import { StateBadge } from '@/components/ui/Badge/Badge';
import { EmptyItems } from '@/components/ui/EmptyState/EmptyState';
import styles from './page.module.css';

// ============================================================================
// Stats Section
// ============================================================================

interface DashboardStatsProps {
  isLoading: boolean;
  stats: {
    totalItems: number;
    activeItems: number;
    inactiveItems: number;
    pendingItems: number;
    totalViews: number;
    totalBookings: number;
  } | null;
}

function DashboardStats({ isLoading, stats }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="stats" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={styles.statsGrid}>
      <StatsCard
        title="إجمالي العناصر"
        value={stats.totalItems}
        icon={
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        }
        trend={stats.totalItems > 0 ? { value: 0, isPositive: true } : undefined}
      />
      <StatsCard
        title="عناصر نشطة"
        value={stats.activeItems}
        icon={
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        }
        className={styles.successStat}
      />
      <StatsCard
        title="غير نشطة"
        value={stats.inactiveItems}
        icon={
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
          </svg>
        }
        className={styles.warningStat}
      />
      <StatsCard
        title="قيد المراجعة"
        value={stats.pendingItems}
        icon={
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
        }
        className={styles.infoStat}
      />
    </div>
  );
}

// ============================================================================
// Quick Actions
// ============================================================================

function QuickActions() {
  return (
    <Card variant="bordered" className={styles.quickActionsCard}>
      <h2>إجراءات سريعة</h2>
      <div className={styles.quickActionsGrid}>
        <Link href="/partner/items/new" className={styles.quickAction}>
          <div className={styles.quickActionIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
          <span>إضافة عنصر جديد</span>
        </Link>
        <Link href="/partner/items" className={styles.quickAction}>
          <div className={styles.quickActionIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <span>عرض جميع العناصر</span>
        </Link>
        <Link href="/partner/profile" className={styles.quickAction}>
          <div className={styles.quickActionIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span>تعديل الملف الشخصي</span>
        </Link>
        <Link href="/partner/settings" className={styles.quickAction}>
          <div className={styles.quickActionIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </div>
          <span>الإعدادات</span>
        </Link>
      </div>
    </Card>
  );
}

// ============================================================================
// Recent Items Section
// ============================================================================

interface RecentItemsProps {
  isLoading: boolean;
  items: Array<{
    _id: string;
    name: string;
    state: string;
    createdAt: string;
    price?: { amount: number; currency: string };
  }> | undefined;
}

function RecentItems({ isLoading, items }: RecentItemsProps) {
  if (isLoading) {
    return (
      <Card variant="bordered" className={styles.recentItemsCard}>
        <div className={styles.cardHeader}>
          <h2>أحدث العناصر</h2>
        </div>
        <div className={styles.itemsList}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="list" count={1} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="bordered" className={styles.recentItemsCard}>
      <div className={styles.cardHeader}>
        <h2>أحدث العناصر</h2>
        <Link href="/partner/items" className={styles.viewAllLink}>
          عرض الكل
        </Link>
      </div>

      {!items || items.length === 0 ? (
        <EmptyItems
          action={{
            label: 'إضافة عنصر جديد',
            onClick: () => {},
            href: '/partner/items/new',
          }}
        />
      ) : (
        <div className={styles.itemsList}>
          {items.slice(0, 5).map((item) => (
            <Link
              key={item._id}
              href={`/partner/items/${item._id}`}
              className={styles.itemRow}
            >
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemDate}>
                  {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <div className={styles.itemMeta}>
                {item.price && (
                  <span className={styles.itemPrice}>
                    {item.price.amount} {item.price.currency}
                  </span>
                )}
                <StateBadge state={item.state as 'active' | 'inactive' | 'pending'} type="item" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Activity Feed
// ============================================================================

interface Activity {
  id: string;
  type: 'item_created' | 'item_approved' | 'item_rejected' | 'profile_updated' | 'booking_received';
  message: string;
  timestamp: string;
}

function ActivityFeed() {
  // Mock activities - in a real app, this would come from an API
  const activities: Activity[] = [
    {
      id: '1',
      type: 'item_approved',
      message: 'تمت الموافقة على عنصر "غرفة ديلوكس"',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'booking_received',
      message: 'تلقيت حجز جديد لـ "جناح عائلي"',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'item_created',
      message: 'تم إنشاء عنصر جديد "غرفة اقتصادية"',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'item_created':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        );
      case 'item_approved':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        );
      case 'item_rejected':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        );
      case 'profile_updated':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        );
      case 'booking_received':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'item_approved':
        return styles.activitySuccess;
      case 'item_rejected':
        return styles.activityDanger;
      case 'booking_received':
        return styles.activityPrimary;
      default:
        return styles.activityDefault;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `منذ ${minutes} دقيقة`;
    } else if (hours < 24) {
      return `منذ ${hours} ساعة`;
    } else {
      return `منذ ${days} يوم`;
    }
  };

  return (
    <Card variant="bordered" className={styles.activityCard}>
      <div className={styles.cardHeader}>
        <h2>النشاط الأخير</h2>
      </div>

      <div className={styles.activityList}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={`${styles.activityIcon} ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityMessage}>{activity.message}</p>
              <span className={styles.activityTime}>
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function PartnerDashboardPage() {
  const { partner, isPartnerLoading } = useAuth();
  
  // Fetch dashboard data
  const { data: statsData, isLoading: isLoadingStats } = usePartnerStats();
  const { data: itemsData, isLoading: isLoadingItems } = usePartnerItems({ page: 1, limit: 5 });

  // Loading state
  if (isPartnerLoading) {
    return (
      <PartnerLayout>
        <div className={styles.loadingContainer}>
          <Spinner size="lg" />
          <p>جاري التحميل...</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className={styles.dashboardPage}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeText}>
            <h1>مرحباً، {partner?.businessName}</h1>
            <p>إليك نظرة عامة على نشاطك التجاري</p>
          </div>
          <Link href="/partner/items/new">
            <button className={styles.addButton}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              إضافة عنصر جديد
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <DashboardStats 
          isLoading={isLoadingStats} 
          stats={statsData?.data || null} 
        />

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <RecentItems 
              isLoading={isLoadingItems} 
              items={itemsData?.data?.items} 
            />
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <QuickActions />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
