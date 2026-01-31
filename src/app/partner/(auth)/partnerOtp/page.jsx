import React from 'react';
import OtpForm from './_components/OtpForm.client';
import styles from './otp.module.css';

export const metadata = {
    title: 'التحقق من البريد الإلكتروني | لقطها',
    description: 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني لإكمال التسجيل.',
};

export default function OtpPage({ searchParams }) {
    const email = searchParams?.email || '';

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>التحقق من الحساب</h1>
                    <p className={styles.subtitle}>
                        تم إرسال رمز التحقق إلى بريدك الإلكتروني<br />
                        <span style={{ color: '#fff', fontSize: '1.1rem' }}>{email}</span>
                    </p>
                </header>

                <OtpForm email={email} />
            </div>
        </div>
    );
}
