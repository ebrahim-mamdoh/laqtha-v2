'use client';

import React from 'react';
import styles from '../comments.module.css';

export default function CommentsDashboard({ initialComments }) {
    const [activeTab, setActiveTab] = React.useState('all');

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.pageTitle}>التعليقات</h1>
                    <p className={styles.subTitle}>يمكنك التفاعل مع تقييمات وتعليقات العملاء، بما في ذلك الرد عليها</p>
                </div>
            </div>

            {/* Tabs - Ordered for RTL Right-to-Left: All (Rightmost), Unread (Left of All) */}
            <div className={styles.tabsContainer}>
                <button
                    className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    الكل <span className={styles.badge}>27</span>
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'unread' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('unread')}
                >
                    غير المقروءة <span className={styles.badge}>01</span>
                </button>
            </div>

            {/* Comments List */}
            <div className={styles.commentsList}>
                {initialComments.map((comment) => (
                    <div key={comment.id} className={styles.commentCard}>
                        {/* Header: Avatar (Right), Info (Left of Avatar) */}
                        <div className={styles.cardHeader}>
                            {/* Avatar First in DOM for RTL Flex Start (Right) */}
                            <div className={styles.userAvatar} style={{ background: '#333', overflow: 'hidden' }}>
                                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#555" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#2a2a2a" /><circle cx="12" cy="12" r="5" fill="#555" /><path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="#555" strokeWidth="2" /></svg>
                            </div>

                            <div className={styles.userInfo}>
                                {/* Info children ordered for RTL Flex Start (Right to Left): Name -> Rating -> Stars */}
                                <span className={styles.userName}>{comment.userName}</span>
                                <span className={styles.ratingInfo}>
                                    تقييم على : "{comment.itemName}"
                                </span>
                                <span className={styles.stars}>★★★★★</span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className={styles.commentBody}>
                            {comment.text}
                        </div>

                        {/* Actions (Left Side) */}
                        <div className={styles.cardActions}>
                            {/* In RTL Flex End (Left), items packed: [Item1 (Right), Item2 (Left)]? No wait. 
                                Flex End (Left):
                                Items [A, B] -> B is Leftmost. A is Right of B.
                                Desired: [Delete (Left)] [Reply (Right)].
                                So B = Delete, A = Reply.
                                Array: [Reply, Delete].
                             */}
                            <button className={styles.actionBtn}>الرد</button>
                            <button className={styles.actionBtn}>حذف</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                <button className={styles.pageBtn}>&lt;</button>
                <button className={styles.pageBtn}>4</button>
                <button className={styles.pageBtn}>3</button>
                <button className={styles.pageBtn}>2</button>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>&gt;</button>
            </div>
        </div>
    );
}
