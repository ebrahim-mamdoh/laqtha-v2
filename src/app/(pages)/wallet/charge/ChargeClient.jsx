"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './charge.module.css';
import { VisaIcon, MasterCardIcon } from '../components/WalletIcons';

export default function ChargeClient() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState('card'); // 'card' | 'faz3a'

    const handleSelect = (method) => {
        // Prevent selection if disabled
        if (method === 'faz3a') return;
        setSelectedMethod(method);
    };

    const handleSubmit = () => {
        if (selectedMethod === 'card') {
            router.push('/wallet/charge/card');
        }
    };

    return (
        <div className={styles.pageContainer} dir="rtl">
            <h1 className={styles.title}>قم بتحديد وسيلة الشحن</h1>

            <div className={styles.optionsGroup}>
                {/* Option 1: Bank Card */}
                <div
                    className={`${styles.optionCard} ${selectedMethod === 'card' ? styles.selected : ''}`}
                    onClick={() => handleSelect('card')}
                    role="radio"
                    aria-checked={selectedMethod === 'card'}
                    tabIndex={0}
                >
                    <div className={styles.radioWrapper}>
                        <div className={styles.radioCircle}>
                            <div className={styles.radioInner} />
                        </div>
                        <div className={styles.labelInfo}>
                            <span className={styles.labelText}>بطاقة بنكية</span>
                        </div>
                    </div>

                    <div className={styles.icons}>
                        <MasterCardIcon />
                        <VisaIcon />
                    </div>
                </div>

                {/* Option 2: Faz3a (Disabled) */}
                <div
                    className={`${styles.optionCard} ${styles.disabled}`}

                    role="radio"
                    aria-checked={false}
                    aria-disabled="true"
                >
                    <div className={styles.radioWrapper}>
                        <div className={styles.radioCircle}>
                            {/* Empty when not selected */}
                        </div>
                        <div className={styles.labelInfo}>
                            <span className={styles.labelText}>الشحن من خلال فزعة</span>
                            <span className={styles.subText}>هذه الخدمة غير متوفرة في الوقت الحالي</span>
                        </div>
                    </div>
                    {/* No icons for Faz3a in design */}
                </div>
            </div>

            <button className={styles.submitBtn} onClick={handleSubmit}>
                اختار
            </button>
        </div>
    );
}
