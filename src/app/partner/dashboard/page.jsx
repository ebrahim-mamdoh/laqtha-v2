import React from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    return (
        <div>
            {/* Welcome Section */}
            <div className={styles.welcomeSection}>
                <div className={styles.welcomeText}>
                    <h1>مرحبا شريكنا</h1>
                    <p>يمكنك مراقبة وتتبع خدماتك من هنا</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.actionBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        مراجعة التحليلات
                    </button>
                    <button className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        اضافة خدمة جديدة
                    </button>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>نظرة عامة</h2>

            {/* Date Filter Button Placeholder */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button className={styles.actionBtn} style={{ background: '#1a0225', border: 'none' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    اخر 30 يوم
                </button>
            </div>

            {/* Stats Grid 1 */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>الخدمات في انتظار الموافقة</div>
                    <div className={styles.statValue}>1</div>
                    <div className={styles.statSub}>خدمات لم تنشط بعد</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>اجمالي الخدمات النشطة</div>
                    <div className={styles.statValue}>3</div>
                    <div className={styles.statSub}>الخدمات المتاحة للعملاء</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>اجمالي الخدمات</div>
                    <div className={styles.statValue}>5</div>
                    <div className={styles.statSub}>قائمة الخدمات المتوفرة</div>
                </div>
            </div>

            {/* Financial Stats Grid */}
            <div className={styles.financialGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>اجمالي الارباح</div>
                    <div className={styles.statValue}>1,476,365.00</div>
                    <div className={styles.statSub}>الارباح المكتسبة</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>اجمالي الحجوزات/ المبيعات</div>
                    <div className={styles.statValue}>1,476</div>
                    <div className={styles.statSub}>الحجوزات تمت خلال التطبيق</div>
                </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '10px', color: '#888', fontSize: '0.9rem' }}>يمكنك مراقبة وتتبع خدماتك من هنا</div>
            <h2 className={styles.sectionTitle}>العناصر الاكثر مبيعا</h2>

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.col} style={{ width: '50px', flex: 'none' }}>الترتيب</div>
                    <div className={styles.col}>اسم الخدمة</div>
                    <div className={styles.col}>تقييم الخدمة</div>
                    <div className={styles.col}>موقع الخدمة</div>
                    <div className={styles.col}>حالة الخدمة</div>
                    <div className={styles.col}>الاجراءات</div>
                </div>

                {/* Row 1 */}
                <div className={styles.tableRow}>
                    <div className={styles.col} style={{ width: '50px', flex: 'none' }}>01</div>
                    <div className={styles.col}>VOLUVULUS CASTLE</div>
                    <div className={styles.col}>5 نجوم</div>
                    <div className={styles.col}>المغرب، مكناس</div>
                    <div className={styles.col}><span className={`${styles.statusBadge} ${styles.statusActive}`}>نشطة</span></div>
                    <div className={styles.col} style={{ display: 'flex', gap: '10px', justifyContent: 'center', color: '#888' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                </div>

                {/* Row 2 */}
                <div className={styles.tableRow}>
                    <div className={styles.col} style={{ width: '50px', flex: 'none' }}>02</div>
                    <div className={styles.col}>VOLUVULUS HOME</div>
                    <div className={styles.col}>5 نجوم</div>
                    <div className={styles.col}>المغرب، أكادير</div>
                    <div className={styles.col}><span className={`${styles.statusBadge} ${styles.statusActive}`}>نشطة</span></div>
                    <div className={styles.col} style={{ display: 'flex', gap: '10px', justifyContent: 'center', color: '#888' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                </div>

                {/* Row 3 */}
                <div className={styles.tableRow}>
                    <div className={styles.col} style={{ width: '50px', flex: 'none' }}>03</div>
                    <div className={styles.col}>VOLUVULUS GROUP</div>
                    <div className={styles.col}>5 نجوم</div>
                    <div className={styles.col}>المغرب، طنجة</div>
                    <div className={styles.col}><span className={`${styles.statusBadge} ${styles.statusActive}`}>نشطة</span></div>
                    <div className={styles.col} style={{ display: 'flex', gap: '10px', justifyContent: 'center', color: '#888' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                </div>

                {/* Row 4 */}
                <div className={styles.tableRow}>
                    <div className={styles.col} style={{ width: '50px', flex: 'none' }}>04</div>
                    <div className={styles.col}>VOLUVULUS PALAS</div>
                    <div className={styles.col}>5 نجوم</div>
                    <div className={styles.col}>المغرب، الحسيمة</div>
                    <div className={styles.col}><span className={`${styles.statusBadge} ${styles.statusPending}`}>معلقة</span></div>
                    <div className={styles.col} style={{ display: 'flex', gap: '10px', justifyContent: 'center', color: '#888' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                </div>

            </div>
        </div>
    );
}
