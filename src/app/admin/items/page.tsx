'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/layouts/AdminSidebar/AdminSidebar';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { StatsCard } from '@/components/ui/StatsCard/StatsCard';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import {
  useAdminItems,
  useItemsStats,
  useHideItem,
  useShowItem,
  useArchiveItem,
  useAdminDeleteItem,
} from '@/hooks/useAdmin';
import { ITEM_STATE_CONFIG, ItemState } from '@/types';
import styles from './page.module.css';

export default function AdminItemsPage() {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<ItemState | 'all'>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [hideModal, setHideModal] = useState<{ id: string; name: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const [hideReason, setHideReason] = useState('');

  const { data: itemsData, isLoading, error } = useAdminItems({
    page,
    limit,
    search: search || undefined,
    state: stateFilter !== 'all' ? stateFilter : undefined,
    serviceTypeKey: serviceTypeFilter !== 'all' ? serviceTypeFilter : undefined,
  });

  const { data: stats, isLoading: statsLoading } = useItemsStats();

  const hideItem = useHideItem();
  const showItem = useShowItem();
  const archiveItem = useArchiveItem();
  const deleteItem = useAdminDeleteItem();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const handleHide = async () => {
    if (!hideModal) return;
    try {
      await hideItem.mutateAsync({ itemId: hideModal.id, data: { reason: hideReason } });
      setHideModal(null);
      setHideReason('');
    } catch (error) {
      console.error('Failed to hide item:', error);
    }
  };

  const handleShow = async (itemId: string) => {
    try {
      await showItem.mutateAsync(itemId);
      setActionMenuOpen(null);
    } catch (error) {
      console.error('Failed to show item:', error);
    }
  };

  const handleArchive = async (itemId: string) => {
    try {
      await archiveItem.mutateAsync(itemId);
      setActionMenuOpen(null);
    } catch (error) {
      console.error('Failed to archive item:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await deleteItem.mutateAsync(deleteModal.id);
      setDeleteModal(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const itemStates: (ItemState | 'all')[] = ['all', 'draft', 'active', 'inactive', 'hidden', 'archived'];

  return (
    <AdminLayout>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>إدارة الخدمات</h1>
            <p>إدارة ومراقبة جميع العناصر المسجلة في المنصة</p>
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
              <div className={styles.statsSkeleton} />
            </>
          ) : (
            <>
              <StatsCard
                title="إجمالي العناصر"
                value={stats?.total || 0}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                }
              />
              <StatsCard
                title="نشط"
                value={stats?.active || 0}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
                className={styles.successStat}
              />
              <StatsCard
                title="مسودة"
                value={stats?.draft || 0}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                }
              />
              <StatsCard
                title="مخفي"
                value={stats?.hidden || 0}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                }
                className={styles.dangerStat}
              />
              <StatsCard
                title="مؤرشف"
                value={stats?.archived || 0}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="21 8 21 21 3 21 3 8" />
                    <rect x="1" y="3" width="22" height="5" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                }
                className={styles.warningStat}
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
                placeholder="البحث بالاسم أو الشريك..."
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
                setStateFilter(e.target.value as ItemState | 'all');
                setPage(1);
              }}
              className={styles.filterSelect}
            >
              {itemStates.map((state) => (
                <option key={state} value={state}>
                  {state === 'all' ? 'جميع الحالات' : ITEM_STATE_CONFIG[state]?.ar || state}
                </option>
              ))}
            </select>
          </form>
        </Card>

        {/* Items List */}
        <Card className={styles.tableCard}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner size="lg" />
              <p>جاري تحميل العناصر...</p>
            </div>
          ) : error ? (
            <EmptyState
              title="حدث خطأ"
              description="تعذر تحميل بيانات العناصر"
            />
          ) : !itemsData?.data?.length ? (
            <EmptyState
              title="لا توجد عناصر"
              description={search || stateFilter !== 'all'
                ? 'لا توجد نتائج تطابق معايير البحث'
                : 'لم يتم إضافة أي عناصر بعد'
              }
            />
          ) : (
            <>
              <div className={styles.itemsList}>
                {itemsData.data.map((item) => {
                  const stateConfig = ITEM_STATE_CONFIG[item.state];
                  return (
                    <div key={item.id} className={styles.itemCard}>
                      <Link href={`/admin/items/${item.id}`} className={styles.itemLink}>
                        <div className={styles.itemInfo}>
                          <h3 className={styles.itemName}>{item.name.ar}</h3>
                          <p className={styles.itemPartner}>{item.partnerName}</p>
                          <div className={styles.itemMeta}>
                            <span className={styles.itemType}>
                              {item.serviceTypeKey}
                            </span>
                            <span className={styles.itemDate}>
                              {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        </div>
                        <div className={styles.itemState}>
                          <Badge
                            variant={
                              stateConfig?.color === 'green' ? 'success' :
                              stateConfig?.color === 'yellow' ? 'warning' :
                              stateConfig?.color === 'red' ? 'danger' :
                              'default'
                            }
                          >
                            {stateConfig?.icon} {stateConfig?.ar || item.state}
                          </Badge>
                        </div>
                      </Link>
                      <div className={styles.actionMenu}>
                        <button
                          className={styles.actionButton}
                          onClick={() => setActionMenuOpen(actionMenuOpen === item.id ? null : item.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </button>
                        {actionMenuOpen === item.id && (
                          <div className={styles.actionDropdown}>
                            <Link href={`/admin/items/${item.id}`}>
                              <button>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                عرض التفاصيل
                              </button>
                            </Link>
                            {item.state === 'hidden' ? (
                              <button onClick={() => handleShow(item.id)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                إظهار
                              </button>
                            ) : item.state !== 'archived' && (
                              <button onClick={() => setHideModal({ id: item.id, name: item.name.ar })}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                  <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                                إخفاء
                              </button>
                            )}
                            {item.state !== 'archived' && (
                              <button onClick={() => handleArchive(item.id)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="21 8 21 21 3 21 3 8" />
                                  <rect x="1" y="3" width="22" height="5" />
                                  <line x1="10" y1="12" x2="14" y2="12" />
                                </svg>
                                أرشفة
                              </button>
                            )}
                            <button
                              className={styles.deleteAction}
                              onClick={() => setDeleteModal({ id: item.id, name: item.name.ar })}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                              حذف
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {itemsData.pagination && itemsData.pagination.totalPages > 1 && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    currentPage={page}
                    totalPages={itemsData.pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}

              {/* Results Info */}
              {itemsData.pagination && (
                <p className={styles.resultsInfo}>
                  عرض {((page - 1) * limit) + 1} - {Math.min(page * limit, itemsData.pagination.total)} من {itemsData.pagination.total} عنصر
                </p>
              )}
            </>
          )}
        </Card>

        {/* Hide Modal */}
        {hideModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.actionModal}>
              <div className={styles.modalHeader}>
                <h3>إخفاء العنصر</h3>
                <button
                  type="button"
                  onClick={() => {
                    setHideModal(null);
                    setHideReason('');
                  }}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <p>هل أنت متأكد من إخفاء "{hideModal.name}"؟</p>
                <div className={styles.formGroup}>
                  <label>سبب الإخفاء</label>
                  <textarea
                    value={hideReason}
                    onChange={(e) => setHideReason(e.target.value)}
                    placeholder="أدخل سبب إخفاء هذا العنصر..."
                    rows={3}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setHideModal(null);
                    setHideReason('');
                  }}
                >
                  إلغاء
                </button>
                <button
                  className={styles.confirmButton}
                  onClick={handleHide}
                  disabled={!hideReason.trim() || hideItem.isPending}
                >
                  {hideItem.isPending ? 'جاري الإخفاء...' : 'إخفاء'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDelete}
          title="حذف العنصر"
          message={`هل أنت متأكد من حذف "${deleteModal?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
          loading={deleteItem.isPending}
        />
      </div>
    </AdminLayout>
  );
}
