import React from 'react';
import styles from './services.module.css';
import ServicesFilter from './_components/ServicesFilter.client';

export const metadata = {
    title: 'خدماتي | شريك لقطة',
    description: 'ادارة ومتابعة الخدمات'
};

export default function ServicesPage() {
    // Mock Data
    const SERVICES = [
        { id: '01', name: 'VOLUVULUS CASTLE', location: 'المغرب، مكناس', rating: '5 نجوم', status: 'active', statusLabel: 'نشطة' },
        { id: '02', name: 'VOLUVULUS HOME', location: 'المغرب، أكادير', rating: '5 نجوم', status: 'active', statusLabel: 'نشطة' },
        { id: '03', name: 'VOLUVULUS GROUP', location: 'المغرب، طنجة', rating: '5 نجوم', status: 'active', statusLabel: 'نشطة' },
        { id: '04', name: 'VOLUVULUS PALAS', location: 'المغرب، الحسيمة', rating: '5 نجوم', status: 'suspended', statusLabel: 'معلقة' },
        { id: '05', name: 'VOLUVULUS LIFE', location: 'المغرب، الرباط', rating: '5 نجوم', status: 'rejected', statusLabel: 'مرفوضة' },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>يمكنك تتبع خدماتك من هنا</h1>
                <p className={styles.subtitle}>تستطيع تجميع او حذف او تعديل الخدمات ومراقبة حالتها</p>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>الحدمات المرفوضة</div>
                    <div className={styles.statValue}>1</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>الخدمات المعلقة</div>
                    <div className={styles.statValue}>1</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>الخدمات النشطة</div>
                    <div className={styles.statValue}>3</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>اجمالي الخدمات</div>
                    <div className={styles.statValue}>5</div>
                </div>
            </div>

            {/* Actions Bar (Client Component) */}
            <ServicesFilter />

            {/* Table */}
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.col}>الاجراءات</div>
                    <div className={styles.col}>حالة الخدمة</div>
                    <div className={styles.col}>موقع الخدمة</div>
                    <div className={styles.col}>تقييم الخدمة</div>
                    <div className={styles.colWide}>اسم الخدمة</div>
                    {/* Empty col for spacing if needed or hidden index */}
                </div>

                {SERVICES.map((item) => (
                    <div key={item.id} className={styles.tableRow}>
                        <div className={styles.col} style={{ display: 'flex', gap: '10px', justifyContent: 'center', color: '#888' }}>
                            <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} title="حذف">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                            <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} title="تعديل">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} title="مشاهدة">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </button>
                        </div>
                        <div className={styles.col}>
                            <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                                {item.statusLabel}
                            </span>
                        </div>
                        <div className={styles.col}>{item.location}</div>
                        <div className={styles.col}>{item.rating}</div>
                        <div className={styles.colWide}>{item.name}</div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                <button className={styles.pageBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <button className={styles.pageBtn}>4</button>
                <button className={styles.pageBtn}>3</button>
                <button className={styles.pageBtn}>2</button>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
            </div>
        </div>
    );
}
