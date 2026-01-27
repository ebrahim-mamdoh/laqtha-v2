'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/layouts/AdminSidebar/AdminSidebar';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { StatsCard } from '@/components/ui/StatsCard/StatsCard';
import { useAdminPartners, usePartnersStats } from '@/hooks/useAdmin';
import { PARTNER_STATE_CONFIG, PartnerState } from '@/types';
import styles from './page.module.css';

export default function AdminPartnersPage() {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<PartnerState | 'all'>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: partnersData, isLoading, error } = useAdminPartners({
    page,
    limit,
    search: search || undefined,
    state: stateFilter !== 'all' ? stateFilter : undefined,
  });

  const { data: stats, isLoading: statsLoading } = usePartnersStats();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const partnerStates: (PartnerState | 'all')[] = [
    'all',
    'pending_review',
    'approved',
    'changes_requested',
    'rejected',
    'suspended',
  ];

  return (
    <AdminLayout>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>إدارة الشركاء</h1>
            <p>مراجعة طلبات الشركاء والموافقة عليها</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {statsLoading ? (
            <>
              <div className={styles.statsSkeleton} />
              <div className={styles.statsSkeleton} />
              <div className={styles.statsSkeleton} />
              <div className={styles.statsSkeleton} />
            </>
          ) : (
            <>
              <StatsCard
                title="إجمالي الشركاء"
                value={stats?.total || 0}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                }
              />
              <StatsCard
                title="بانتظار المراجعة"
                value={stats?.pendingReview || 0}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
                className={styles.warningStat}
              />
              <StatsCard
                title="موافق عليهم"
                value={stats?.approved || 0}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
                className={styles.successStat}
              />
              <StatsCard
                title="معلقين"
                value={stats?.suspended || 0}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                }
                className={styles.dangerStat}
              />
            </>
          )}
        </div>

        {/* Filters */}
        <Card className={styles.filtersCard}>
          <form onSubmit={handleSearch} className={styles.filters}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="البحث بالاسم أو البريد الإلكتروني..."
                className={styles.searchInput}
              />
              {search && (
                <button type="button" onClick={clearSearch} className={styles.clearSearch}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value as PartnerState | 'all');
                setPage(1);
              }}
              className={styles.filterSelect}
            >
              {partnerStates.map((state) => (
                <option key={state} value={state}>
                  {state === 'all' ? 'جميع الحالات' : PARTNER_STATE_CONFIG[state]?.ar || state}
                </option>
              ))}
            </select>
          </form>
        </Card>

        {/* Partners List */}
        <Card className={styles.tableCard}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner size="lg" />
              <p>جاري تحميل الشركاء...</p>
            </div>
          ) : error ? (
            <EmptyState
              title="حدث خطأ"
              description="تعذر تحميل بيانات الشركاء"
            />
          ) : !partnersData?.data?.length ? (
            <EmptyState
              title="لا يوجد شركاء"
              description={search || stateFilter !== 'all' 
                ? 'لا توجد نتائج تطابق معايير البحث'
                : 'لم يتم تسجيل أي شريك بعد'
              }
            />
          ) : (
            <>
              <div className={styles.partnersList}>
                {partnersData.data.map((partner) => {
                  const stateConfig = PARTNER_STATE_CONFIG[partner.state];
                  return (
                    <Link 
                      key={partner.id} 
                      href={`/admin/partners/${partner.id}`}
                      className={styles.partnerCard}
                    >
                      <div className={styles.partnerAvatar}>
                        {partner.businessName?.charAt(0) || partner.name?.charAt(0) || '?'}
                      </div>
                      <div className={styles.partnerInfo}>
                        <h3 className={styles.partnerName}>
                          {partner.businessName || partner.name}
                        </h3>
                        <p className={styles.partnerEmail}>{partner.email}</p>
                        <div className={styles.partnerMeta}>
                          <span className={styles.partnerType}>
                            {partner.serviceTypeIcon} {partner.serviceTypeLabel}
                          </span>
                          <span className={styles.partnerDate}>
                            {new Date(partner.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                      <div className={styles.partnerState}>
                        <Badge
                          variant={
                            stateConfig?.color === 'green' ? 'success' :
                            stateConfig?.color === 'yellow' ? 'warning' :
                            stateConfig?.color === 'red' ? 'danger' :
                            'default'
                          }
                        >
                          {stateConfig?.icon} {stateConfig?.ar || partner.state}
                        </Badge>
                      </div>
                      <div className={styles.partnerArrow}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {partnersData.pagination && partnersData.pagination.totalPages > 1 && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    currentPage={page}
                    totalPages={partnersData.pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}

              {/* Results Info */}
              {partnersData.pagination && (
                <p className={styles.resultsInfo}>
                  عرض {((page - 1) * limit) + 1} - {Math.min(page * limit, partnersData.pagination.total)} من {partnersData.pagination.total} شريك
                </p>
              )}
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
