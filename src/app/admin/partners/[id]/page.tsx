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
  useAdminPartner,
  useApprovePartner,
  useRejectPartner,
  useRequestChanges,
  useSuspendPartner,
  useReinstatePartner,
} from '@/hooks/useAdmin';
import { PARTNER_STATE_CONFIG, PartnerState } from '@/types';
import styles from './page.module.css';

type ActionType = 'approve' | 'reject' | 'changes' | 'suspend' | 'reinstate' | null;

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.id as string;

  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [reason, setReason] = useState('');

  const { data: partner, isLoading, error } = useAdminPartner(partnerId);
  const approveMutation = useApprovePartner();
  const rejectMutation = useRejectPartner();
  const requestChangesMutation = useRequestChanges();
  const suspendMutation = useSuspendPartner();
  const reinstateMutation = useReinstatePartner();

  const handleAction = async () => {
    if (!activeAction) return;

    try {
      switch (activeAction) {
        case 'approve':
          await approveMutation.mutateAsync(partnerId);
          break;
        case 'reject':
          await rejectMutation.mutateAsync({ partnerId, reason });
          break;
        case 'changes':
          await requestChangesMutation.mutateAsync({ partnerId, reason });
          break;
        case 'suspend':
          await suspendMutation.mutateAsync({ partnerId, reason });
          break;
        case 'reinstate':
          await reinstateMutation.mutateAsync(partnerId);
          break;
      }
      setActiveAction(null);
      setReason('');
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const isActionLoading = 
    approveMutation.isPending ||
    rejectMutation.isPending ||
    requestChangesMutation.isPending ||
    suspendMutation.isPending ||
    reinstateMutation.isPending;

  const getActionConfig = () => {
    switch (activeAction) {
      case 'approve':
        return {
          title: 'الموافقة على الشريك',
          message: 'هل أنت متأكد من الموافقة على هذا الشريك؟ سيتمكن من إضافة خدماته على المنصة.',
          confirmText: 'موافقة',
          variant: 'primary' as const,
          requiresReason: false,
        };
      case 'reject':
        return {
          title: 'رفض الشريك',
          message: 'يرجى توضيح سبب الرفض للشريك.',
          confirmText: 'رفض',
          variant: 'danger' as const,
          requiresReason: true,
          reasonLabel: 'سبب الرفض',
          reasonPlaceholder: 'أدخل سبب رفض طلب الشريك...',
        };
      case 'changes':
        return {
          title: 'طلب تعديلات',
          message: 'يرجى توضيح التعديلات المطلوبة من الشريك.',
          confirmText: 'إرسال',
          variant: 'warning' as const,
          requiresReason: true,
          reasonLabel: 'التعديلات المطلوبة',
          reasonPlaceholder: 'أدخل التعديلات المطلوبة...',
        };
      case 'suspend':
        return {
          title: 'تعليق الشريك',
          message: 'يرجى توضيح سبب التعليق.',
          confirmText: 'تعليق',
          variant: 'danger' as const,
          requiresReason: true,
          reasonLabel: 'سبب التعليق',
          reasonPlaceholder: 'أدخل سبب تعليق الشريك...',
        };
      case 'reinstate':
        return {
          title: 'إعادة تفعيل الشريك',
          message: 'هل أنت متأكد من إعادة تفعيل هذا الشريك؟',
          confirmText: 'إعادة تفعيل',
          variant: 'primary' as const,
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
          <p>جاري تحميل بيانات الشريك...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !partner) {
    return (
      <AdminLayout>
        <div className={styles.page}>
          <EmptyState
            title="الشريك غير موجود"
            description="لم يتم العثور على الشريك المطلوب"
            action={{
              label: 'العودة للقائمة',
              onClick: () => router.push('/admin/partners')
            }}
          />
        </div>
      </AdminLayout>
    );
  }

  const stateConfig = PARTNER_STATE_CONFIG[partner.state as PartnerState];
  const canApprove = partner.state === 'pending_review' || partner.state === 'changes_requested';
  const canReject = partner.state === 'pending_review' || partner.state === 'changes_requested';
  const canRequestChanges = partner.state === 'pending_review';
  const canSuspend = partner.state === 'approved';
  const canReinstate = partner.state === 'suspended';

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
          <Link href="/admin/partners">الشركاء</Link>
          <span className={styles.breadcrumbSeparator}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <span className={styles.breadcrumbCurrent}>{partner.businessName || partner.name}</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.partnerAvatar}>
              {partner.businessName?.charAt(0) || partner.name?.charAt(0) || '?'}
            </div>
            <div className={styles.headerText}>
              <h1>{partner.businessName || partner.name}</h1>
              <p className={styles.partnerEmail}>{partner.email}</p>
              <div className={styles.partnerMeta}>
                <span className={styles.serviceType}>
                  {partner.serviceTypeIcon} {partner.serviceTypeLabel}
                </span>
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
            </div>
          </div>
          <div className={styles.headerActions}>
            {canApprove && (
              <Button onClick={() => setActiveAction('approve')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                موافقة
              </Button>
            )}
            {canRequestChanges && (
              <Button variant="outline" onClick={() => setActiveAction('changes')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                طلب تعديلات
              </Button>
            )}
            {canReject && (
              <Button variant="danger" onClick={() => setActiveAction('reject')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                رفض
              </Button>
            )}
            {canSuspend && (
              <Button variant="danger" onClick={() => setActiveAction('suspend')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                تعليق
              </Button>
            )}
            {canReinstate && (
              <Button onClick={() => setActiveAction('reinstate')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
                إعادة تفعيل
              </Button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Basic Info Card */}
          <Card className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2>معلومات الشريك</h2>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الاسم الكامل</span>
                <span className={styles.infoValue}>{partner.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>البريد الإلكتروني</span>
                <span className={styles.infoValue}>{partner.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>رقم الهاتف</span>
                <span className={styles.infoValue}>{partner.phone || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>اسم النشاط التجاري</span>
                <span className={styles.infoValue}>{partner.businessName || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>نوع الخدمة</span>
                <span className={styles.infoValue}>
                  {partner.serviceTypeIcon} {partner.serviceTypeLabel}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>تاريخ التسجيل</span>
                <span className={styles.infoValue}>
                  {new Date(partner.createdAt).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </Card>

          {/* Service-specific Data */}
          {partner.data && Object.keys(partner.data).length > 0 && (
            <Card className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h2>بيانات الخدمة</h2>
              </div>
              <div className={styles.infoGrid}>
                {Object.entries(partner.data).map(([key, value]) => (
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

          {/* Documents Card */}
          {partner.documents && partner.documents.length > 0 && (
            <Card className={styles.documentsCard}>
              <div className={styles.cardHeader}>
                <h2>المستندات</h2>
              </div>
              <div className={styles.documentsList}>
                {partner.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.documentItem}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>{doc.name || `مستند ${index + 1}`}</span>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* State History Card */}
          {partner.stateHistory && partner.stateHistory.length > 0 && (
            <Card className={styles.historyCard}>
              <div className={styles.cardHeader}>
                <h2>سجل الحالات</h2>
              </div>
              <div className={styles.timeline}>
                {partner.stateHistory.map((entry, index) => {
                  const entryStateConfig = PARTNER_STATE_CONFIG[entry.to as PartnerState];
                  return (
                    <div key={index} className={styles.timelineItem}>
                      <div className={styles.timelineDot}>
                        <span className={styles[entryStateConfig?.color || 'gray']} />
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                          <span className={styles.timelineState}>
                            {entryStateConfig?.ar || entry.to}
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
                    setReason('');
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
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
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
                    setReason('');
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  variant={actionConfig.variant === 'primary' ? 'default' : actionConfig.variant}
                  onClick={handleAction}
                  loading={isActionLoading}
                  disabled={actionConfig.requiresReason && !reason.trim()}
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
