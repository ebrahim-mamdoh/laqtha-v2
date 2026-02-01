'use client';

import React, { useState } from 'react';
import styles from '../services.module.css';

export default function ServicesFilter() {
    const [search, setSearch] = useState('');

    return (
        <div className={styles.actionsBar}>
            {/* Note: RTL, so right-to-left order visually. Flex row means 1st is right-most in RTL? 
                Actually flex items follow DOM order. 
                In DOM: [Search] [Add Btn] [Filter Btn] 
                Screenshot shows: [Filter] [Add] [SPACE] [Search]
                Wait, screenshot RTL:
                Right side: Search Input
                Left side: Add Button, Filter Button (Icon)
                So in RTL:
                [Filter (Left)] [Add (Left)] ....space.... [Search (Right)]
                
                Let's arrange DOM: [Filter] [Add] [Search]
                Then use flex: space-between?
                Or two groups.
             */}

            {/* Left Group (visually left in RTL means end of flex container? No start is right. End is left.) */}
            {/* So to put items on Left: justify-content: flex-end? 
                 In RTL context: 
                 Start = Right
                 End = Left.
                 
                 Screenshot:
                 Right: Search Input "ابحث عن خدمة"
                 Middle: "اضافة خدمة جديدة" (Pink)
                 Left: Filter Icon Button
             */}

            <div className={styles.searchGroup}>
                <input
                    type="text"
                    placeholder="ابحث عن خدمة"
                    className={styles.searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className={styles.searchIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
            </div>

            <div className={styles.actionButtons}>
                <button className={`${styles.btn} ${styles.primaryBtn}`}>
                    اضافة خدمة جديدة
                </button>

                <button className={`${styles.btn} ${styles.secondaryBtn}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                    الاكثر طلبا
                </button>
            </div>

        </div>
    );
}
