'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../register.module.css';

const BUSINESS_TYPES = [
    { value: 'hotel', label: 'فندق (Hotel)' },
    { value: 'restaurant', label: 'مطعم (Restaurant)' },
    { value: 'cafe', label: 'مقهى (Cafe)' },
    { value: 'resort', label: 'منتجع (Resort)' },
    { value: 'other', label: 'أخرى (Other)' },
];

export default function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        // Account
        email: '',
        password: '',

        // Business
        businessName: '',
        businessType: '',
        description: '',
        website: '',

        // Contact
        firstName: '',
        lastName: '',
        phone: '',

        // Address
        country: '',
        city: '',
        street: '',
        postalCode: ''
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

        // Prepare API Payload structure
        const payload = {
            email: formData.email,
            password: formData.password,
            businessName: formData.businessName,
            businessType: formData.businessType,
            contactPerson: {
                firstName: formData.firstName,
                lastName: formData.lastName
            },
            phone: formData.phone,
            address: {
                country: formData.country,
                city: formData.city,
                street: formData.street,
                postalCode: formData.postalCode
            },
            description: formData.description,
            website: formData.website || undefined // Send undefined if empty to avoid empty string validation issues
        };

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/v2/partners/register`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'فشل التسجيل. يرجى التحقق من البيانات.');
            }

            if (data.success) {
                // Redirect to OTP page
                // Assuming OTP page is at /partner/otp and takes email as query param
                router.push(`/partner/partnerOtp?email=${encodeURIComponent(formData.email)}`);
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

            {/* 1. Account Info */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>معلومات الحساب</h2>
                    <p className={styles.sectionDesc}>قم بتسجيل معلومات حسابك</p>
                </div>

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
                    <input
                        type="password"
                        name="password"
                        className={styles.input}
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                    />
                    <span className={styles.helperText}>كلمة المرور يجب أن تحتوي على 8 حروف انجليزية، أرقام، ورموز</span>
                </div>
            </section>

            {/* 2. Business Project Info */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>معلومات المشروع</h2>
                    <p className={styles.sectionDesc}>قم بتسجيل معلومات مشروعك بعناية</p>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>اسم المشروع</label>
                    <input
                        type="text"
                        name="businessName"
                        className={styles.input}
                        placeholder="مثال: فندق النخيل"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>مجال المشروع</label>
                    <select
                        name="businessType"
                        className={`${styles.input} ${styles.select}`}
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>اختر المجال</option>
                        {BUSINESS_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>وصف المشروع</label>
                    <textarea
                        name="description"
                        className={styles.input}
                        placeholder="وصف مبسط عن مشروعك..."
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>الموقع الالكتروني ( اختياري )</label>
                    <input
                        type="url"
                        name="website"
                        className={styles.input}
                        placeholder="https://www.example.com"
                        value={formData.website}
                        onChange={handleChange}
                    />
                </div>
            </section>

            {/* 3. Contact & Address (Additional Fields per API) */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>بيانات التواصل والعنوان</h2>
                    <p className={styles.sectionDesc}>للتواصل وإثبات ملكية المشروع</p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>الاسم الأول</label>
                        <input
                            type="text"
                            name="firstName"
                            className={styles.input}
                            placeholder="أحمد"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>الاسم الأخير</label>
                        <input
                            type="text"
                            name="lastName"
                            className={styles.input}
                            placeholder="محمد"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>رقم الجوال</label>
                    <input
                        type="tel"
                        name="phone"
                        className={styles.input}
                        placeholder="+96650xxxxxxx"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        dir="ltr"
                        style={{ textAlign: 'right' }}
                    />
                </div>

                <div className={styles.grid}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>الدولة</label>
                        <input
                            type="text"
                            name="country"
                            className={styles.input}
                            placeholder="السعودية"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>المدينة</label>
                        <input
                            type="text"
                            name="city"
                            className={styles.input}
                            placeholder="الرياض"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>الشارع</label>
                        <input
                            type="text"
                            name="street"
                            className={styles.input}
                            placeholder="اسم الشارع"
                            value={formData.street}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>الرمز البريدي</label>
                        <input
                            type="text"
                            name="postalCode"
                            className={styles.input}
                            placeholder="12345"
                            value={formData.postalCode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </section>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
            >
                {loading ? 'جاري التسجيل...' : 'التالي'}
            </button>
        </form>
    );
}
