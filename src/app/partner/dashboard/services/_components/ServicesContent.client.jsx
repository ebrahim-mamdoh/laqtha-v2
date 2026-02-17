'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import styles from '../services.module.css';
import ServicesFilter from './ServicesFilter.client';
import { fetchPartnerItems, archivePartnerItem } from '../services.api';
import { Modal, Button, Spinner } from 'react-bootstrap';
import notify from '@/lib/notify';
import { useRouter } from 'next/navigation';

export default function ServicesContent() {
    const queryClient = useQueryClient();
    const router = useRouter();

    // UI State
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [itemToArchive, setItemToArchive] = useState(null);

    // API Query
    const filters = {
        page: currentPage,
        limit: 10,
        state: activeFilter === 'all' ? undefined : activeFilter,
        includeArchived: activeFilter === 'archived' ? true : undefined,
    };

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['partner-services', filters],
        queryFn: () => fetchPartnerItems(filters),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });

    const items = response?.data?.items || [];
    const pagination = response?.data?.pagination || { page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false };
    const summary = response?.data?.summary || { total: 0, active: 0, inactive: 0, draft: 0, hidden: 0, archived: 0 };

    // Archive Mutation
    const archiveMutation = useMutation({
        mutationFn: (itemId) => archivePartnerItem(itemId),
        onMutate: async (itemId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['partner-services', filters] });

            // Snapshot previous value
            const previousData = queryClient.getQueryData(['partner-services', filters]);

            // Optimistic Update
            if (previousData) {
                queryClient.setQueryData(['partner-services', filters], (old) => {
                    if (!old?.data?.items) return old;
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            items: old.data.items.filter(item => item.id !== itemId)
                        }
                    };
                });
            }

            return { previousData };
        },
        onError: (err, itemId, context) => {
            // Rollback
            if (context?.previousData) {
                queryClient.setQueryData(['partner-services', filters], context.previousData);
            }

            let message = "حدث خطأ أثناء الأرشفة.";
            if (err.response) {
                if (err.response.status === 403) message = "لا يمكن أرشفة هذا العنصر (محظور).";
                else if (err.response.status === 404) message = "العنصر غير موجود.";
            }
            notify.error(message);
        },
        onSuccess: () => {
            // Invalidate to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ['partner-services'] });
            // Invalidate to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ['partner-services'] });
            notify.crud('archive', 'العنصر');
            handleCloseModal();
        },
    });

    // Handlers
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleArchiveClick = (item) => {
        setItemToArchive(item);
        setShowArchiveModal(true);
    };

    const handleConfirmArchive = () => {
        if (itemToArchive) {
            archiveMutation.mutate(itemToArchive.id);
        }
    };

    const handleCloseModal = () => {
        setShowArchiveModal(false);
        setItemToArchive(null);
    };

    const handleEditClick = (item) => {
        router.push(`/partner/dashboard/add-service?mode=edit&id=${item.id}`);
    };

    // Helper for Status Badge Class
    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return styles.active;
            case 'inactive': return styles.rejected;
            case 'draft': return styles.draft;
            case 'hidden': return styles.hidden;
            case 'archived': return styles.archived;
            default: return '';
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>يمكنك تتبع خدماتك من هنا</h1>
                <p className={styles.subtitle}>تستطيع تجميع او حذف او تعديل الخدمات ومراقبة حالتها</p>
            </div>

            {/* Stats Grid (Used as Filters) */}
            <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                {/* Helper component or map could be used, but keeping explicit for now as per previous structure */}
                {['all', 'active', 'draft', 'inactive', 'hidden', 'archived'].map(status => (
                    <div
                        key={status}
                        className={styles.statCard}
                        onClick={() => handleFilterChange(status)}
                        style={{
                            cursor: 'pointer',
                            borderColor: activeFilter === status ? '#f500a2' : 'rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <div className={styles.statLabel}>
                            {status === 'all' ? 'اجمالي الخدمات' :
                                status === 'active' ? 'الخدمات النشطة' :
                                    status === 'draft' ? 'المسودة' :
                                        status === 'inactive' ? 'غير نشطة' :
                                            status === 'hidden' ? 'مخفية' : 'مؤرشفة'}
                        </div>
                        <div className={styles.statValue}>
                            {status === 'all' ? summary.total : summary[status] || 0}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions Bar */}
            <ServicesFilter />

            {/* Content */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0b0' }}>
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">جار التحميل...</p>
                </div>
            ) : isError ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
                    {error?.message || 'فشل في تحميل البيانات'}
                </div>
            ) : items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0b0' }}>لا يوجد خدمات</div>
            ) : (
                <div className={styles.cardsContainer}>
                    {items.map((item) => (
                        <div key={item.id} className={styles.serviceCard}>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{item.name?.ar || item.name?.en || 'بدون اسم'}</h3>
                                <div className={styles.cardPrice}>سعر غير محدد</div>

                                <div className={styles.cardActions}>
                                    {item.isEditable && (
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEditClick(item)}
                                        >
                                            تعديل
                                        </button>
                                    )}
                                    {item.stateProperties?.canPublish && (
                                        <button className={styles.actionBtn}>نشر</button>
                                    )}
                                    {item.stateProperties?.canArchive && (
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleArchiveClick(item)}
                                        >
                                            أرشفة
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className={styles.cardStatus}>
                                <span className={`${styles.statusBadge} ${getStatusClass(item.state)}`}>
                                    {item.stateLabel}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        disabled={!pagination.hasPrev}
                        onClick={() => handlePageChange(currentPage - 1)}
                        style={{ opacity: !pagination.hasPrev ? 0.5 : 1 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>

                    {pagination.totalPages <= 5 ? (
                        Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))
                    ) : (
                        <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>
                            {currentPage}
                        </button>
                    )}

                    <button
                        className={styles.pageBtn}
                        disabled={!pagination.hasNext}
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{ opacity: !pagination.hasNext ? 0.5 : 1 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                </div>
            )}

            {/* Confirmation Modal */}
            {/* Confirmation Modal */}
            <Modal show={showArchiveModal} onHide={handleCloseModal} centered contentClassName={styles.glassModal}>
                <Modal.Header closeButton className={styles.modalHeader}>
                    <Modal.Title className={styles.modalTitle}>تأكيد الأرشفة</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    هل أنت متأكد أنك تريد أرشفة هذا العنصر؟ يمكنك استعادته خلال 30 يوم.
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <button className={`${styles.modalBtn} ${styles.cancelBtn}`} onClick={handleCloseModal}>
                        الغاء
                    </button>
                    <button
                        className={`${styles.modalBtn} ${styles.confirmBtn}`}
                        onClick={handleConfirmArchive}
                        disabled={archiveMutation.isPending}
                    >
                        {archiveMutation.isPending ? 'جار الأرشفة...' : 'ارشفه'}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
