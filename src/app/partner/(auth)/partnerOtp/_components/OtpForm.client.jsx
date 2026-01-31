'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../otp.module.css';

export default function OtpForm({ email }) {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timer, setTimer] = useState(60); // 60 seconds countdown
    const inputRefs = useRef([]);

    useEffect(() => {
        // Focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        // Allow only numbers
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto move to next input
        if (value !== '' && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace: move to prev input
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < 4) newOtp[i] = char;
        });
        setOtp(newOtp);

        // Focus appropriate input
        if (pastedData.length === 4) {
            inputRefs.current[3].focus();
        } else {
            inputRefs.current[pastedData.length].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 4) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/v2/partners/verify-otp`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otpValue }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'فشل التحقق من الرمز.');
            }

            if (data.success) {
                setSuccess(data.message);
                // Redirect to login after short delay
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

    const handleResend = async () => {
        if (timer > 0) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/v2/partners/resend-otp`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(data.message || 'تم إرسال الرمز بنجاح');
                setTimer(60); // Reset timer
            } else {
                throw new Error(data.message || 'فشل إرسال الرمز');
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
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.inputGroup}>
                <label className={styles.label}>أدخل الرمز المكون من 4 أرقام</label>
                <div className={styles.otpContainer} onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            className={styles.otpInput}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            disabled={loading}
                            autoComplete="one-time-code"
                            inputMode="numeric"
                        />
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || otp.join('').length !== 4}
            >
                {loading ? 'جاري التحقق...' : 'تأكيد'}
            </button>

            <button
                type="button"
                className={styles.resendBtn}
                onClick={handleResend}
                disabled={timer > 0 || loading}
            >
                {timer > 0
                    ? `إعادة الإرسال خلال ${timer} ثانية`
                    : 'إعادة إرسال الرمز'}
            </button>
        </form>
    );
}
