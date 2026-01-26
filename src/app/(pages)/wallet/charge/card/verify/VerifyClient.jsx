'use client';

import React, { useState } from 'react';
import styles from './verify.module.css';
import { useRouter } from 'next/navigation';

export default function VerifyClient() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleNext = () => {
        // Validation skipped for dev
        router.push('/wallet/charge/card/success');
    };

    return (
        <div className={styles.pageContainer} dir="rtl">
            <div className={styles.textGroup}>
                <h2 className={styles.title}>قد قمنا بارسال رمز التحقق اليك المرجو التحقق</h2>
                <h2 className={styles.title}>منه في بريدك الاليكتروني</h2>
            </div>

            <div className={styles.otpContainer}>
                {otp.map((data, index) => (
                    <input
                        className={styles.otpInput}
                        type="text"
                        name="otp"
                        maxLength="1"
                        key={index}
                        value={data}
                        onChange={e => handleChange(e.target, index)}
                        onFocus={e => e.target.select()}
                    />
                ))}
            </div>

            <div className={styles.helpLinks}>
                <span className={styles.notReceived}>لم اتوصل بالرمز ؟</span>
                <button className={styles.resendBtn}>اعادة ارسال رمز التحقق</button>
            </div>

            <button className={styles.submitBtn} onClick={handleNext}>
                التالي
            </button>
        </div>
    );
}
