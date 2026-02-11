'use client';

import React from 'react';
import styles from '../orders.module.css';

export default function OrdersDashboard({ initialData }) {
    const { summary, orders } = initialData;

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.pageTitle}>الطلبات</h1>
                    <p className={styles.subTitle}>نظرة شاملة لكل الطلبات</p>
                    <h2 className={styles.pageTitle} style={{ fontSize: '1.5rem', marginTop: '1rem' }}>نظرة عامة</h2>
                </div>

                <button className={styles.filterButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                    الفلاتر
                </button>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                {/* 1. Total (Right) */}
                <div className={styles.summaryCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>اجمالي الطلبات</span>
                        <span className={`${styles.growthLabel} ${styles.growthPositive}`}>+30 مقارنة بالشهر الماضي</span>
                    </div>
                    <div className={styles.cardValue}>{summary.totalOrders}</div>
                </div>

                {/* 2. Completed (Middle) */}
                <div className={styles.summaryCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>الطلبات المكتملة</span>
                        <span className={`${styles.growthLabel} ${styles.growthPositive}`}>+13 مقارنة بالشهر الماضي</span>
                    </div>
                    <div className={styles.cardValue}>{summary.completedOrders}</div>
                </div>

                {/* 3. Incomplete (Left) */}
                <div className={styles.summaryCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>الطلبات غير المكتملة</span>
                    </div>
                    <div className={styles.cardValue}>{summary.pendingOrders}</div>
                </div>
            </div>

            {/* Orders Table */}
            <div className={styles.tableSection}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}><input type="checkbox" className={styles.checkbox} /></th>
                                <th>رقم الطلب</th>
                                <th>اسم العملية</th>
                                <th>نوع العملية</th>
                                <th>المبلغ</th>
                                <th>حالة الطلب</th>
                                <th>تاريخ بدأ العملية</th>
                                <th>تاريخ انتهاء العملية</th>
                                <th>الاجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td><input type="checkbox" className={styles.checkbox} /></td>
                                    <td>{order.orderNumber}</td>
                                    <td>{order.processName}</td>
                                    <td>{order.processType}</td>
                                    <td>{order.amount} ر.س</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${order.status === 'completed' ? styles.statusCompleted : styles.statusPending
                                            }`}>
                                            {order.statusLabel}
                                        </span>
                                    </td>
                                    <td>{order.startDate}</td>
                                    <td>{order.endDate}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                            </button>
                                            <button className={styles.actionBtn}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                            <button className={styles.actionBtn}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        {/* Adding a visual empty state or mock repeats to fill the table as in image if needed */}
                        {/* Repeating for visual match with image logic */}
                    </table>
                </div>
            </div>

        </div>
    );
}
