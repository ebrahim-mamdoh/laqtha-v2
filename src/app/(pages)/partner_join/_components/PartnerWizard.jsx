'use client';

import React, { useReducer, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../partner.module.css';
import StepIndicator from './StepIndicator';

// Dynamic imports for performance (code splitting)
const Step1BasicInfo = dynamic(() => import('./Step1BasicInfo'), {
    loading: () => <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>Loading Step 1...</div>
});
const Step2ServiceDetails = dynamic(() => import('./Step2ServiceDetails'), {
    loading: () => <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>Loading Step 2...</div>
});
const Step3Payment = dynamic(() => import('./Step3Payment'), {
    loading: () => <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>Loading Payment...</div>
});

const initialState = {
    currentStep: 1,
    completedSteps: [],
    isSubmitting: false,
    isSuccess: false,
    formData: {
        basic_info: {
            business_name: '',
            owner_name: '',
            phone_number: '',
            phone_code: '+20',
            email: '',
            full_address: '',
            city: '',
            website_or_social: '',
        },
        service_details: {
            business_description: '',
            business_type: '',
            working_hours: '',
            branches_count: 1,
        },
        payment_details: {
            bank_name: '',
            iban: '',
            account_holder_name: '',
        },
    },
};

function reducer(state, action) {
    switch (action.type) {
        case 'NEXT_STEP':
            const nextStep = Math.min(state.currentStep + 1, 3);
            // Add current step to completed
            const newCompleted = new Set(state.completedSteps);
            newCompleted.add(state.currentStep);

            return {
                ...state,
                currentStep: nextStep,
                completedSteps: Array.from(newCompleted),
            };
        case 'PREV_STEP':
            return {
                ...state,
                currentStep: Math.max(state.currentStep - 1, 1),
            };
        case 'UPDATE_FORM_DATA':
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [action.stepKey]: action.data,
                },
            };
        case 'START_SUBMIT':
            return { ...state, isSubmitting: true };
        case 'SUBMIT_SUCCESS':
            return { ...state, isSubmitting: false, isSuccess: true };
        case 'SUBMIT_ERROR':
            return { ...state, isSubmitting: false }; // You could add error message state here
        default:
            return state;
    }
}

export default function PartnerWizard() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const router = useRouter();

    const handleNext = useCallback((stepKey, data) => {
        dispatch({ type: 'UPDATE_FORM_DATA', stepKey, data });
        dispatch({ type: 'NEXT_STEP' });
    }, []);

    const handleBack = useCallback(() => {
        dispatch({ type: 'PREV_STEP' });
    }, []);

    const handleFinalSubmit = useCallback(async (paymentData) => {
        dispatch({ type: 'START_SUBMIT' });

        // Update payment details in state first (conceptually)
        // Since dispatch is async in nature relative to the API call, we combine the data here
        const finalPayload = {
            basicInfo: state.formData.basic_info,
            serviceDetails: state.formData.service_details,
            paymentDetails: paymentData
        };

        console.log('Sending Final Payload:', finalPayload);

        try {
            // Simulate API Request
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success Logic
            dispatch({ type: 'SUBMIT_SUCCESS' });
            // alert("تم إرسال طلبكم بنجاح!");
        } catch (error) {
            console.error("Submission failed", error);
            dispatch({ type: 'SUBMIT_ERROR' });
            alert("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
        }
    }, [state.formData]);

    if (state.isSuccess) {
        return (
            <div className={styles.wizardWrapper} style={{ textAlign: 'center', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring' }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <h2 style={{ color: 'var(--color-white)', marginBottom: '16px', fontSize: '24px' }}>
                        تم إرسال طلبكم بنجاح
                    </h2>
                    <p style={{ color: 'var(--color-muted)', marginBottom: '40px' }}>
                        سيتم التواصل معكم في اقرب وقت لاتمام العملية
                    </p>

                    <div style={{ position: 'relative', width: '180px', height: '180px', marginBottom: '50px' }}>
                        <Image
                            src="/images/success-check.svg"
                            alt="Success"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    <button
                        onClick={() => router.push('/chat')}
                        className="btn"
                        style={{
                            background: '#FF00C8', // Explicit pink from design
                            width: '100%',
                            maxWidth: '400px',
                            height: '50px',
                            fontSize: '18px',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}
                    >
                        حسنا
                    </button>
                </motion.div>
            </div>
        )
    }

    const renderStep = () => {
        switch (state.currentStep) {
            case 1:
                return (
                    <Step1BasicInfo
                        initialValues={state.formData.basic_info}
                        onNext={(data) => handleNext('basic_info', data)}
                    />
                );
            case 2:
                return (
                    <Step2ServiceDetails
                        initialValues={state.formData.service_details}
                        onNext={(data) => handleNext('service_details', data)}
                        onBack={handleBack}
                    />
                );
            case 3:
                return (
                    <Step3Payment
                        initialValues={state.formData.payment_details}
                        onBack={handleBack}
                        onSubmit={handleFinalSubmit}
                        isSubmitting={state.isSubmitting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.wizardWrapper}>
            <StepIndicator currentStep={state.currentStep} />

            <div className={styles.stepContainer}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={state.currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
