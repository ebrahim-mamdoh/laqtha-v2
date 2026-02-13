'use client';
import React from 'react';
import styles from '../dynamic-form.module.css';
import { Field, ErrorMessage } from 'formik';

// --- Text / HTML5 Inputs ---
export const TextField = ({ field, form, ...props }) => {
    const isError = form.errors.attributes?.[field.key] && form.touched.attributes?.[field.key];
    const type = field.type === 'email' ? 'email' :
        field.type === 'url' ? 'url' :
            field.type === 'phone' ? 'tel' :
                'text';

    return (
        <div className={styles.fieldContainer}>
            <label htmlFor={field.key} className={styles.label}>
                {field.label?.ar} {field.required && <span className={styles.requiredMark}>*</span>}
            </label>
            <input
                id={field.key}
                name={`attributes.${field.key}`}
                type={type}
                className={`${styles.input} ${isError ? styles.inputError : ''} ${styles.rtlInput}`}
                placeholder={field.placeholder?.ar}
                value={form.values.attributes[field.key] || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                {...props}
            />
            {field.helpText?.ar && <span className={styles.helpText}>{field.helpText.ar}</span>}
            <ErrorMessage name={`attributes.${field.key}`} component="div" className={styles.errorText} />
        </div>
    );
};

// --- Textarea ---
export const TextareaField = ({ field, form, ...props }) => {
    const isError = form.errors.attributes?.[field.key] && form.touched.attributes?.[field.key];
    return (
        <div className={styles.fieldContainer}>
            <label htmlFor={field.key} className={styles.label}>
                {field.label?.ar} {field.required && <span className={styles.requiredMark}>*</span>}
            </label>
            <textarea
                id={field.key}
                name={`attributes.${field.key}`}
                className={`${styles.input} ${styles.textarea} ${isError ? styles.inputError : ''} ${styles.rtlInput}`}
                placeholder={field.placeholder?.ar}
                value={form.values.attributes[field.key] || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                {...props}
            />
            {field.helpText?.ar && <span className={styles.helpText}>{field.helpText.ar}</span>}
            <ErrorMessage name={`attributes.${field.key}`} component="div" className={styles.errorText} />
        </div>
    );
};

// --- Number / Decimal ---
export const NumberField = ({ field, form, ...props }) => {
    const isError = form.errors.attributes?.[field.key] && form.touched.attributes?.[field.key];
    const step = field.type === 'decimal' ? '0.01' : '1';

    return (
        <div className={styles.fieldContainer}>
            <label htmlFor={field.key} className={styles.label}>
                {field.label?.ar} {field.required && <span className={styles.requiredMark}>*</span>}
            </label>
            <input
                id={field.key}
                name={`attributes.${field.key}`}
                type="number"
                step={step}
                className={`${styles.input} ${isError ? styles.inputError : ''} ${styles.rtlInput}`}
                placeholder={field.placeholder?.ar}
                value={form.values.attributes[field.key] ?? ''} // Allow 0 to be visible if entered
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                min={field.validation?.min}
                max={field.validation?.max}
                {...props}
            />
            {field.helpText?.ar && <span className={styles.helpText}>{field.helpText.ar}</span>}
            <ErrorMessage name={`attributes.${field.key}`} component="div" className={styles.errorText} />
        </div>
    );
};

// --- Select ---
export const SelectField = ({ field, form, ...props }) => {
    const isError = form.errors.attributes?.[field.key] && form.touched.attributes?.[field.key];
    return (
        <div className={styles.fieldContainer}>
            <label htmlFor={field.key} className={styles.label}>
                {field.label?.ar} {field.required && <span className={styles.requiredMark}>*</span>}
            </label>
            <select
                id={field.key}
                name={`attributes.${field.key}`}
                className={`${styles.select} ${isError ? styles.inputError : ''}`}
                value={form.values.attributes[field.key] || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                {...props}
            >
                <option value="">{field.placeholder?.ar || 'اختر...'}</option>
                {field.options?.map((opt, idx) => (
                    <option key={idx} value={opt.value}>{opt.label?.ar || opt.value}</option>
                ))}
            </select>
            {field.helpText?.ar && <span className={styles.helpText}>{field.helpText.ar}</span>}
            <ErrorMessage name={`attributes.${field.key}`} component="div" className={styles.errorText} />
        </div>
    );
};

// --- Boolean (Checkbox) ---
export const BooleanField = ({ field, form, ...props }) => {
    return (
        <div className={styles.fieldContainer}>
            <label className={styles.checkboxContainer}>
                <input
                    type="checkbox"
                    id={field.key}
                    name={`attributes.${field.key}`}
                    className={styles.checkboxInput}
                    checked={!!form.values.attributes[field.key]}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    {...props}
                />
                <span className={styles.label} style={{ marginBottom: 0 }}>
                    {field.label?.ar} {field.required && <span className={styles.requiredMark}>*</span>}
                </span>
            </label>
            {field.helpText?.ar && <span className={styles.helpText}>{field.helpText.ar}</span>}
            <ErrorMessage name={`attributes.${field.key}`} component="div" className={styles.errorText} />
        </div>
    );
};
