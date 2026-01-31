import React from 'react';
import PartnerWizard from './_components/PartnerWizard';
import styles from './partner.module.css';

export const metadata = {
  title: 'Join as a Partner | Laqetha',
  description: 'Become a partner with Laqetha and grow your business.',
};

export default function PartnerPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>الانضمام كشريك</h1>
          <p className={styles.subtitle}>مرحباً بكم في برنامج الشركاء مع لقطها<br />المرجو ملء بياناتكم بعناية</p>
        </header>
        <PartnerWizard />
      </div>
    </div>
  );
}
