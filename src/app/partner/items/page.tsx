'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usePartnerItems, useDeletePartnerItem, useToggleItemStatus } from '@/hooks';
import { PartnerLayout } from '@/layouts';
import { 
  Button, 
  Card, 
  Table, 
  Badge,
  Pagination,
  Spinner,
  Modal,
  ConfirmModal
} from '@/components/ui';
import { StateBadge } from '@/components/ui/Badge/Badge';
import { EmptyItems, EmptySearch } from '@/components/ui/EmptyState/EmptyState';
import { useToast } from '@/components/ui/Toast/Toast';
import { ServiceItem, ItemState } from '@/types';
import styles from './page.module.css';

// ============================================================================
// Types
// ============================================================================

interface TableItem {
  _id: string;
  name: string;
  state: ItemState;
  price?: { amount: number; currency: string };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Filter Components
// ============================================================================

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  stateFilter: string;
  onStateChange: (value: string) => void;
}

function Filters({ searchQuery, onSearchChange, stateFilter, onStateChange }: FiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.searchBox}>
        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.searchIcon}>
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          placeholder="بحث عن عنصر..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button
            className={styles.clearSearch}
            onClick={() => onSearchChange('')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>

      <select
        value={stateFilter}
        onChange={(e) => onStateChange(e.target.value)}
        className={styles.filterSelect}
      >
        <option value="">جميع الحالات</option>
        <option value="active">نشط</option>
        <option value="inactive">غير نشط</option>
        <option value="pending">قيد المراجعة</option>
      </select>
    </div>
  );
}

// ============================================================================
// Table Action Menu
// ============================================================================

interface ActionMenuProps {
  item: TableItem;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

function ActionMenu({ item, onEdit, onToggleStatus, onDelete }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
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
          <button onClick={() => { onEdit(); setIsOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            تعديل
          </button>
          <button onClick={() => { onToggleStatus(); setIsOpen(false); }}>
            {item.state === 'active' ? (
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
// Main Component
// ============================================================================

export default function PartnerItemsPage() {
  const router = useRouter();
  const { partner } = useAuth();
  const { showToast } = useToast();

  // State
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [itemToDelete, setItemToDelete] = useState<TableItem | null>(null);

  // API hooks
  const { data: itemsData, isLoading, refetch } = usePartnerItems({
    page,
    limit: 10,
    search: searchQuery || undefined,
    state: stateFilter as ItemState | undefined,
  });

  const deleteMutation = useDeletePartnerItem();
  const toggleStatusMutation = useToggleItemStatus();

  // Handlers
  const handleEdit = (itemId: string) => {
    router.push(`/partner/items/${itemId}/edit`);
  };

  const handleToggleStatus = async (item: TableItem) => {
    const newState = item.state === 'active' ? 'inactive' : 'active';
    
    try {
      await toggleStatusMutation.mutateAsync({
        itemId: item._id,
        state: newState,
      });
      
      showToast({
        type: 'success',
        message: newState === 'active' ? 'تم تفعيل العنصر' : 'تم إيقاف العنصر',
      });
      
      refetch();
    } catch (error) {
      showToast({
        type: 'error',
        message: 'فشل في تغيير حالة العنصر',
      });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteMutation.mutateAsync(itemToDelete._id);
      
      showToast({
        type: 'success',
        message: 'تم حذف العنصر بنجاح',
      });
      
      setItemToDelete(null);
      refetch();
    } catch (error) {
      showToast({
        type: 'error',
        message: 'فشل في حذف العنصر',
      });
    }
  };

  // Table columns
  const columns = useMemo(() => [
    {
      key: 'name' as keyof TableItem,
      header: 'اسم العنصر',
      sortable: true,
      render: (item: TableItem) => (
        <Link href={`/partner/items/${item._id}`} className={styles.itemLink}>
          {item.name}
        </Link>
      ),
    },
    {
      key: 'state' as keyof TableItem,
      header: 'الحالة',
      render: (item: TableItem) => (
        <StateBadge state={item.state} type="item" />
      ),
    },
    {
      key: 'price' as keyof TableItem,
      header: 'السعر',
      render: (item: TableItem) => (
        item.price ? (
          <span className={styles.price}>
            {item.price.amount} {item.price.currency}
          </span>
        ) : (
          <span className={styles.noPrice}>-</span>
        )
      ),
    },
    {
      key: 'createdAt' as keyof TableItem,
      header: 'تاريخ الإنشاء',
      sortable: true,
      render: (item: TableItem) => (
        <span className={styles.date}>
          {new Date(item.createdAt).toLocaleDateString('ar-SA')}
        </span>
      ),
    },
    {
      key: '_id' as keyof TableItem,
      header: '',
      width: '50px',
      render: (item: TableItem) => (
        <ActionMenu
          item={item}
          onEdit={() => handleEdit(item._id)}
          onToggleStatus={() => handleToggleStatus(item)}
          onDelete={() => setItemToDelete(item)}
        />
      ),
    },
  ], []);

  // Empty states
  const renderEmptyState = () => {
    if (searchQuery || stateFilter) {
      return (
        <EmptySearch
          action={{
            label: 'إزالة الفلاتر',
            onClick: () => {
              setSearchQuery('');
              setStateFilter('');
            },
          }}
        />
      );
    }

    return (
      <EmptyItems
        action={{
          label: 'إضافة عنصر جديد',
          onClick: () => router.push('/partner/items/new'),
        }}
      />
    );
  };

  const items = itemsData?.data?.items || [];
  const totalItems = itemsData?.data?.pagination?.total || 0;
  const totalPages = itemsData?.data?.pagination?.pages || 1;

  return (
    <PartnerLayout>
      <div className={styles.itemsPage}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>عناصر الخدمة</h1>
            <p>إدارة عناصر الخدمة الخاصة بك</p>
          </div>
          <Link href="/partner/items/new">
            <Button variant="primary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              إضافة عنصر
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card variant="bordered" className={styles.filtersCard}>
          <Filters
            searchQuery={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
            stateFilter={stateFilter}
            onStateChange={(value) => {
              setStateFilter(value);
              setPage(1);
            }}
          />
        </Card>

        {/* Table or Empty State */}
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
                keyExtractor={(item) => item._id}
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
            عرض {items.length} من {totalItems} عنصر
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="حذف العنصر"
        message={`هل أنت متأكد من حذف "${itemToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </PartnerLayout>
  );
}
