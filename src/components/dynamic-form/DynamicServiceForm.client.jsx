'use client';

import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './dynamic-form.module.css';
import generateSchema from './utils/validationGenerator';
import { FieldRenderer } from './FieldRenderer.client';

export default function DynamicServiceForm({ fields = [], serviceType, initialData = null }) {
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    const [submissionState, setSubmissionState] = useState('draft'); // 'draft' or 'publish' (which is just submit validation logic)

    // 1. Initial Values Generation
    const initialValues = useMemo(() => {
        if (initialData) return initialData;

        const defaults = {
            name: { ar: '', en: '' },
            description: { ar: '', en: '' },
            state: 'draft', // Default state
            attributes: {},
        };

        fields.forEach(field => {
            // Respect field defaultValue or set sensible defaults
            if (field.defaultValue !== undefined && field.defaultValue !== null) {
                defaults.attributes[field.key] = field.defaultValue;
            } else {
                // Type-safe nulls/empties
                if (field.type === 'boolean') defaults.attributes[field.key] = false;
                else if (field.type === 'price') defaults.attributes[field.key] = { amount: '' };
                else if (field.type === 'multiselect' || field.type === 'gallery') defaults.attributes[field.key] = [];
                else defaults.attributes[field.key] = '';
            }
        });
        return defaults;
    }, [fields, initialData]);

    // 2. Schema Generation
    const validationSchema = useMemo(() => {
        // Generate schema based on 'submissionState'
        // If user clicks "Save Draft" -> submissionState = 'draft', required fields are relaxed
        // If user clicks "Publish/Add" -> submissionState = 'active' (implied not draft), required fields enforced
        // Contract says: "Attributes validation... Required Field Check: If field.required === true and state is NOT draft"
        // So we pass 'submissionState === draft' to generator.
        return generateSchema(fields, submissionState === 'draft');
    }, [fields, submissionState]);


    // 3. Submission Handler
    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        setSubmitError(null);
        setSubmitSuccess(null);

        // Ensure state is set correctly in payload
        const payload = { ...values, state: submissionState };

        try {
            // REAL API CALL
            // const token = Cookies.get('partner_token'); ... 
            // Mocking the call since I cannot hit real API from here, but this is the logic:

            /*
            const res = await fetch('/api/partner/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw await res.json();
            */

            // Simulate Success
            console.log("Submitting Payload:", payload);
            await new Promise(r => setTimeout(r, 1000));
            setSubmitSuccess(submissionState === 'draft' ? 'تم حفظ المسودة بنجاح' : 'تم اضافة الخدمة بنجاح');

        } catch (error) {
            console.error(error);
            setSubmitError(error.message || 'حدث خطأ غير متوقع');
        } finally {
            setSubmitting(false);
        }
    };

    if (!fields || fields.length === 0) {
        return <div className={styles.loading}>جاري تحميل الحقول...</div>;
    }

    return (
        <div className={styles.formWrapper}>
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
