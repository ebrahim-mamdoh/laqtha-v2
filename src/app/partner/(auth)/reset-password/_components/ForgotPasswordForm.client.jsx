'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../login/login.module.css'; // Reusing login styles


import apiClient from '@/lib/api';

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiClient.post('/v2/partners/forgot-password', { email });
            const data = response.data;

            if (data.success) {
                setSuccess(data.message);
                // Redirect to the reset confirmation page
                setTimeout(() => {
                    router.push(`/partner/reset-password/confirm?email=${encodeURIComponent(email)}`);
                }, 1500);
            } else {
                throw new Error(data.message || 'حدث خطأ غير متوقع');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ أثناء إرسال الطلب';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div style={{
                background: 'rgba(46, 204, 113, 0.1)',
                color: '#2ecc71',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(46, 204, 113, 0.2)',
                fontSize: '0.9rem',
                textAlign: 'center'
            }}>{success}</div>}

            <div className={styles.inputGroup}>
                <label className={styles.label}>البريد الإلكتروني</label>
                <input
                    type="email"
                    name="email"
                    className={styles.input}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
            >
                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
            </button>

            <div className={styles.footerLinks}>
                <Link href="/partner/login" className={styles.link}>
                    العودة لتسجيل الدخول
                </Link>
            </div>
        </form>
    );
}
