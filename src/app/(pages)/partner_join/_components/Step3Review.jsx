import React, { useState } from 'react';
import styles from '../partner.module.css';

export default function Step3Review({ formData, onBack, onSubmit }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { basic_info, service_details } = formData;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        onSubmit(formData);
        setIsSubmitting(false);
    };

    return (
        <div>
            <h2 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--color-white)' }}>Review Your Application</h2>

            <div className={styles.reviewCard}>
                <h3 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-accent)' }}>Basic Information</h3>
                <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Business Name</span>
                    <span className={styles.reviewValue}>{basic_info.businessName}</span>
                </div>
                <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Email</span>
                    <span className={styles.reviewValue}>{basic_info.email}</span>
                </div>
                <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Phone</span>
                    <span className={styles.reviewValue}>{basic_info.phone}</span>
                </div>
                <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>City</span>
                    <span className={styles.reviewValue}>{basic_info.city}</span>
                </div>
            </div>

            <div className={styles.reviewCard}>
                <h3 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-accent)' }}>Service Details</h3>
                <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Type</span>
                    <span className={styles.reviewValue}>{service_details.serviceType}</span>
                </div>
                <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Capacity</span>
                    <span className={styles.reviewValue}>{service_details.capacity} Clients</span>
                </div>
                <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Description</span>
                    <span className={styles.reviewValue} style={{ maxWidth: '60%', textAlign: 'right' }}>{service_details.description}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </div>
        </div>
    );
}
