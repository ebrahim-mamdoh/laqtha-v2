'use client';

import React, { useState } from 'react';
import styles from './card.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CardClient() {
    const router = useRouter(); // Initialize router

    // Form State
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('MOHAMED DAHAM');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [amount, setAmount] = useState('3000');

    const handlePay = () => {
        // DEV MODE: Skipping validation as requested for easy development
        // if (!cardNumber || !expiry || !cvc) { return; }

        console.log("Processing Payment (Simulated)...", { cardNumber, expiry, cvc });

        // Redirect to Verify Page
        router.push('/wallet/charge/card/verify');
    };

    return (
        <div className={styles.pageContainer} dir="rtl">
            <h1 className={styles.title}>قم بتحديد وسيلة الشحن</h1>

            <div className={styles.formContainer}>
                {/* Logo */}
                <div className={styles.logoContainer}>
                    <div style={{ transform: 'scale(1.2)' }}>
                        <Image
                            src="/images/master_card.svg"
                            alt="MasterCard"
                            width={80}
                            height={50}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>

                {/* ROW: Card Number (Right) & CVC (Left) */}
                <div className={styles.row}>
                    {/* 1. Card Number (Right) */}
                    <div className={styles.colGrow}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>رقم البطاقة</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1243 7648 3874 9982"
                                dir="ltr"
                                style={{ textAlign: 'right' }}
                            />
                        </div>
                    </div>

                    {/* 2. CVC (Left) */}
                    <div className={styles.colFixed}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>CVC</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                placeholder="345"
                                maxLength={4}
                                dir="ltr"
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Card Holder */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>اسم صاحب البطاقة</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="MOHAMED DAHAM"
                        style={{ textTransform: 'uppercase' }}
                    />
                </div>

                {/* Expiry Date */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>تاريخ انتهاء الصلاحية</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="اليوم/الشهر/السنة"
                    />
                </div>

                {/* Amount */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>المبلغ المرغوب</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="3000"
                        dir="ltr"
                        style={{ textAlign: 'right' }}
                    />
                </div>

                <button className={styles.submitBtn} onClick={handlePay}>
                    اختيار
                </button>
            </div>
        </div>
    );
}
