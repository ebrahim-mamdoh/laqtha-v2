'use client';

import React, { useState } from 'react';
import styles from '../profile.module.css';
import apiClient from '@/lib/api';

export default function ProfileForm({ initialData }) {
    const [formData, setFormData] = useState({
        ...initialData
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const partner = formData?.data?.partner || {};

    // Helper to update nested state
    const updateField = (path, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            // Simple deep update for specific known paths
            if (path.startsWith('contactPerson.')) {
                const field = path.split('.')[1];
                newData.data.partner.contactPerson = {
                    ...newData.data.partner.contactPerson,
                    [field]: value
                };
            } else if (path.startsWith('address.')) {
                const field = path.split('.')[1];
                newData.data.partner.address = {
                    ...newData.data.partner.address,
                    [field]: value
                };
            } else {
                newData.data.partner[path] = value;
            }
            return newData;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateField(name, value);
    };


    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const response = await apiClient.put('/v2/partners/me', formData.data.partner);

            if (response.status === 200 || response.status === 201) {
                setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح' });
            }
        } catch (error) {
            console.error('Save error:', error);
            const errorText = error.response?.data?.message || 'فشل الحفظ';
            setMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            {loading && (
                <div className={styles.loadingOverlay}>
                    <div style={{ color: '#fff' }}>جاري الحفظ...</div>
                </div>
            )}

            <header className={styles.header}>
                <h1 className={styles.title}>الملف الشخصي</h1>
            </header>

            <div className={styles.layoutGrid}>
                {/* Right Column (RTL Start) - Profile Summary */}
                <aside>
                    <div className={styles.profileCard}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatarIcon}>
                                {/* Camera/User Icon Placeholder */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <button className={styles.cameraButton} type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            </button>
                        </div>

                        <div className={styles.profileName}>{partner.businessName || 'اسم المنشأة'}</div>

                        <div className={styles.profileMetaBox}>
                            {partner.businessType === 'hotel' ? 'فندق' : partner.businessType || 'نوع النشاط'}
                        </div>

                        <div className={styles.profileMetaBox}>
                            {partner.address?.country || 'الدولة'}
                        </div>

                        <div className={styles.profileMetaBox}>
                            {partner.website || 'الموقع الإلكتروني'}
                        </div>

                        <button
                            className={styles.saveButton}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            حفظ
                        </button>

                        {message && (
                            <div style={{
                                marginTop: '1rem',
                                color: message.type === 'success' ? '#00ff88' : '#ff0055',
                                fontSize: '0.9rem'
                            }}>
                                {message.text}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Left Column (RTL End) - Forms */}
                <main>
                    {/* Facility Information */}
                    <section className={styles.sectionCard}>
                        <h2 className={styles.sectionTitle}>معلومات المنشأة</h2>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>البريد الالكتروني</label>
                            <input
                                type="email"
                                name="email"
                                value={partner.email || ''}
                                onChange={handleChange}
                                className={styles.input}
                                disabled // Usually email is not editable directly or requires verification
                                dir="ltr"
                                style={{ textAlign: 'right' }}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>اسم المنشأة</label>
                            <input
                                type="text"
                                name="businessName"
                                value={partner.businessName || ''}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>نوع النشاط</label>
                            <select
                                name="businessType"
                                value={partner.businessType || ''}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="hotel">فندق</option>
                                <option value="apartment">شقة فندقية</option>
                                <option value="resort">منتجع</option>
                                <option value="other">أخرى</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>الموقع الالكتروني ( اختياري )</label>
                            <input
                                type="url"
                                name="website"
                                value={partner.website || ''}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="https://example.com"
                                dir="ltr"
                                style={{ textAlign: 'right' }}
                            />
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className={styles.sectionCard}>
                        <h2 className={styles.sectionTitle}>معلومات الاتصال</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>الاسم الاول</label>
                                <input
                                    type="text"
                                    name="contactPerson.firstName"
                                    value={partner.contactPerson?.firstName || ''}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>اسم العائلة</label>
                                <input
                                    type="text"
                                    name="contactPerson.lastName"
                                    value={partner.contactPerson?.lastName || ''}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>رقم الهاتف</label>
                            <input
                                type="tel"
                                name="phone"
                                value={partner.phone || ''}
                                onChange={handleChange}
                                className={styles.input}
                                dir="ltr"
                                style={{ textAlign: 'right' }}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>الدولة</label>
                            <input
                                type="text"
                                name="address.country"
                                value={partner.address?.country || ''}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>المدينة</label>
                            <input
                                type="text"
                                name="address.city"
                                value={partner.address?.city || ''}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>الشارع</label>
                            <input
                                type="text"
                                name="address.street"
                                value={partner.address?.street || ''}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>الرمز البريدي</label>
                            <input
                                type="text"
                                name="address.postalCode"
                                value={partner.address?.postalCode || ''}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                    </section>
                </main>
            </div>
        </div>
    );
}
