'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/layouts/AdminSidebar/AdminSidebar';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { useServiceType, useToggleServiceTypeStatus, useDeleteServiceType } from '@/hooks/useAdmin';
import { FIELD_TYPE_LABELS } from '@/types';
import styles from './page.module.css';

export default function ServiceTypeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const key = params.key as string;

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { data: serviceType, isLoading, error } = useServiceType(key);
  const toggleStatus = useToggleServiceTypeStatus();
  const deleteServiceType = useDeleteServiceType();

  const handleToggleStatus = async () => {
    if (!serviceType) return;
    try {
      await toggleStatus.mutateAsync(key);
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteServiceType.mutateAsync(key);
      router.push('/admin/service-types');
    } catch (error) {
      console.error('Failed to delete service type:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className={styles.loadingContainer}>
          <Spinner size="lg" />
          <p>جاري تحميل نوع الخدمة...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !serviceType) {
    return (
      <AdminLayout>
        <div className={styles.page}>
          <EmptyState
            title="نوع الخدمة غير موجود"
            description="لم يتم العثور على نوع الخدمة المطلوب"
            action={{
              label: 'العودة للقائمة',
              onClick: () => router.push('/admin/service-types')
            }}
          />
        </div>
      </AdminLayout>
    );
  }

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
          <Link href="/admin/service-types">أنواع الخدمات</Link>
          <span className={styles.breadcrumbSeparator}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <span className={styles.breadcrumbCurrent}>{serviceType.label.ar}</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <span className={styles.typeIcon}>{serviceType.icon}</span>
            <div className={styles.headerText}>
              <h1>{serviceType.label.ar}</h1>
              <p className={styles.typeKey}>{serviceType.key}</p>
            </div>
            <Badge variant={serviceType.isActive ? 'success' : 'danger'}>
              {serviceType.isActive ? 'نشط' : 'غير نشط'}
            </Badge>
          </div>
          <div className={styles.headerActions}>
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              loading={toggleStatus.isPending}
            >
              {serviceType.isActive ? 'تعطيل' : 'تفعيل'}
            </Button>
            <Link href={`/admin/service-types/${key}/edit`}>
              <Button variant="outline">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                تعديل
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              حذف
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Basic Info Card */}
          <Card className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2>المعلومات الأساسية</h2>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>المعرف (Key)</span>
                <span className={styles.infoValue}>{serviceType.key}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الأيقونة</span>
                <span className={styles.infoValue}>{serviceType.icon}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الاسم بالعربية</span>
                <span className={styles.infoValue}>{serviceType.label.ar}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الاسم بالإنجليزية</span>
                <span className={styles.infoValue}>{serviceType.label.en}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>اسم العنصر بالعربية</span>
                <span className={styles.infoValue}>{serviceType.itemLabel.ar}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>اسم العنصر بالإنجليزية</span>
                <span className={styles.infoValue}>{serviceType.itemLabel.en}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>نسبة العمولة</span>
                <span className={styles.infoValue}>{serviceType.commissionRate}%</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الحالة</span>
                <Badge variant={serviceType.isActive ? 'success' : 'danger'}>
                  {serviceType.isActive ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Stats Card */}
          <Card className={styles.statsCard}>
            <div className={styles.cardHeader}>
              <h2>الإحصائيات</h2>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{serviceType.fields?.length || 0}</span>
                <span className={styles.statLabel}>حقول الشريك</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{serviceType.itemFields?.length || 0}</span>
                <span className={styles.statLabel}>حقول العنصر</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Partner Fields */}
        <Card className={styles.fieldsCard}>
          <div className={styles.cardHeader}>
            <h2>حقول تسجيل الشريك</h2>
            <span className={styles.fieldCount}>
              {serviceType.fields?.length || 0} حقل
            </span>
          </div>
          {serviceType.fields && serviceType.fields.length > 0 ? (
            <div className={styles.fieldsTable}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>المعرف</th>
                    <th>النوع</th>
                    <th>الاسم بالعربية</th>
                    <th>الاسم بالإنجليزية</th>
                    <th>مطلوب</th>
                    <th>عرض في القائمة</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceType.fields.map((field, index) => (
                    <tr key={field.key}>
                      <td>{index + 1}</td>
                      <td className={styles.fieldKey}>{field.key}</td>
                      <td>
                        <Badge variant="default">
                          {FIELD_TYPE_LABELS[field.type] || field.type}
                        </Badge>
                      </td>
                      <td>{field.label.ar}</td>
                      <td>{field.label.en}</td>
                      <td>
                        {field.required ? (
                          <span className={styles.checkIcon}>✓</span>
                        ) : (
                          <span className={styles.crossIcon}>✗</span>
                        )}
                      </td>
                      <td>
                        {field.showInList ? (
                          <span className={styles.checkIcon}>✓</span>
                        ) : (
                          <span className={styles.crossIcon}>✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noFields}>
              <p>لا توجد حقول مخصصة للشريك</p>
            </div>
          )}
        </Card>

        {/* Item Fields */}
        <Card className={styles.fieldsCard}>
          <div className={styles.cardHeader}>
            <h2>حقول العنصر ({serviceType.itemLabel.ar})</h2>
            <span className={styles.fieldCount}>
              {serviceType.itemFields?.length || 0} حقل
            </span>
          </div>
          {serviceType.itemFields && serviceType.itemFields.length > 0 ? (
            <div className={styles.fieldsTable}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>المعرف</th>
                    <th>النوع</th>
                    <th>الاسم بالعربية</th>
                    <th>الاسم بالإنجليزية</th>
                    <th>مطلوب</th>
                    <th>عرض في القائمة</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceType.itemFields.map((field, index) => (
                    <tr key={field.key}>
                      <td>{index + 1}</td>
                      <td className={styles.fieldKey}>{field.key}</td>
                      <td>
                        <Badge variant="default">
                          {FIELD_TYPE_LABELS[field.type] || field.type}
                        </Badge>
                      </td>
                      <td>{field.label.ar}</td>
                      <td>{field.label.en}</td>
                      <td>
                        {field.required ? (
                          <span className={styles.checkIcon}>✓</span>
                        ) : (
                          <span className={styles.crossIcon}>✗</span>
                        )}
                      </td>
                      <td>
                        {field.showInList ? (
                          <span className={styles.checkIcon}>✓</span>
                        ) : (
                          <span className={styles.crossIcon}>✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noFields}>
              <p>لا توجد حقول مخصصة للعنصر</p>
            </div>
          )}
        </Card>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="حذف نوع الخدمة"
          message={`هل أنت متأكد من حذف "${serviceType.label.ar}"؟ سيتم حذف جميع البيانات المرتبطة بهذا النوع ولا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
          loading={deleteServiceType.isPending}
        />
      </div>
    </AdminLayout>
  );
}
