import React from 'react';
import LoginForm from './_components/LoginForm.client';
import styles from './login.module.css';

export const metadata = {
    title: 'تسجيل دخول الشركاء | لقطها',
    description: 'سجل الدخول إلى لوحة تحكم الشركاء لإدارة خدماتك وعروضك.',
};

export default function PartnerLoginPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>بوابة الشركاء</h1>
                    <p className={styles.subtitle}>
                        سجل الدخول للمتابعة إلى لوحة التحكم
                    </p>
                </header>

                <LoginForm />
            </div>
        </div>
    );
}
