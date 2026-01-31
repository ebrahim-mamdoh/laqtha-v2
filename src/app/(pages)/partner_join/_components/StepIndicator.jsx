import React from 'react';
import styles from '../partner.module.css';
import { motion } from 'framer-motion';

export default function StepIndicator({ currentStep }) {
    const steps = [
        { id: 1, label: "المعلومات الأساسية" },
        { id: 2, label: "تفاصيل الخدمة" },
        { id: 3, label: "الدفع والإرسال" }
    ];

    // Calculate progress width
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className={styles.indicatorWrapper}>
            <div className={styles.progressTrack}>
                <motion.div
                    className={styles.progressBar}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            {steps.map((step) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                    <div key={step.id} className={styles.stepItem}>
                        <motion.div
                            className={`${styles.stepNode} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
                            animate={{ scale: isActive ? 1.2 : 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {isCompleted ? '✓' : step.id}
                        </motion.div>
                        <span className={`${styles.stepLabel} ${isActive ? styles.activeLabel : ''}`}>{step.label}</span>
                    </div>
                );
            })}
        </div>
    );
}
