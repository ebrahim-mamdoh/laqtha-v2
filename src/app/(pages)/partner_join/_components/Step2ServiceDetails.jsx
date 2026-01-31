import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { SelectField, TextField, TextAreaField } from './FormUI';
import styles from '../partner.module.css';

const ServiceDetailsSchema = Yup.object().shape({
    business_description: Yup.string()
        .min(20, 'يرجى كتابة وصف أكثر تفصيلاً (20 حرف كحد أدنى)')
        .max(500, 'الوصف طويل جداً (500 حرف كحد أقصى)')
        .required('وصف النشاط مطلوب'),
    business_type: Yup.string()
        .required('يرجى اختيار نوع النشاط'),
    working_hours: Yup.string()
        .required('ساعات العمل مطلوبة'),
    branches_count: Yup.number()
        .typeError('يجب أن يكون رقماً')
        .min(1, 'يجب أن يكون فرع واحد على الأقل')
        .nullable(),
});

const businessTypeOptions = [
    { value: 'tour_guide', label: 'مرشد سياحي' },
    { value: 'tourism_company', label: 'شركة سياحية' },
    { value: 'hotel', label: 'فندق' },
    { value: 'entertainment', label: 'نشاط ترفيهي' },
    { value: 'restaurant', label: 'مطعم / كافيه' },
];

export default function Step2ServiceDetails({ initialValues, onNext, onBack }) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={ServiceDetailsSchema}
            onSubmit={(values) => {
                onNext(values);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <div className={styles.formGrid}>
                        <TextAreaField
                            name="business_description"
                            label="وصف مختصر عن النشاط"
                            placeholder="اكتب نبذة عن نشاطك التجاري وما تقدمه للعملاء..."
                            className={styles.fullWidth}
                            maxLength={500}
                        />

                        <SelectField
                            name="business_type"
                            label="نوع النشاط التجاري"
                            options={businessTypeOptions}
                        />

                        <TextField
                            name="working_hours"
                            label="ساعات العمل اليومية"
                            placeholder="مثال: 09:00 ص - 11:00 م"
                        />

                        <TextField
                            name="branches_count"
                            label="عدد الفروع (اختياري)"
                            type="number"
                            min="1"
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onBack}
                        >
                            السابق
                        </button>
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
