import React from 'react';
import styles from './dashboard.module.css';
import Sidebar from './_components/Sidebar.client';

export const metadata = {
    title: 'لوحة التحكم - شريك لقطها',
    description: 'لوحة تحكم الشركاء لادارة الخدمات والطلبات'
};

export default function DashboardLayout({ children }) {
    return (
        <div className={styles.layoutContainer}>
            <Sidebar />

            <main className={styles.mainContent}>
                {/* Header could be a component, but let's put the structure here or make a simple Header component */}
                <header className={styles.headerWrapper}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                            <img src="https://ui-avatars.com/api/?name=Partner&background=random" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        {/* Notification Bell */}
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#f500a2', borderRadius: '50%' }}></span>
                        </div>
                    </div>

                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>شريك لقطها</div>
                </header>

                <div className={styles.pageContent}>
                    {children}
                </div>
            </main>
        </div>
    );
}
