'use client';

import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './dynamic-form.module.css';
import generateSchema from './utils/validationGenerator';
import { FieldRenderer } from './FieldRenderer.client';

import apiClient from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DynamicServiceForm({ fields = [], serviceType, initialData = null, source, debugError }) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    const [submissionState, setSubmissionState] = useState('draft');

    // 1. Initial Values Generation
    const initialValues = useMemo(() => {
        if (initialData) return initialData;

        const defaults = {
            name: { ar: '', en: '' },
            description: { ar: '', en: '' },
            state: 'draft',
            attributes: {},
        };

        fields.forEach(field => {
            if (field.defaultValue !== undefined && field.defaultValue !== null) {
                defaults.attributes[field.key] = field.defaultValue;
            } else {
                if (field.type === 'boolean') defaults.attributes[field.key] = false;
                else if (field.type === 'price') defaults.attributes[field.key] = { amount: '' };
                else if (field.type === 'multiselect' || field.type === 'gallery') defaults.attributes[field.key] = [];
                else defaults.attributes[field.key] = '';
            }
        });
        return defaults;
    }, [fields, initialData]);

    const validationSchema = useMemo(() => {
        return generateSchema(fields, submissionState === 'draft');
    }, [fields, submissionState]);


    // 3. Submission Handler
    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        setSubmitError(null);
        setSubmitSuccess(null);

        // Prepare attributes: Ensure empty strings for numbers are converted nicely or kept as per requirement.
        // Also handling boolean types if needed.
        const formattedAttributes = { ...values.attributes };

        fields.forEach(field => {
            const val = formattedAttributes[field.key];
            if (field.type === 'number' && val !== '' && val !== null && val !== undefined) {
                formattedAttributes[field.key] = Number(val);
            }
            if (field.type === 'boolean') {
                formattedAttributes[field.key] = Boolean(val);
            }
            // Add other type conversions if needed
        });

        // Construct Final Payload
        const payload = {
            name: values.name,
            description: values.description,
            attributes: formattedAttributes,
            state: submissionState, // Trust the local state which is updated by button click
            sortOrder: 1, // Default as requested
            isFeatured: false // Default as requested
        };

        try {
            const response = await apiClient.post('/partner/items', payload);

            if (response.data.success) {
                setSubmitSuccess(response.data.message || 'تم إنشاء العنصر بنجاح');
                console.log("Created successfully:", response.data.data);

                // Optional: Redirect after short delay or show a "Go to List" button
                // For now, keeping the success message visible.
                // router.push('/partner/dashboard/services'); 
            } else {
                setSubmitError(response.data.message || 'فشل في إنشاء العنصر');
            }

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (!fields || fields.length === 0) {
        return <div className={styles.loading}>جاري تحميل الحقول...</div>;
    }

    return (
        <div className={styles.formWrapper}>
            {/* Status Indicator */}
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: source === 'REAL_API' ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 171, 0, 0.05)',
                border: `1px solid ${source === 'REAL_API' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 171, 0, 0.15)'}`,
                borderRadius: '999px',
                marginBottom: '24px',
                backdropFilter: 'blur(8px)',
                boxShadow: `0 4px 20px -5px ${source === 'REAL_API' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 171, 0, 0.1)'}`
            }}>
                <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: source === 'REAL_API' ? '#00ff88' : '#ffab00',
                    boxShadow: `0 0 10px ${source === 'REAL_API' ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 171, 0, 0.5)'}`,
                    transition: 'all 0.3s ease'
                }} />

                <span style={{
                    color: source === 'REAL_API' ? '#00ff88' : '#ffab00',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    fontFamily: 'inherit'
                }}>
                    {source === 'REAL_API' ? 'متصل  ' : 'نمط البيانات التجريبية'}
                </span>

                {debugError && (
                    <span style={{
                        borderRight: '1px solid rgba(255,255,255,0.1)',
                        paddingRight: '8px',
                        marginRight: '8px',
                        color: '#ff4444',
                        fontSize: '0.75rem'
                    }}>
                        {debugError}
                    </span>
                )}
            </div>
            {serviceType && (
                <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem' }}>{serviceType.label?.ar} - محرك النموذج الديناميكي</h2>
                </div>
            )}

            {submitError && (
                <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid red', padding: '15px', borderRadius: '8px', color: 'red', marginBottom: '20px' }}>
                    {submitError}
                </div>
            )}

            {submitSuccess && (
                <div style={{ background: 'rgba(0,255,0,0.1)', border: '1px solid green', padding: '15px', borderRadius: '8px', color: '#00ff88', marginBottom: '20px' }}>
                    {submitSuccess}
                </div>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, isValid, errors, setFieldValue }) => (
                    <Form className={styles.formGrid}>
                        {/* Static Core Fields (Name, Description) */}
                        <div className={styles.fullWidth}>
                            <h3 style={{ color: '#d633c7', marginBottom: '15px' }}>معلومات أساسية</h3>
                        </div>

                        <div className={styles.fieldContainer}>
                            <label className={styles.label}>اسم العنصر (عربي) <span className={styles.requiredMark}>*</span></label>
                            <Field name="name.ar" className={`${styles.input} ${styles.rtlInput}`} placeholder="أدخل اسم العنصر بالعربية" />
                            <ErrorMessage name="name.ar" component="div" className={styles.errorText} />
                        </div>

                        <div className={styles.fieldContainer}>
                            <label className={styles.label}>اسم العنصر (انجليزي)</label>
                            <Field name="name.en" className={styles.input} placeholder="Enter item name in English" style={{ direction: 'ltr' }} />
                            <ErrorMessage name="name.en" component="div" className={styles.errorText} />
                        </div>

                        <div className={`${styles.fieldContainer} ${styles.fullWidth}`}>
                            <label className={styles.label}>وصف الخدمة (عربي)</label>
                            <Field as="textarea" name="description.ar" className={`${styles.input} ${styles.textarea} ${styles.rtlInput}`} placeholder="وصف عام للخدمة..." />
                            <ErrorMessage name="description.ar" component="div" className={styles.errorText} />
                        </div>

                        <div className={styles.fullWidth}>
                            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />
                            <h3 style={{ color: '#d633c7', marginBottom: '15px' }}>تفاصيل العنصر (ديناميكي)</h3>
                        </div>

                        {/* Rendering Loop */}
                        {fields.map((field) => (
                            <div key={field.key} className={field.type === 'textarea' || field.type === 'gallery' ? styles.fullWidth : ''}>
                                <Field name={`attributes.${field.key}`}>
                                    {({ field: fieldProps, form: formProps }) => (
                                        <FieldRenderer field={field} form={formProps} />
                                    )}
                                </Field>
                            </div>
                        ))}

                        {/* Actions */}
                        <div className={styles.fullWidth} style={{ marginTop: '20px' }}>
                            {/* Logic: Two buttons. 
                                1. Add Service (Active) -> sets state='inactive' or default, validates fully.
                                2. Save Draft -> sets state='draft', validates partially.
                             */}

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                onClick={() => {
                                    setSubmissionState('inactive'); // or whatever active state implies
                                    // Set state in formik
                                    setFieldValue('state', 'inactive');
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'جاري الاضافة...' : 'اضافة عنصر'}
                            </button>

                            <button
                                type="submit"
                                className={styles.draftBtn}
                                onClick={() => {
                                    setSubmissionState('draft');
                                    setFieldValue('state', 'draft');
                                }}
                                disabled={isSubmitting}
                            >
                                حفظ كمسودة
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
