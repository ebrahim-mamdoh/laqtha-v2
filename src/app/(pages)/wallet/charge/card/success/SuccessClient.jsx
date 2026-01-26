'use client';

import React from 'react';
import styles from './success.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SuccessClient() {
    const router = useRouter();

    const handleNext = () => {
        // Navigate back to wallet or balance
        router.push('/wallet');
    };

    return (
        <div className={styles.pageContainer} dir="rtl">
            <h1 className={styles.title}>تمت عملية الشحن بنجاح</h1>

            <div className={styles.imageContainer}>
                <Image
                    src="/images/success-check.svg"
                    alt="Success"
                    width={150}
                    height={150}
                    priority
                />
            </div>

            <button className={styles.submitBtn} onClick={handleNext}>
                التالي
            </button>
        </div>
    );
}
