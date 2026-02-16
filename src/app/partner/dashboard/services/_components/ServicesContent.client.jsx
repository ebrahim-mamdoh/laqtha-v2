'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../services.module.css';
import ServicesFilter from './ServicesFilter.client';
import { fetchPartnerItems } from '../services.api';

export default function ServicesContent() {
    // State
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false });
    const [summary, setSummary] = useState({
        total: 0, active: 0, inactive: 0, draft: 0, hidden: 0, archived: 0
    });

    // Filter State
    // Default to 'all' or whatever the user prefers as default view.
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch Data
    useEffect(() => {
        const loadToState = async () => {
            setLoading(true);
            setError(null);
            try {
                const filters = {
                    page: currentPage,
                    limit: 10,
                    state: activeFilter === 'all' ? undefined : activeFilter,
                    includeArchived: activeFilter === 'archived' ? true : undefined,
                };

                const response = await fetchPartnerItems(filters);
                if (response.success) {
                    setItems(response.data.items);
                    setPagination(response.data.pagination);
                    if (response.data.summary) {
                        setSummary(response.data.summary);
                    }
                } else {
                    setError('فشل في تحميل البيانات');
                }
            } catch (err) {
                console.error(err);
                setError('حدث خطأ أثناء الاتصال بالخادم');
            } finally {
                setLoading(false);
            }
        };
        loadToState();
    }, [currentPage, activeFilter]);

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
                <div
                    className={styles.statCard}
                    onClick={() => handleFilterChange('all')}
                    style={{
                        cursor: 'pointer',
                        borderColor: activeFilter === 'all' ? '#f500a2' : 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <div className={styles.statLabel}>اجمالي الخدمات</div>
                    <div className={styles.statValue}>{summary.total || 0}</div>
                </div>
                <div
                    className={styles.statCard}
                    onClick={() => handleFilterChange('active')}
                    style={{
                        cursor: 'pointer',
                        borderColor: activeFilter === 'active' ? '#f500a2' : 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <div className={styles.statLabel}>الخدمات النشطة</div>
                    <div className={styles.statValue}>{summary.active || 0}</div>
                </div>
                <div
                    className={styles.statCard}
                    onClick={() => handleFilterChange('draft')}
                    style={{
                        cursor: 'pointer',
                        borderColor: activeFilter === 'draft' ? '#f500a2' : 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <div className={styles.statLabel}>المسودة</div>
                    <div className={styles.statValue}>{summary.draft || 0}</div>
                </div>
                <div
                    className={styles.statCard}
                    onClick={() => handleFilterChange('inactive')}
                    style={{
                        cursor: 'pointer',
                        borderColor: activeFilter === 'inactive' ? '#f500a2' : 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <div className={styles.statLabel}>غير نشطة</div>
                    <div className={styles.statValue}>{summary.inactive || 0}</div>
                </div>
                <div
                    className={styles.statCard}
                    onClick={() => handleFilterChange('hidden')}
                    style={{
                        cursor: 'pointer',
                        borderColor: activeFilter === 'hidden' ? '#f500a2' : 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <div className={styles.statLabel}>مخفية</div>
                    <div className={styles.statValue}>{summary.hidden || 0}</div>
                </div>
                <div
                    className={styles.statCard}
                    onClick={() => handleFilterChange('archived')}
                    style={{
                        cursor: 'pointer',
                        borderColor: activeFilter === 'archived' ? '#f500a2' : 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <div className={styles.statLabel}>مؤرشفة</div>
                    <div className={styles.statValue}>{summary.archived || 0}</div>
                </div>
            </div>

            {/* Actions Bar */}
            <ServicesFilter />

            {/* Content */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0b0' }}>جار التحميل...</div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>{error}</div>
            ) : items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0b0' }}>لا يوجد خدمات</div>
            ) : (
                <div className={styles.cardsContainer}>
                    {items.map((item) => (
                        <div key={item.id} className={styles.serviceCard}>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{item.name?.ar || item.name?.en || 'بدون اسم'}</h3>
                                {/* TODO: Backend must provide price field */}
                                <div className={styles.cardPrice}>سعر غير محدد</div>

                                <div className={styles.cardActions}>
                                    {item.isEditable && (
                                        <button className={styles.actionBtn}>تعديل</button>
                                    )}
                                    {item.stateProperties?.canPublish && (
                                        <button className={styles.actionBtn}>نشر</button>
                                    )}
                                    {item.stateProperties?.canArchive && (
                                        <button className={styles.actionBtn}>أرشفة</button>
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
                        style={{ opacity: !pagination.hasPrev ? 0.5 : 1, cursor: !pagination.hasPrev ? 'not-allowed' : 'pointer' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>

                    {/* Simple Pagination Numbers: show current, prev, next or just all if few */}
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
                        style={{ opacity: !pagination.hasNext ? 0.5 : 1, cursor: !pagination.hasNext ? 'not-allowed' : 'pointer' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                </div>
            )}
        </div>
    );
}

