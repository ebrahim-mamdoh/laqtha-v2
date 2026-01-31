import React from 'react';
import RegisterForm from './_components/RegisterForm.client';
import styles from './register.module.css';

export const metadata = {
    title: 'انضم كشريك | لقطها',
    description: 'سجل الآن وانضم إلى برنامج شركاء لقطها لزيادة مبيعاتك ونمو مشروعك.',
};

export default function PartnerRegisterPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>انضم الى برنامج الشركاء</h1>
                    <p className={styles.subtitle}>
                        انضم الى برنامجنا وجعل مشروعك ينمو أكثر، قم بتسجيل بياناتك للانضمام
                    </p>
                </header>

                <RegisterForm />
            </div>
        </div>
    );
}
