'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../register.module.css';




import apiClient from '@/lib/api';

export default function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // Global error
    const [fieldErrors, setFieldErrors] = useState({}); // Field-level errors
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        // Account
        email: '',
        password: '',

        // Business
        businessName: '',
        serviceTypeKey: '',
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

    const [serviceTypes, setServiceTypes] = useState([]);

    React.useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await apiClient.get('/service-types');
                const result = response.data;
                if (result.success && Array.isArray(result.data)) {
                    setServiceTypes(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch service types:', error);
            }
        };

        fetchServiceTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear specific field error when user types
        setFieldErrors(prev => ({
            ...prev,
            [name]: undefined
        }));

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        // Prepare API Payload structure
        const payload = {
            email: formData.email,
            password: formData.password,
            businessName: formData.businessName,
            serviceTypeKey: formData.serviceTypeKey,
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
            website: formData.website || undefined
        };

        try {
            const response = await apiClient.post('/partners/register', payload);
            const data = response.data;

            if (data.success) {
                router.push(`/partner/partnerOtp?email=${encodeURIComponent(formData.email)}`);
            } else {
                throw new Error(data.message || 'حدث خطأ غير متوقع');
            }

        } catch (err) {
            const data = err.response?.data;
            if (data) {
                // Handle Backend Validation Errors
                if (data.errors) {
                    setFieldErrors(data.errors);
                }
                setError(data.message || 'فشل التسجيل. يرجى التحقق من البيانات.');
            } else {
                setError(err.message || 'حدث خطأ في الاتصال');
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper for error style
    const errorStyle = { color: '#ff3b30', fontSize: '0.8rem', marginTop: '4px', display: 'block' };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {/* Global Error Display */}
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
                    {fieldErrors.email && <span style={errorStyle}>{fieldErrors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>كلمة المرور</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className={styles.passwordInput}
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            )}
                        </button>
                    </div>
                    {fieldErrors.password && <span style={errorStyle}>{fieldErrors.password}</span>}
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
                    {fieldErrors.businessName && <span style={errorStyle}>{fieldErrors.businessName}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>مجال المشروع</label>
                    <select
                        name="serviceTypeKey"
                        className={`${styles.input} ${styles.select}`}
                        value={formData.serviceTypeKey}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>اختر المجال</option>
                        {serviceTypes.length > 0 ? (
                            serviceTypes.map(type => (
                                <option key={type.key} value={type.key}>{type.label}</option>
                            ))
                        ) : (
                            <option value="" disabled>جاري تحميل المجالات...</option>
                        )}
                    </select>
                    {fieldErrors.serviceTypeKey && <span style={errorStyle}>{fieldErrors.serviceTypeKey}</span>}
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
                    {fieldErrors.description && <span style={errorStyle}>{fieldErrors.description}</span>}
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
                    {fieldErrors.website && <span style={errorStyle}>{fieldErrors.website}</span>}
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
                        {fieldErrors.firstName && <span style={errorStyle}>{fieldErrors.firstName}</span>}
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
                        {fieldErrors.lastName && <span style={errorStyle}>{fieldErrors.lastName}</span>}
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
                    {fieldErrors.phone && <span style={errorStyle}>{fieldErrors.phone}</span>}
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
                        {fieldErrors.country && <span style={errorStyle}>{fieldErrors.country}</span>}
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
                        {fieldErrors.city && <span style={errorStyle}>{fieldErrors.city}</span>}
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
                        {fieldErrors.street && <span style={errorStyle}>{fieldErrors.street}</span>}
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
                        {fieldErrors.postalCode && <span style={errorStyle}>{fieldErrors.postalCode}</span>}
                    </div>
                </div>
            </section>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
            >
                {loading ? 'جاري التسجيل...' : 'انشاء حساب'}
            </button>

            <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#a0a0b0', textAlign: 'center', lineHeight: '1.5' }}>
                بمجرد الضغط على زر انشاء الحساب فانت توافق تلقائيا على <Link href="/privacy" className={styles.link}>سياسة الخصوصية</Link> و <Link href="/terms" className={styles.link}>شروط الاستخدام</Link>
            </p>

            <div className={styles.footerLinks}>
                <span>
                    لديك حساب بالفعل؟{' '}
                    <Link href="/partner/login" className={styles.link}>
                        تسجيل الدخول
                    </Link>
                </span>
            </div>
        </form>
    );
}
