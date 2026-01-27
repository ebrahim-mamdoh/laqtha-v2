'use client';

import React from 'react';
import Link from 'next/link';
import { 
  useServiceTypesStats, 
  usePartnersStats, 
  useAdminItemsStats,
  useAdminPartners,
  useServiceTypes
} from '@/hooks';
import { AdminLayout } from '@/layouts';
import { Card, Spinner, Skeleton, Badge } from '@/components/ui';
import { StatsCard } from '@/components/ui/Card/Card';
import { StateBadge } from '@/components/ui/Badge/Badge';
import styles from './page.module.css';

// ============================================================================
// Stats Overview Section
// ============================================================================

function StatsOverview() {
  const { data: serviceTypesStats, isLoading: loadingST } = useServiceTypesStats();
  const { data: partnersStats, isLoading: loadingP } = usePartnersStats();
  const { data: itemsStats, isLoading: loadingI } = useAdminItemsStats();

  const isLoading = loadingST || loadingP || loadingI;

  if (isLoading) {
    return (
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} variant="stats" />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.statsGrid}>
      {/* Service Types Stats */}
      <StatsCard
        title="أنواع الخدمات"
        value={serviceTypesStats?.total ?? 0}
        icon={<ServiceTypesIcon />}
        trend={{ value: serviceTypesStats?.active ?? 0, label: 'نشط' }}
        className={styles.primaryStat}
      />

      {/* Partners Stats */}
      <StatsCard
        title="إجمالي الشركاء"
        value={partnersStats?.total ?? 0}
        icon={<PartnersIcon />}
      />
      <StatsCard
        title="شركاء معتمدين"
        value={partnersStats?.approved ?? 0}
        icon={<ApprovedIcon />}
        className={styles.successStat}
      />
      <StatsCard
        title="بانتظار الموافقة"
        value={partnersStats?.pending ?? 0}
        icon={<PendingIcon />}
        className={styles.warningStat}
      />

      {/* Items Stats */}
      <StatsCard
        title="إجمالي العناصر"
        value={itemsStats?.total ?? 0}
        icon={<ItemsIcon />}
      />
      <StatsCard
        title="عناصر نشطة"
        value={itemsStats?.active ?? 0}
        icon={<ActiveItemIcon />}
        className={styles.successStat}
      />
    </div>
  );
}

// ============================================================================
// Quick Actions Section
// ============================================================================

