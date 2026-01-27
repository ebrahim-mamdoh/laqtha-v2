'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  useServiceTypes, 
  useServiceTypesStats, 
  useDeleteServiceType,
  useToggleServiceTypeStatus 
} from '@/hooks';
import { AdminLayout } from '@/layouts';
import { 
  Button, 
  Card, 
  Table,
  Badge,
  Pagination,
  Spinner,
  ConfirmModal 
} from '@/components/ui';
import { StatsCard } from '@/components/ui/Card/Card';
import { EmptyData, EmptySearch } from '@/components/ui/EmptyState/EmptyState';
import { useToast } from '@/components/ui/Toast/Toast';
import { ServiceType } from '@/types';
import styles from './page.module.css';

// ============================================================================
// Types
// ============================================================================

interface TableServiceType extends ServiceType {
  // Use key as unique identifier
}

// ============================================================================
// Stats Header
// ============================================================================

function StatsHeader() {
  const { data: stats, isLoading } = useServiceTypesStats();

  if (isLoading) {
    return (
      <div className={styles.statsGrid}>
        <div className={styles.statsSkeleton} />
        <div className={styles.statsSkeleton} />
        <div className={styles.statsSkeleton} />
      </div>
    );
  }

  return (
    <div className={styles.statsGrid}>
      <StatsCard
        title="إجمالي الأنواع"
        value={stats?.total ?? 0}
        icon={<ServiceTypesIcon />}
      />
      <StatsCard
        title="أنواع نشطة"
        value={stats?.active ?? 0}
        icon={<ActiveIcon />}
        className={styles.successStat}
      />
      <StatsCard
        title="أنواع غير نشطة"
        value={stats?.inactive ?? 0}
        icon={<InactiveIcon />}
        className={styles.warningStat}
      />
    </div>
  );
}

// ============================================================================
// Filters
// ============================================================================

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

function Filters({ searchQuery, onSearchChange, statusFilter, onStatusChange }: FiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.searchBox}>
        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.searchIcon}>
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          placeholder="بحث عن نوع خدمة..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button className={styles.clearSearch} onClick={() => onSearchChange('')}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className={styles.filterSelect}
      >
        <option value="">جميع الحالات</option>
        <option value="true">نشط</option>
        <option value="false">غير نشط</option>
      </select>
    </div>
  );
}

// ============================================================================
// Action Menu
// ============================================================================

