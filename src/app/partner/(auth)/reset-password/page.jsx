import React from 'react';
import ForgotPasswordForm from './_components/ForgotPasswordForm.client';
import styles from '../login/login.module.css'; // Reusing login styles

export const metadata = {
    title: 'استعادة كلمة المرور | لقطها',
    description: 'أدخل بريدك الإلكتروني لاستلام رمز إعادة تعيين كلمة المرور.',
};

export default function ForgotPasswordPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>استعادة كلمة المرور</h1>
                    <p className={styles.subtitle}>
                        أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور
                    </p>
                </header>

                <ForgotPasswordForm />
            </div>
        </div>
    );
}
