import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField } from './FormUI';
import styles from '../partner.module.css';

const PaymentSchema = Yup.object().shape({
    bank_name: Yup.string()
        .required('اسم البنك مطلوب'),
    iban: Yup.string()
        .matches(/^SA\d{22}$/i, 'صيغة الايبان غير صحيحة (يجب أن يبدأ بـ SA ويتبع بـ 22 رقم)')
        .transform(value => value.toUpperCase())
        .required('رقم الايبان مطلوب'),
    account_holder_name: Yup.string()
        .required('اسم صاحب الحساب مطلوب'),
});

export default function Step3Payment({ initialValues, onBack, onSubmit, isSubmitting }) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={PaymentSchema}
            onSubmit={(values) => {
                onSubmit(values);
            }}
        >
            {({ isValid, dirty, values, setFieldValue }) => (
                <Form>
                    <h2 className={styles.title} style={{ fontSize: '20px', marginBottom: '20px' }}>
                        معلومات الدفع والتحويل
                    </h2>

                    <div className={styles.formGrid}>
                        <TextField
                            name="bank_name"
                            label="اسم البنك"
                            placeholder="مثال: مصرف الراجحي"
                        />

                        <TextField
                            name="iban"
                            label="رقم IBAN"
                            placeholder="SA0000000000000000000000"
                            style={{ direction: 'ltr', textAlign: 'right' }}
                            onChange={(e) => {
                                const val = e.target.value.toUpperCase();
                                setFieldValue('iban', val);
                            }}
                        />

                        <TextField
                            name="account_holder_name"
                            label="اسم صاحب الحساب البنكي"
                            placeholder="الاسم كما هو في البطاقة"
                        />

                        <div className={styles.formGroup}>
                            <label className={styles.label}>نسبة العمولة المتفق عليها</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={styles.input}
                                    value="يتم تحديدها عند التواصل"
                                    readOnly
                                    disabled
                                    style={{ color: 'var(--color-muted)', cursor: 'not-allowed' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onBack}
                            disabled={isSubmitting}
                        >
                            السابق
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'جاري الإرسال...' : 'التالي'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
