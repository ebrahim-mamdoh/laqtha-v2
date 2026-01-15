import React from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { TextField } from './FormUI';
import styles from '../partner.module.css';
import { motion } from 'framer-motion';

const BasicInfoSchema = Yup.object().shape({
    business_name: Yup.string()
        .min(2, 'الاسم قصير جداً')
        .max(50, 'الاسم طويل جداً')
        .required('اسم النشاط التجاري مطلوب'),
    owner_name: Yup.string()
        .min(2, 'الاسم قصير جداً')
        .required('اسم المالك مطلوب'),
    phone_number: Yup.string()
        .matches(/^[0-9]+$/, "يجب أن يحتوي على أرقام فقط")
        .min(9, 'الرقم قصير جداً')
        .required('رقم الهاتف مطلوب'),
    email: Yup.string()
        .email('البريد الإلكتروني غير صحيح')
        .required('البريد الإلكتروني مطلوب'),
    full_address: Yup.string()
        .required('العنوان الكامل مطلوب'),
    city: Yup.string()
        .required('المدينة مطلوبة'),
    website_or_social: Yup.string()
        .url('رابط غير صحيح (تأكد من وجود https://)'),
});

const PhoneField = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const [codeField] = useField('phone_code');
    const isError = meta.touched && meta.error;

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputWrapper}>
                <div style={{ display: 'flex', gap: '8px', direction: 'ltr' }}>
                    <select
                        {...codeField}
                        className={styles.input}
                        style={{ width: '90px', padding: '0 8px', textAlign: 'center' }}
                    >
                        <option value="+20">+20</option>
                        <option value="+966">+966</option>
                        <option value="+971">+971</option>
                        <option value="+965">+965</option>
                    </select>
                    <input
                        className={styles.input}
                        style={isError ? { borderColor: '#ff4d4d' } : {}}
                        placeholder="1xxxxxxxxx"
                        {...field}
                        {...props}
                    />
                </div>
                {isError ? (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.error}
                        style={{ textAlign: 'left' }}
                    >
                        {meta.error}
                    </motion.div>
                ) : null}
            </div>
        </div>
    );
};

export default function Step1BasicInfo({ initialValues, onNext }) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={BasicInfoSchema}
            onSubmit={(values) => {
                onNext(values);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <div className={styles.formGrid}>
                        <TextField
                            name="business_name"
                            label="اسم النشاط التجاري"
                            placeholder="مثال: شركة لقطها"
                        />
                        <TextField
                            name="owner_name"
                            label="اسم المالك أو المسؤول"
                            placeholder="الاسم الثلاثي"
                        />

                        <PhoneField
                            name="phone_number"
                            label="رقم الهاتف"
                            type="tel"
                        />

                        <TextField
                            name="email"
                            label="البريد الإلكتروني"
                            placeholder="name@business.com"
                            type="email"
                            style={{ direction: 'ltr', textAlign: 'right' }}
                        />

                        <TextField
                            name="city"
                            label="المدينة"
                            placeholder="الرياض"
                        />

                        <TextField
                            name="full_address"
                            label="العنوان الكامل"
                            placeholder="الحي، الشارع، رقم المبنى"
                        />

                        <TextField
                            name="website_or_social"
                            label="الموقع الإلكتروني أو رابط التواصل"
                            placeholder="https://test.com"
                            className={styles.fullWidth}
                            style={{ direction: 'ltr', textAlign: 'right' }}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            التالي
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
