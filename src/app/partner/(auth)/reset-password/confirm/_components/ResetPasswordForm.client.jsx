'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../login/login.module.css'; // Reusing login styles

export default function ResetPasswordForm({ email }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: email || '',
        otp: ['', '', '', ''],
        newPassword: ''
    });

    const otpInputRefs = useRef([]);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...formData.otp];
        newOtp[index] = value;
        setFormData(prev => ({ ...prev, otp: newOtp }));

        if (value !== '' && index < 3) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            otpInputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...formData.otp];
        pastedData.split('').forEach((char, i) => {
            if (i < 4) newOtp[i] = char;
        });
        setFormData(prev => ({ ...prev, otp: newOtp }));

        if (pastedData.length === 4) otpInputRefs.current[3].focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = formData.otp.join('');

        if (otpValue.length !== 4) {
            setError('الرجاء إدخال الرمز كاملاً');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/v2/partners/reset-password`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otpValue,
                    newPassword: formData.newPassword
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'فشل إعادة تعيين كلمة المرور');
            }

            if (data.success) {
                setSuccess(data.message);
                setTimeout(() => {
                    router.push('/partner/login');
                }, 2000);
            } else {
                throw new Error(data.message || 'حدث خطأ غير متوقع');
            }

        } catch (err) {
            setError(err.message);
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
                    value={formData.email}
                    disabled
                    className={styles.input}
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>رمز التحقق</label>
                <div style={{ display: 'flex', gap: '10px', direction: 'ltr', justifyContent: 'center' }} onPaste={handlePaste}>
                    {formData.otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => otpInputRefs.current[index] = el}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className={styles.input}
                            style={{
                                width: '50px',
                                height: '50px',
                                textAlign: 'center',
                                fontSize: '1.2rem',
                                padding: 0
                            }}
                            required
                        />
                    ))}
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>كلمة المرور الجديدة</label>
                <div className={styles.passwordWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        className={styles.passwordInput}
                        placeholder="********"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        required
                        minLength={8}
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
                <span style={{ fontSize: '0.75rem', color: '#666' }}>
                    يجب أن تحتوي على 8 أحرف وأرقام ورموز
                </span>
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
            >
                {loading ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
            </button>
        </form>
    );
}
