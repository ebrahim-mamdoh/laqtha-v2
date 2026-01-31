import React from 'react';
import { useField } from 'formik';
import styles from '../partner.module.css';
import { motion } from 'framer-motion';

export const TextField = ({ label, className, ...props }) => {
    const [field, meta] = useField(props);
    const isError = meta.touched && meta.error;

    return (
        <div className={`${styles.formGroup} ${className || ''}`}>
            <label className={styles.label} htmlFor={props.id || props.name}>
                {label}
            </label>
            <div className={styles.inputWrapper}>
                <input
                    className={styles.input}
                    style={isError ? { borderColor: '#ff4d4d' } : {}}
                    {...field}
                    {...props}
                />
                {isError ? (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.error}
                    >
                        {meta.error}
                    </motion.div>
                ) : null}
            </div>
        </div>
    );
};

export const SelectField = ({ label, options, className, ...props }) => {
    const [field, meta] = useField(props);
    const isError = meta.touched && meta.error;

    return (
        <div className={`${styles.formGroup} ${className || ''}`}>
            <label className={styles.label} htmlFor={props.id || props.name}>
                {label}
            </label>
            <div className={styles.inputWrapper}>
                <select
                    className={styles.input}
                    style={isError ? { borderColor: '#ff4d4d' } : {}}
                    {...field}
                    {...props}
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {isError ? (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.error}
                    >
                        {meta.error}
                    </motion.div>
                ) : null}
            </div>
        </div>
    );
};

export const TextAreaField = ({ label, className, ...props }) => {
    const [field, meta] = useField(props);
    const isError = meta.touched && meta.error;

    return (
        <div className={`${styles.formGroup} ${className || ''}`}>
            <label className={styles.label} htmlFor={props.id || props.name}>
                {label}
            </label>
            <div className={styles.inputWrapper}>
                <textarea
                    className={styles.input}
                    style={{ minHeight: '100px', resize: 'vertical', ...(isError ? { borderColor: '#ff4d4d' } : {}) }}
                    {...field}
                    {...props}
                />
                {isError ? (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.error}
                    >
                        {meta.error}
                    </motion.div>
                ) : null}
            </div>
        </div>
    );
};
