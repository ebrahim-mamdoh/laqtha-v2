'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookie from 'js-cookie'; // Assuming js-cookie is installed or we use standard document.cookie
import styles from '../login.module.css';

export default function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/v2/partners/login`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'فشل تسجيل الدخول. تأكد من صحة البيانات.');
            }

            if (data.success && data.data?.tokens) {
                // Securely store tokens (HttpOnly cookies would be better server-side, but client-side is often needed for simple JWT flows)
                // For security, it's best to store in memory or HttpOnly cookies. Here we use Cookies/LocalStorage as per common client patterns.
                Cookie.set('partner_accessToken', data.data.tokens.accessToken, { expires: 1 }); // 1 day
                Cookie.set('partner_refreshToken', data.data.tokens.refreshToken, { expires: 7 }); // 7 days

                // Also allow local storage for easy access in non-cookie environments if needed, but Cookie is preferred for middleware.
                localStorage.setItem('partner_token', data.data.tokens.accessToken);

                // Redirect based on state
                const state = data.data.partner.state;
                if (state === 'pending_otp') {
                    router.push(`/partner/otp?email=${encodeURIComponent(formData.email)}`);
                } else if (state === 'approved' || state === 'pending_approval' || state === 'changes_required') {
                    // Pending approval partners can still access the dashboard to see their status
                    router.push('/partner/dashboard');
                } else {
                    router.push('/partner/dashboard');
                }
            } else {
                throw new Error(data.message || 'حدث خطأ غير متوقع');
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.inputGroup}>
                <label className={styles.label}>البريد الإلكتروني</label>
                <input
                    type="email"
                    name="email"
                    className={styles.input}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>كلمة المرور</label>
                <div className={styles.passwordWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={styles.passwordInput}
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
            >
                {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>

            <div className={styles.footerLinks}>
                <Link href="/partner/reset-password" className={styles.link}>
                    نسيت كلمة المرور؟
                </Link>
                <span>
                    ليس لديك حساب؟{' '}
                    <Link href="/partner/register" className={styles.link}>
                        انضم كشريك الآن
                    </Link>
                </span>
            </div>
        </form>
    );
}
