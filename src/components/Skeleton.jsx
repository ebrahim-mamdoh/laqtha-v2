// Skeleton loader components for better UX
import React from 'react';
import styles from './Skeleton.module.css';

export const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonText} style={{ width: '60%' }}></div>
    <div className={styles.skeletonText} style={{ width: '40%', marginTop: '8px' }}></div>
  </div>
);

export const SkeletonTable = () => (
  <div className={styles.skeletonTable}>
    {[...Array(5)].map((_, i) => (
      <div key={i} className={styles.skeletonRow}>
        <div className={styles.skeletonCell} style={{ width: '10%' }}></div>
        <div className={styles.skeletonCell} style={{ width: '20%' }}></div>
        <div className={styles.skeletonCell} style={{ width: '25%' }}></div>
        <div className={styles.skeletonCell} style={{ width: '15%' }}></div>
        <div className={styles.skeletonCell} style={{ width: '15%' }}></div>
        <div className={styles.skeletonCell} style={{ width: '15%' }}></div>
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className={styles.skeletonChart}>
    <div className={styles.skeletonCircle}></div>
  </div>
);
