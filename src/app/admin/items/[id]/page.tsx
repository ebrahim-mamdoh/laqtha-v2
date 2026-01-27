'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/layouts/AdminSidebar/AdminSidebar';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import {
  useAdminItem,
  useHideItem,
  useShowItem,
  useArchiveItem,
  useAdminDeleteItem,
} from '@/hooks/useAdmin';
import { ITEM_STATE_CONFIG, ItemState } from '@/types';
import styles from './page.module.css';

type ActionType = 'hide' | 'show' | 'archive' | 'delete' | null;

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [hideReason, setHideReason] = useState('');

  const { data: item, isLoading, error } = useAdminItem(itemId);

  const hideItem = useHideItem();
  const showItem = useShowItem();
  const archiveItem = useArchiveItem();
  const deleteItem = useAdminDeleteItem();

  const handleAction = async () => {
    if (!activeAction) return;

    try {
      switch (activeAction) {
        case 'hide':
          await hideItem.mutateAsync({ itemId, data: { reason: hideReason } });
          break;
        case 'show':
          await showItem.mutateAsync(itemId);
          break;
        case 'archive':
          await archiveItem.mutateAsync(itemId);
          break;
        case 'delete':
          await deleteItem.mutateAsync(itemId);
          router.push('/admin/items');
          return;
      }
      setActiveAction(null);
      setHideReason('');
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const isActionLoading =
    hideItem.isPending ||
    showItem.isPending ||
    archiveItem.isPending ||
    deleteItem.isPending;

  const getActionConfig = () => {
    switch (activeAction) {
      case 'hide':
        return {
          title: 'إخفاء العنصر',
          message: 'يرجى توضيح سبب إخفاء هذا العنصر.',
          confirmText: 'إخفاء',
          variant: 'danger' as const,
          requiresReason: true,
          reasonLabel: 'سبب الإخفاء',
          reasonPlaceholder: 'أدخل سبب إخفاء هذا العنصر...',
        };
      case 'show':
        return {
          title: 'إظهار العنصر',
          message: 'هل أنت متأكد من إظهار هذا العنصر؟ سيكون متاحاً للعملاء.',
          confirmText: 'إظهار',
          variant: 'primary' as const,
          requiresReason: false,
        };
      case 'archive':
        return {
          title: 'أرشفة العنصر',
          message: 'هل أنت متأكد من أرشفة هذا العنصر؟',
          confirmText: 'أرشفة',
          variant: 'warning' as const,
          requiresReason: false,
        };
      case 'delete':
        return {
          title: 'حذف العنصر',
          message: 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
          confirmText: 'حذف',
          variant: 'danger' as const,
          requiresReason: false,
        };
      default:
        return null;
    }
  };

  const actionConfig = getActionConfig();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className={styles.loadingContainer}>
          <Spinner size="lg" />
          <p>جاري تحميل بيانات العنصر...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !item) {
    return (
      <AdminLayout>
        <div className={styles.page}>
          <EmptyState
            title="العنصر غير موجود"
            description="لم يتم العثور على العنصر المطلوب"
            action={{
              label: 'العودة للقائمة',
              onClick: () => router.push('/admin/items')
            }}
          />
        </div>
      </AdminLayout>
    );
  }

  const stateConfig = ITEM_STATE_CONFIG[item.state as ItemState];
  const canHide = item.state !== 'hidden' && item.state !== 'archived';
  const canShow = item.state === 'hidden';
  const canArchive = item.state !== 'archived';

  return (
    <AdminLayout>
      <div className={styles.page}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/admin/dashboard">لوحة التحكم</Link>
          <span className={styles.breadcrumbSeparator}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <Link href="/admin/items">الخدمات</Link>
          <span className={styles.breadcrumbSeparator}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <span className={styles.breadcrumbCurrent}>{item.name.ar}</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.headerText}>
              <h1>{item.name.ar}</h1>
              {item.name.en && <p className={styles.itemNameEn}>{item.name.en}</p>}
              <div className={styles.itemMeta}>
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
                <span className={styles.serviceType}>{item.serviceTypeKey}</span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            {canShow && (
              <Button onClick={() => setActiveAction('show')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                إظهار
              </Button>
            )}
            {canHide && (
              <Button variant="outline" onClick={() => setActiveAction('hide')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                إخفاء
              </Button>
            )}
            {canArchive && (
              <Button variant="outline" onClick={() => setActiveAction('archive')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
                أرشفة
              </Button>
            )}
            <Button variant="danger" onClick={() => setActiveAction('delete')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              حذف
            </Button>
          </div>
        </div>

        {/* Hidden Reason Alert */}
        {item.state === 'hidden' && item.hiddenReason && (
          <div className={styles.alertCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <strong>سبب الإخفاء:</strong>
              <p>{item.hiddenReason}</p>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Basic Info Card */}
          <Card className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2>معلومات العنصر</h2>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الاسم بالعربية</span>
                <span className={styles.infoValue}>{item.name.ar}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الاسم بالإنجليزية</span>
                <span className={styles.infoValue}>{item.name.en || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>نوع الخدمة</span>
                <span className={styles.infoValue}>{item.serviceTypeKey}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الشريك</span>
                <Link href={`/admin/partners/${item.partnerId}`} className={styles.infoLink}>
                  {item.partnerName || item.partnerId}
                </Link>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>تاريخ الإنشاء</span>
                <span className={styles.infoValue}>
                  {new Date(item.createdAt).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>آخر تحديث</span>
                <span className={styles.infoValue}>
                  {new Date(item.updatedAt).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>مميز</span>
                <span className={styles.infoValue}>
                  {item.isFeatured ? '⭐ نعم' : 'لا'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ترتيب العرض</span>
                <span className={styles.infoValue}>{item.displayOrder}</span>
              </div>
            </div>
          </Card>

          {/* Description */}
          {(item.description?.ar || item.description?.en) && (
            <Card className={styles.descriptionCard}>
              <div className={styles.cardHeader}>
                <h2>الوصف</h2>
              </div>
              <div className={styles.descriptionContent}>
                {item.description?.ar && (
                  <div className={styles.descriptionItem}>
                    <span className={styles.descLabel}>بالعربية</span>
                    <p>{item.description.ar}</p>
                  </div>
                )}
                {item.description?.en && (
                  <div className={styles.descriptionItem}>
                    <span className={styles.descLabel}>بالإنجليزية</span>
                    <p dir="ltr">{item.description.en}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Item-specific Data */}
          {item.data && Object.keys(item.data).length > 0 && (
            <Card className={styles.dataCard}>
              <div className={styles.cardHeader}>
                <h2>بيانات العنصر</h2>
              </div>
              <div className={styles.infoGrid}>
                {Object.entries(item.data).map(([key, value]) => (
                  <div key={key} className={styles.infoItem}>
                    <span className={styles.infoLabel}>{key}</span>
                    <span className={styles.infoValue}>
                      {typeof value === 'boolean'
                        ? (value ? 'نعم' : 'لا')
                        : Array.isArray(value)
                        ? value.join(', ')
                        : String(value) || '-'
                      }
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* State History Card */}
          {item.stateHistory && item.stateHistory.length > 0 && (
            <Card className={styles.historyCard}>
              <div className={styles.cardHeader}>
                <h2>سجل الحالات</h2>
              </div>
              <div className={styles.timeline}>
                {item.stateHistory.map((entry, index) => {
                  const entryStateConfig = ITEM_STATE_CONFIG[entry.to as ItemState];
                  return (
                    <div key={index} className={styles.timelineItem}>
                      <div className={styles.timelineDot}>
                        <span className={styles[entryStateConfig?.color || 'gray']} />
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                          <span className={styles.timelineState}>
                            {entryStateConfig?.icon} {entryStateConfig?.ar || entry.to}
                          </span>
                          <span className={styles.timelineDate}>
                            {new Date(entry.changedAt).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {entry.reason && (
                          <p className={styles.timelineReason}>{entry.reason}</p>
                        )}
                        <p className={styles.timelineActor}>
                          بواسطة: {entry.changedBy}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        {/* Action Modal */}
        {activeAction && actionConfig && (
          <div className={styles.modalOverlay}>
            <div className={styles.actionModal}>
              <div className={styles.modalHeader}>
                <h3>{actionConfig.title}</h3>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAction(null);
                    setHideReason('');
                  }}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <p>{actionConfig.message}</p>
                {actionConfig.requiresReason && (
                  <div className={styles.formGroup}>
                    <label>{actionConfig.reasonLabel}</label>
                    <textarea
                      value={hideReason}
                      onChange={(e) => setHideReason(e.target.value)}
                      placeholder={actionConfig.reasonPlaceholder}
                      rows={4}
                    />
                  </div>
                )}
              </div>
              <div className={styles.modalFooter}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveAction(null);
                    setHideReason('');
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  variant={actionConfig.variant === 'primary' ? 'default' : actionConfig.variant}
                  onClick={handleAction}
                  loading={isActionLoading}
                  disabled={actionConfig.requiresReason && !hideReason.trim()}
                >
                  {actionConfig.confirmText}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
