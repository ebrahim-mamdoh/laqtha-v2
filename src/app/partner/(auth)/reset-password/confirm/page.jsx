import React from 'react';
import ResetPasswordForm from './_components/ResetPasswordForm.client';

// Reuse styles from login for consistency
import styles from '../../login/login.module.css';

export const metadata = {
    title: 'تعيين كلمة المرور الجديدة | لقطها',
    description: 'قم بتعيين كلمة مرور جديدة لحسابك.',
};

export default function ConfirmResetPage({ searchParams }) {
    const email = searchParams?.email || '';

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>تعيين كلمة المرور</h1>
                    <p className={styles.subtitle}>
                        أدخل رمز التحقق وكلمة المرور الجديدة
                    </p>
                </header>

                <ResetPasswordForm email={email} />
            </div>
        </div>
    );
}