function QuickActions() {
  return (
    <Card variant="bordered" className={styles.quickActionsCard}>
      <h2>إجراءات سريعة</h2>
      <div className={styles.quickActionsGrid}>
        <Link href="/admin/service-types/new" className={styles.quickAction}>
          <div className={styles.quickActionIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
          <span>إضافة نوع خدمة</span>
        </Link>
        <Link href="/admin/partners?state=pending_approval" className={styles.quickAction}>
          <div className={styles.quickActionIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <span>مراجعة الشركاء</span>
        </Link>
        <Link href="/admin/service-items" className={styles.quickAction}>
          <div className={styles.quickActionIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <span>إدارة العناصر</span>
        </Link>
        <Link href="/admin/users" className={styles.quickAction}>
          <div className={styles.quickActionIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <span>إدارة المستخدمين</span>
        </Link>
      </div>
    </Card>
  );
}

// ============================================================================
// Recent Partners Section
// ============================================================================

function RecentPartners() {
  const { data: partnersData, isLoading } = useAdminPartners({
    page: 1,
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  if (isLoading) {
    return (
      <Card variant="bordered" className={styles.recentCard}>
        <div className={styles.cardHeader}>
          <h2>أحدث الشركاء</h2>
        </div>
        <Skeleton variant="list" count={5} />
      </Card>
    );
  }

  const partners = partnersData?.data?.partners ?? [];

  return (
    <Card variant="bordered" className={styles.recentCard}>
      <div className={styles.cardHeader}>
        <h2>أحدث الشركاء</h2>
        <Link href="/admin/partners" className={styles.viewAllLink}>
          عرض الكل
        </Link>
      </div>

      {partners.length === 0 ? (
        <p className={styles.emptyMessage}>لا يوجد شركاء حتى الآن</p>
      ) : (
        <div className={styles.recentList}>
          {partners.map((partner) => (
            <Link
              key={partner.id}
              href={`/admin/partners/${partner.id}`}
              className={styles.recentItem}
            >
              <div className={styles.recentItemInfo}>
                <span className={styles.recentItemName}>{partner.businessName}</span>
                <span className={styles.recentItemMeta}>
                  {partner.email} • {new Date(partner.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <StateBadge state={partner.state} type="partner" />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Service Types Overview Section
// ============================================================================

function ServiceTypesOverview() {
  const { data: serviceTypesData, isLoading } = useServiceTypes({
    page: 1,
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  if (isLoading) {
    return (
      <Card variant="bordered" className={styles.recentCard}>
        <div className={styles.cardHeader}>
          <h2>أنواع الخدمات</h2>
        </div>
        <Skeleton variant="list" count={5} />
      </Card>
    );
  }

  const serviceTypes = serviceTypesData?.data?.items ?? [];

  return (
    <Card variant="bordered" className={styles.recentCard}>
      <div className={styles.cardHeader}>
        <h2>أنواع الخدمات</h2>
        <Link href="/admin/service-types" className={styles.viewAllLink}>
          عرض الكل
        </Link>
      </div>

      {serviceTypes.length === 0 ? (
        <p className={styles.emptyMessage}>لا توجد أنواع خدمات</p>
      ) : (
        <div className={styles.recentList}>
          {serviceTypes.map((serviceType) => (
            <Link
              key={serviceType.key}
              href={`/admin/service-types/${serviceType.key}`}
              className={styles.recentItem}
            >
              <div className={styles.recentItemInfo}>
                <div className={styles.serviceTypeRow}>
                  <span className={styles.serviceTypeIcon}>{serviceType.icon}</span>
                  <span className={styles.recentItemName}>{serviceType.label.ar}</span>
                </div>
                <span className={styles.recentItemMeta}>
                  {serviceType.fieldsCount} حقل • {serviceType.itemFieldsCount} حقل عنصر
                </span>
              </div>
              <Badge variant={serviceType.isActive ? 'success' : 'secondary'} size="sm">
                {serviceType.isActive ? 'نشط' : 'غير نشط'}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Pending Approvals Section
// ============================================================================

function PendingApprovals() {
  const { data: pendingData, isLoading } = useAdminPartners({
    page: 1,
    limit: 5,
    state: 'pending_approval',
  });

  if (isLoading) {
    return (
      <Card variant="bordered" className={styles.pendingCard}>
        <div className={styles.cardHeader}>
          <h2>بانتظار الموافقة</h2>
        </div>
        <Skeleton variant="list" count={3} />
      </Card>
    );
  }

  const pending = pendingData?.data?.partners ?? [];

  return (
    <Card variant="bordered" className={styles.pendingCard}>
      <div className={styles.cardHeader}>
        <h2>بانتظار الموافقة</h2>
        {pending.length > 0 && (
          <Badge variant="warning" size="sm">{pending.length}</Badge>
        )}
      </div>

      {pending.length === 0 ? (
        <div className={styles.emptyPending}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.emptyIcon}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <p>لا توجد طلبات بانتظار الموافقة</p>
        </div>
      ) : (
        <div className={styles.pendingList}>
          {pending.map((partner) => (
            <div key={partner.id} className={styles.pendingItem}>
              <div className={styles.pendingInfo}>
                <span className={styles.pendingName}>{partner.businessName}</span>
                <span className={styles.pendingDate}>
                  {new Date(partner.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <Link href={`/admin/partners/${partner.id}`}>
                <button className={styles.reviewButton}>مراجعة</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Icon Components
// ============================================================================

function ServiceTypesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
    </svg>
  );
}

function PartnersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function ApprovedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

function ItemsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
  );
}

function ActiveItemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className={styles.dashboardPage}>
        {/* Header */}
        <div className={styles.header}>
          <h1>لوحة التحكم</h1>
          <p>مرحباً بك في لوحة إدارة لقطة</p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <PendingApprovals />
            <RecentPartners />
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <QuickActions />
            <ServiceTypesOverview />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
