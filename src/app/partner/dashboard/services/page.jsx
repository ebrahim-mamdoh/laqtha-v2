import React from 'react';
import styles from './services.module.css';
import ServicesFilter from './_components/ServicesFilter.client';

export const metadata = {
    title: 'خدماتي | شريك لقطها',
    description: 'ادارة ومتابعة الخدمات'
};

export default function ServicesPage() {
    // Mock Data
    const SERVICES = [
        { id: '01', name: 'جناح عائلي', price: '450 ر.ص / الليلة', rating: '5 نجوم', status: 'active', statusLabel: 'نشطة' },
        { id: '02', name: 'غرفة مع اطلالة على البحر', price: '450 ر.ص / الليلة', rating: '5 نجوم', status: 'rejected', statusLabel: 'معلقة' }, // Using rejected style for Red
        { id: '03', name: 'غرفة VIP', price: '450 ر.ص / الليلة', rating: '5 نجوم', status: 'suspended', statusLabel: 'متوقفة' }, // Using suspended style for Orange
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
                    <div className={styles.statLabel}>اجمالي الخدمات</div>
                    <div className={styles.statValue}>5</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>الخدمات النشطة</div>
                    <div className={styles.statValue}>3</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>الخدمات المعلقة</div>
                    <div className={styles.statValue}>1</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>الخدمات المرفوضة</div>
                    <div className={styles.statValue}>1</div>
                </div>
            </div>

            {/* Actions Bar (Client Component) */}
            <ServicesFilter />

            {/* Cards List */}
            <div className={styles.cardsContainer}>
                {SERVICES.map((item) => (
                    <div key={item.id} className={styles.serviceCard}>
                        {/* Right Section: Content */}
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{item.name}</h3>
                            <div className={styles.cardPrice}>{item.price}</div>

                            <div className={styles.cardActions}>
                                <button className={styles.actionBtn}>تعديل</button>
                                <button className={styles.actionBtn}>ايقاف مؤقت</button>
                                <button className={styles.actionBtn}>حذف</button>
                            </div>
                        </div>

                        {/* Left Section: Status Badge (Visually on Left in RTL due to flex row) 
                            Wait. In RTL:
                            Start (Right) -> Item 1
                            End (Left) -> Item 2
                            If I want Badge on Left, it should be Item 2 (last child).
                            BUT in the screenshot, Badge is on the TOP LEFT.
                            My css .serviceCard { justify-content: space-between }
                            Child 1 (Content) -> Right
                            Child 2 (Badge) -> Left
                        */}
                        <div className={styles.cardStatus}>
                            <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                                {item.statusLabel}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <button className={styles.pageBtn}>4</button>
                <button className={styles.pageBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
            </div>
        </div>
    );
}