interface ActionMenuProps {
  item: TableServiceType;
  onView: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

function ActionMenu({ item, onView, onEdit, onToggleStatus, onDelete }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.actionMenu} ref={menuRef}>
      <button
        className={styles.actionButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="المزيد من الخيارات"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.actionDropdown}>
          <button onClick={() => { onView(); setIsOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            عرض
          </button>
          <button onClick={() => { onEdit(); setIsOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            تعديل
          </button>
          <button onClick={() => { onToggleStatus(); setIsOpen(false); }}>
            {item.isActive ? (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
                </svg>
                إيقاف
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                تفعيل
              </>
            )}
          </button>
          <button className={styles.deleteAction} onClick={() => { onDelete(); setIsOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
            حذف
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Icons
// ============================================================================

function ServiceTypesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
    </svg>
  );
}

function ActiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function InactiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
    </svg>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ServiceTypesPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // State
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [itemToDelete, setItemToDelete] = useState<TableServiceType | null>(null);

  // API hooks
  const { data: serviceTypesData, isLoading, refetch } = useServiceTypes({
    page,
    limit: 10,
    search: searchQuery || undefined,
    isActive: statusFilter ? statusFilter === 'true' : undefined,
  });

  const deleteMutation = useDeleteServiceType();
  const toggleStatusMutation = useToggleServiceTypeStatus('');

  // Handlers
  const handleView = (key: string) => {
    router.push(`/admin/service-types/${key}`);
  };

  const handleEdit = (key: string) => {
    router.push(`/admin/service-types/${key}/edit`);
  };

  const handleToggleStatus = async (item: TableServiceType) => {
    try {
      await toggleStatusMutation.mutateAsync({ isActive: !item.isActive });
      
      showToast({
        type: 'success',
        message: item.isActive ? 'تم إيقاف نوع الخدمة' : 'تم تفعيل نوع الخدمة',
      });
      
      refetch();
    } catch {
      showToast({
        type: 'error',
        message: 'فشل في تغيير حالة نوع الخدمة',
      });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteMutation.mutateAsync(itemToDelete.key);
      
      showToast({
        type: 'success',
        message: 'تم حذف نوع الخدمة بنجاح',
      });
      
      setItemToDelete(null);
      refetch();
    } catch {
      showToast({
        type: 'error',
        message: 'فشل في حذف نوع الخدمة. قد يكون مرتبطاً بشركاء.',
      });
    }
  };

  // Table columns
  const columns = useMemo(() => [
    {
      key: 'icon' as keyof TableServiceType,
      header: '',
      width: '60px',
      render: (item: TableServiceType) => (
        <span className={styles.typeIcon}>{item.icon}</span>
      ),
    },
    {
      key: 'label' as keyof TableServiceType,
      header: 'الاسم',
      sortable: true,
      render: (item: TableServiceType) => (
        <Link href={`/admin/service-types/${item.key}`} className={styles.typeLink}>
          <span className={styles.typeName}>{item.label.ar}</span>
          <span className={styles.typeKey}>{item.key}</span>
        </Link>
      ),
    },
    {
      key: 'fieldsCount' as keyof TableServiceType,
      header: 'حقول الشريك',
      render: (item: TableServiceType) => (
        <Badge variant="info" size="sm">{item.fieldsCount} حقل</Badge>
      ),
    },
    {
      key: 'itemFieldsCount' as keyof TableServiceType,
      header: 'حقول العنصر',
      render: (item: TableServiceType) => (
        <Badge variant="secondary" size="sm">{item.itemFieldsCount} حقل</Badge>
      ),
    },
    {
      key: 'commissionRate' as keyof TableServiceType,
      header: 'العمولة',
      render: (item: TableServiceType) => (
        <span className={styles.commission}>{item.commissionRate}%</span>
      ),
    },
    {
      key: 'isActive' as keyof TableServiceType,
      header: 'الحالة',
      render: (item: TableServiceType) => (
        <Badge variant={item.isActive ? 'success' : 'secondary'} size="sm">
          {item.isActive ? 'نشط' : 'غير نشط'}
        </Badge>
      ),
    },
    {
      key: 'key' as keyof TableServiceType,
      header: '',
      width: '50px',
      render: (item: TableServiceType) => (
        <ActionMenu
          item={item}
          onView={() => handleView(item.key)}
          onEdit={() => handleEdit(item.key)}
          onToggleStatus={() => handleToggleStatus(item)}
          onDelete={() => setItemToDelete(item)}
        />
      ),
    },
  ], []);

  // Empty states
  const renderEmptyState = () => {
    if (searchQuery || statusFilter) {
      return (
        <EmptySearch
          action={{
            label: 'إزالة الفلاتر',
            onClick: () => {
              setSearchQuery('');
              setStatusFilter('');
            },
          }}
        />
      );
    }

    return (
      <EmptyData
        title="لا توجد أنواع خدمات"
        description="لم يتم إنشاء أي نوع خدمة حتى الآن"
        action={{
          label: 'إضافة نوع خدمة',
          onClick: () => router.push('/admin/service-types/new'),
        }}
      />
    );
  };

  const items = serviceTypesData?.data?.items ?? [];
  const totalItems = serviceTypesData?.data?.pagination?.total ?? 0;
  const totalPages = serviceTypesData?.data?.pagination?.pages ?? 1;

  return (
    <AdminLayout>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>أنواع الخدمات</h1>
            <p>إدارة أنواع الخدمات المتاحة في المنصة</p>
          </div>
          <Link href="/admin/service-types/new">
            <Button variant="primary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              إضافة نوع خدمة
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <StatsHeader />

        {/* Filters */}
        <Card variant="bordered" className={styles.filtersCard}>
          <Filters
            searchQuery={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
            statusFilter={statusFilter}
            onStatusChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          />
        </Card>

        {/* Table */}
        <Card variant="bordered" className={styles.tableCard}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner size="lg" />
              <p>جاري التحميل...</p>
            </div>
          ) : items.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <Table
                data={items}
                columns={columns}
                keyExtractor={(item) => item.key}
                hoverable
                striped
              />
              
              {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    showFirstLast
                  />
                </div>
              )}
            </>
          )}
        </Card>

        {/* Results Info */}
        {!isLoading && items.length > 0 && (
          <p className={styles.resultsInfo}>
            عرض {items.length} من {totalItems} نوع خدمة
          </p>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="حذف نوع الخدمة"
        message={`هل أنت متأكد من حذف "${itemToDelete?.label.ar}"؟ سيؤثر هذا على جميع الشركاء والعناصر المرتبطة.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}
