'use client';
import React from 'react';
import styles from '../dynamic-form.module.css';
import { ErrorMessage } from 'formik';

// --- Price Field (Object { amount }) ---
// Supports only amount for now as per contract "Price with amount" usually implies currency is implicitly SAR or handled by backend.
// Contract "price" -> "object with amount".
export const PriceField = ({ field, form }) => {
    const isError = form.errors.attributes?.[field.key]?.amount && form.touched.attributes?.[field.key]?.amount;
    const value = form.values.attributes[field.key]?.amount || '';

    const handleChange = (e) => {
        form.setFieldValue(`attributes.${field.key}`, { amount: e.target.value });
    };

    return (
        <div className={styles.fieldContainer}>
            <label className={styles.label}>
                {field.label?.ar} {field.required && <span className={styles.requiredMark}>*</span>}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    type="number"
                    className={`${styles.input} ${isError ? styles.inputError : ''} ${styles.rtlInput}`}
                    placeholder={field.placeholder?.ar || '0.00'}
                    value={value}
                    onChange={handleChange}
                    onBlur={form.handleBlur} // Need to trigger touch manually for object?
                />
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}>ر.س</span>
            </div>
            <ErrorMessage name={`attributes.${field.key}.amount`} component="div" className={styles.errorText} />
        </div>
    );
};

// --- Time Range (Object { start, end }) ---
export const TimeRangeField = ({ field, form }) => {
    // Basic implementation: two time inputs
    const startVal = form.values.attributes[field.key]?.start || '';
    const endVal = form.values.attributes[field.key]?.end || '';

    const handleChange = (part, val) => {
        const current = form.values.attributes[field.key] || {};
        form.setFieldValue(`attributes.${field.key}`, { ...current, [part]: val });
    };

    return (
        <div className={styles.fieldContainer}>
            <label className={styles.label}>
                {field.label?.ar} {field.required && <span className={styles.requiredMark}>*</span>}
            </label>
            <div className={styles.complexFieldRow}>
                <div className={styles.complexFieldItem}>
                    <label className={styles.helpText}>من</label>
                    <input
                        type="time"
                        className={styles.input}
                        value={startVal}
                        onChange={(e) => handleChange('start', e.target.value)}
                    />
                </div>
                <div className={styles.complexFieldItem}>
                    <label className={styles.helpText}>إلى</label>
                    <input
                        type="time"
                        className={styles.input}
                        value={endVal}
                        onChange={(e) => handleChange('end', e.target.value)}
                    />
                </div>
            </div>
            <ErrorMessage name={`attributes.${field.key}`} component="div" className={styles.errorText} />
        </div>
    );
};

// --- Image/File Field Placeholder ---
// Real implementation requires file upload handling logic
export const FileUploadField = ({ field, form }) => {
    return (
        <div className={styles.fieldContainer}>
            <label className={styles.label}>
                {field.label?.ar} {field.required && <span className={styles.requiredMark}>*</span>}
            </label>
            <div className={styles.fileInput}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#888', marginBottom: '8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div style={{ color: '#ccc', fontSize: '0.9rem' }}>اضغط لرفع صور مشروعك التي سيتم عرضها للعملاء</div>
            </div>
            <div className={styles.helpText}>* الحقل للعرض فقط (Mock Implementation)</div>
        </div>
    );
}

// --- Location (Lat/Lng) ---
export const LocationField = ({ field, form }) => {
    // Usually a map. Here just two inputs.
    // TODO: Implement map
    return (
        <div className={styles.fieldContainer}>
            <label className={styles.label}>
                {field.label?.ar}
            </label>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', textAlign: 'center', color: '#888', borderRadius: '8px' }}>
                [خريطة الموقع - قيد التطوير]
            </div>
        </div>
    );
}
