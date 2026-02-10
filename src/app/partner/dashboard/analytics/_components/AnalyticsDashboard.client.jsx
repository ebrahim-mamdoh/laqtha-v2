'use client';

import React from 'react';
import styles from '../analytics.module.css';
import RevenueChart from './RevenueChart.client';

export default function AnalyticsDashboard({ initialData }) {
    const { summary, chartData, recentOrders } = initialData;

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.pageTitle}>التحليلات</h1>
                    <p className={styles.subTitle}>نظرة شاملة لكل الانشطة</p>
                    <h2 className={styles.pageTitle} style={{ fontSize: '1.5rem', marginTop: '1rem' }}>نظرة عامة</h2>
                </div>

                <button className={styles.filterButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    اخر 30 يوم
                </button>
            </div>

            {/* Summary Cards - Order: Services, Items, Payments (RTL Flow) */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>اجمالي الخدمات</span>
                        <span className={`${styles.growthLabel} ${styles.growthPositive}`}>+3 مقارنة بالشهر الماضي</span>
                    </div>
                    <div className={styles.cardValue}>{summary.totalServices}</div>
                    <div className={styles.cardFooter}>قائمة الخدمات المتوفرة</div>
                </div>

                <div className={styles.summaryCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>اجمالي العناصر</span>
                        <span className={`${styles.growthLabel} ${styles.growthPositive}`}>+13 مقارنة بالشهر الماضي</span>
                    </div>
                    <div className={styles.cardValue}>{summary.totalItems}</div>
                    <div className={styles.cardFooter}>الخدمات | المنتجات المتاحة</div>
                </div>

                <div className={styles.summaryCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>اجمالي المدفوعات</span>
                        <span className={`${styles.growthLabel} ${styles.growthNegative}`}>-15% مقارنة بالشهر الماضي</span>
                    </div>
                    <div className={styles.cardValue}>{summary.totalPayments} <span style={{ fontSize: '1rem' }}>رس</span></div>
                    <div className={styles.cardFooter}>المعاملات المالية داخل التطبيق</div>
                </div>
            </div>

            {/* Chart and Orders Layout */}
            <div className={styles.contentGrid}>
                {/* Financial Chart Section */}
                <div className={styles.chartSection}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <div className={styles.sectionTitle}>المعاملات المالية</div>
                            <div className={styles.sectionSub}>الواردات والارباح في اخر 6 اشهر</div>
                        </div>
                    </div>
                    <RevenueChart data={chartData} />
                {/* Recent Orders Section */}
                <div className={styles.ordersSection}>
                    <div className={styles.tableHeader}>
                        <div className={styles.sectionTitle}>الطلبات الاخيرة</div>
                        <div className={styles.tableActions}>
                            <button className={styles.filterIconBtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                <span style={{ marginRight: '5px' }}>الكل</span>
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>صاحب الطلب</th>
                                    <th>موعد الحجز</th>
                                    <th>موعد انتهاء الحجز</th>
                                    <th>المبلغ</th>
                                    <th>حالة الطلب</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.owner}</td>
                                        <td>{order.bookingDate}</td>
                                        <td>{order.endDate}</td>
                                        <td>{order.amount} ر.س</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${order.status === 'confirmed' ? styles.statusConfirmed :
                                                    order.status === 'pending' ? styles.statusPending :
                                                        styles.statusCompleted
                                                }`}>
                                                {order.statusLabel}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>

            </div>
        </div>
    );
}
