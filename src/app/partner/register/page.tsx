'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServiceTypes, usePartnerRegister, usePartnerVerifyOtp } from '@/hooks';
import { ServiceType, DynamicField } from '@/types';
import { DynamicForm, createFormConfigFromFields } from '@/components/forms/DynamicForm';
import { Button, Card, Spinner, Badge } from '@/components/ui';
import { useToast } from '@/components/ui/Toast/Toast';
import styles from './page.module.css';

// ============================================================================
// Types
// ============================================================================

type RegistrationStep = 'service-type' | 'business-info' | 'confirmation' | 'otp-verification';

interface RegistrationData {
  serviceTypeId: string;
  serviceTypeKey: string;
  serviceTypeName: string;
  requiredFields: DynamicField[];
  businessInfo: {
    businessName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  dynamicFields: Record<string, unknown>;
}

// ============================================================================
// Step Components
// ============================================================================

interface ServiceTypeSelectionProps {
  serviceTypes: ServiceType[] | undefined;
  isLoading: boolean;
  selectedId: string;
  onSelect: (serviceType: ServiceType) => void;
  onNext: () => void;
}

function ServiceTypeSelection({
  serviceTypes,
  isLoading,
  selectedId,
  onSelect,
  onNext,
}: ServiceTypeSelectionProps) {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" />
        <p>جاري تحميل أنواع الخدمات...</p>
      </div>
    );
  }

  if (!serviceTypes || serviceTypes.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>لا توجد أنواع خدمات متاحة حالياً</p>
      </div>
    );
  }

  // Filter only active service types
  const activeServiceTypes = serviceTypes.filter((st) => st.isActive);

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2>اختر نوع الخدمة</h2>
        <p>حدد نوع الخدمة التي ترغب في تقديمها كشريك</p>
      </div>

      <div className={styles.serviceTypeGrid}>
        {activeServiceTypes.map((serviceType) => (
          <Card
            key={serviceType._id}
            variant={selectedId === serviceType._id ? 'elevated' : 'bordered'}
            hoverable
            clickable
            onClick={() => onSelect(serviceType)}
            className={`${styles.serviceTypeCard} ${
              selectedId === serviceType._id ? styles.selected : ''
            }`}
          >
            {serviceType.icon && (
              <div className={styles.serviceTypeIcon}>
                {/* Icon placeholder - could use an icon library */}
                <span>{serviceType.icon}</span>
              </div>
            )}
            <h3>{serviceType.name}</h3>
            {serviceType.description && (
              <p className={styles.serviceTypeDescription}>{serviceType.description}</p>
            )}
            <div className={styles.serviceTypeMeta}>
              <Badge variant="info" size="sm">
                {serviceType.requiredFields.length} حقل مطلوب
              </Badge>
            </div>
            {selectedId === serviceType._id && (
              <div className={styles.selectedIndicator}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className={styles.stepActions}>
        <Link href="/partner/login" className={styles.backLink}>
          لديك حساب بالفعل؟ تسجيل الدخول
        </Link>
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedId}
          onClick={onNext}
        >
          التالي
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Business Info Step
// ============================================================================

interface BusinessInfoStepProps {
  registrationData: RegistrationData;
  onUpdateBusinessInfo: (data: RegistrationData['businessInfo']) => void;
  onUpdateDynamicFields: (data: Record<string, unknown>) => void;
  onBack: () => void;
  onNext: () => void;
}

function BusinessInfoStep({
  registrationData,
  onUpdateBusinessInfo,
  onUpdateDynamicFields,
  onBack,
  onNext,
}: BusinessInfoStepProps) {
  const [formData, setFormData] = useState(registrationData.businessInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dynamicFormData, setDynamicFormData] = useState(registrationData.dynamicFields);

  // Validate basic business info
  const validateBasicInfo = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'اسم النشاط التجاري مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDynamicFormChange = (data: Record<string, unknown>) => {
    setDynamicFormData(data);
  };

  const handleNext = () => {
    if (validateBasicInfo()) {
      onUpdateBusinessInfo(formData);
      onUpdateDynamicFields(dynamicFormData);
      onNext();
    }
  };

  // Create form config for dynamic fields
  const dynamicFieldsConfig = createFormConfigFromFields(registrationData.requiredFields, {
    id: 'partner-dynamic-fields',
    submitLabel: '', // We don't use the form's submit button
    columns: 2,
  });

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2>معلومات النشاط التجاري</h2>
        <p>أدخل المعلومات الأساسية لنشاطك التجاري</p>
      </div>

      {/* Basic Business Info Section */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>المعلومات الأساسية</h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label htmlFor="businessName">اسم النشاط التجاري *</label>
            <input
              type="text"
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className={errors.businessName ? styles.inputError : ''}
              placeholder="أدخل اسم نشاطك التجاري"
            />
            {errors.businessName && (
              <span className={styles.fieldError}>{errors.businessName}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="email">البريد الإلكتروني *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? styles.inputError : ''}
              placeholder="example@domain.com"
              dir="ltr"
            />
            {errors.email && (
              <span className={styles.fieldError}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="phone">رقم الهاتف *</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={errors.phone ? styles.inputError : ''}
              placeholder="+966 5XX XXX XXXX"
              dir="ltr"
            />
            {errors.phone && (
              <span className={styles.fieldError}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="password">كلمة المرور *</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={errors.password ? styles.inputError : ''}
              placeholder="8 أحرف على الأقل"
            />
            {errors.password && (
              <span className={styles.fieldError}>{errors.password}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="confirmPassword">تأكيد كلمة المرور *</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={errors.confirmPassword ? styles.inputError : ''}
              placeholder="أعد إدخال كلمة المرور"
            />
            {errors.confirmPassword && (
              <span className={styles.fieldError}>{errors.confirmPassword}</span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Fields Section */}
      {registrationData.requiredFields.length > 0 && (
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            معلومات {registrationData.serviceTypeName}
          </h3>
          
          <DynamicForm
            config={dynamicFieldsConfig}
            initialValues={dynamicFormData}
            onChange={handleDynamicFormChange}
            hideSubmitButton
          />
        </div>
      )}

      <div className={styles.stepActions}>
        <Button variant="outline" size="lg" onClick={onBack}>
          السابق
        </Button>
        <Button variant="primary" size="lg" onClick={handleNext}>
          التالي
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Confirmation Step
// ============================================================================

interface ConfirmationStepProps {
  registrationData: RegistrationData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

function ConfirmationStep({
  registrationData,
  onBack,
  onSubmit,
  isSubmitting,
}: ConfirmationStepProps) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2>مراجعة وتأكيد</h2>
        <p>راجع المعلومات التي أدخلتها قبل إرسال طلب التسجيل</p>
      </div>

      <div className={styles.confirmationSections}>
        {/* Service Type Section */}
        <Card variant="bordered" className={styles.confirmationCard}>
          <h3>نوع الخدمة</h3>
          <div className={styles.confirmationItem}>
            <span className={styles.label}>نوع الخدمة:</span>
            <span className={styles.value}>{registrationData.serviceTypeName}</span>
          </div>
        </Card>

        {/* Business Info Section */}
        <Card variant="bordered" className={styles.confirmationCard}>
          <h3>معلومات النشاط التجاري</h3>
          <div className={styles.confirmationGrid}>
            <div className={styles.confirmationItem}>
              <span className={styles.label}>اسم النشاط:</span>
              <span className={styles.value}>{registrationData.businessInfo.businessName}</span>
            </div>
            <div className={styles.confirmationItem}>
              <span className={styles.label}>البريد الإلكتروني:</span>
              <span className={styles.value} dir="ltr">{registrationData.businessInfo.email}</span>
            </div>
            <div className={styles.confirmationItem}>
              <span className={styles.label}>رقم الهاتف:</span>
              <span className={styles.value} dir="ltr">{registrationData.businessInfo.phone}</span>
            </div>
          </div>
        </Card>

        {/* Dynamic Fields Section */}
        {Object.keys(registrationData.dynamicFields).length > 0 && (
          <Card variant="bordered" className={styles.confirmationCard}>
            <h3>معلومات {registrationData.serviceTypeName}</h3>
            <div className={styles.confirmationGrid}>
              {registrationData.requiredFields.map((field) => {
                const value = registrationData.dynamicFields[field.key];
                if (value === undefined || value === null || value === '') return null;

                return (
                  <div key={field.key} className={styles.confirmationItem}>
                    <span className={styles.label}>{field.label}:</span>
                    <span className={styles.value}>
                      {formatFieldValue(field, value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      <div className={styles.termsSection}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" required />
          <span>
            أوافق على{' '}
            <Link href="/terms" target="_blank">الشروط والأحكام</Link>
            {' '}و{' '}
            <Link href="/privacy" target="_blank">سياسة الخصوصية</Link>
          </span>
        </label>
      </div>

      <div className={styles.stepActions}>
        <Button variant="outline" size="lg" onClick={onBack} disabled={isSubmitting}>
          السابق
        </Button>
        <Button variant="primary" size="lg" onClick={onSubmit} loading={isSubmitting}>
          إرسال طلب التسجيل
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// OTP Verification Step
// ============================================================================

interface OtpVerificationStepProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
}

function OtpVerificationStep({
  email,
  onVerify,
  onResend,
  isVerifying,
  isResending,
}: OtpVerificationStepProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus last filled input or the input after last paste
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <div className={styles.otpIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </div>
        <h2>التحقق من البريد الإلكتروني</h2>
        <p>
          تم إرسال رمز التحقق إلى
          <br />
          <strong dir="ltr">{email}</strong>
        </p>
      </div>

      <div className={styles.otpContainer}>
        <div className={styles.otpInputs}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={styles.otpInput}
              disabled={isVerifying}
            />
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSubmit}
          disabled={!isComplete}
          loading={isVerifying}
        >
          تأكيد
        </Button>

        <div className={styles.resendSection}>
          <p>لم تستلم الرمز؟</p>
          <Button
            variant="link"
            onClick={onResend}
            disabled={isResending}
            loading={isResending}
          >
            إعادة إرسال الرمز
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatFieldValue(field: DynamicField, value: unknown): string {
  if (value === null || value === undefined) return '-';

  switch (field.type) {
    case 'boolean':
      return value ? 'نعم' : 'لا';

    case 'select':
      const selectedOption = field.options?.find((opt) => opt.value === value);
      return selectedOption?.label || String(value);

    case 'multiselect':
      if (Array.isArray(value)) {
        return value
          .map((v) => field.options?.find((opt) => opt.value === v)?.label || v)
          .join('، ');
      }
      return String(value);

    case 'date':
      return new Date(String(value)).toLocaleDateString('ar-SA');

    case 'time':
      return String(value);

    case 'datetime':
      return new Date(String(value)).toLocaleString('ar-SA');

    case 'location':
      if (typeof value === 'object' && value !== null) {
        const loc = value as { lat: number; lng: number };
        return `${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`;
      }
      return String(value);

    case 'price':
      if (typeof value === 'object' && value !== null) {
        const price = value as { amount: number; currency: string };
        return `${price.amount} ${price.currency}`;
      }
      return String(value);

    case 'rating':
      return `${value} / 5`;

    case 'gallery':
      if (Array.isArray(value)) {
        return `${value.length} صور`;
      }
      return String(value);

    default:
      return String(value);
  }
}

// ============================================================================
// Main Component
// ============================================================================

export default function PartnerRegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  // State
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('service-type');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    serviceTypeId: '',
    serviceTypeKey: '',
    serviceTypeName: '',
    requiredFields: [],
    businessInfo: {
      businessName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    dynamicFields: {},
  });

  // API hooks
  const { data: serviceTypesData, isLoading: isLoadingServiceTypes } = useServiceTypes();
  const registerMutation = usePartnerRegister();
  const verifyOtpMutation = usePartnerVerifyOtp();

  // Steps configuration
  const steps = [
    { key: 'service-type', label: 'نوع الخدمة' },
    { key: 'business-info', label: 'معلومات النشاط' },
    { key: 'confirmation', label: 'المراجعة' },
    { key: 'otp-verification', label: 'التحقق' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  // Handlers
  const handleServiceTypeSelect = (serviceType: ServiceType) => {
    setRegistrationData((prev) => ({
      ...prev,
      serviceTypeId: serviceType._id,
      serviceTypeKey: serviceType.key,
      serviceTypeName: serviceType.name,
      requiredFields: serviceType.requiredFields,
    }));
  };

  const handleUpdateBusinessInfo = (businessInfo: RegistrationData['businessInfo']) => {
    setRegistrationData((prev) => ({ ...prev, businessInfo }));
  };

  const handleUpdateDynamicFields = (dynamicFields: Record<string, unknown>) => {
    setRegistrationData((prev) => ({ ...prev, dynamicFields }));
  };

  const handleSubmit = async () => {
    try {
      await registerMutation.mutateAsync({
        businessName: registrationData.businessInfo.businessName,
        email: registrationData.businessInfo.email,
        phone: registrationData.businessInfo.phone,
        password: registrationData.businessInfo.password,
        serviceTypeId: registrationData.serviceTypeId,
        dynamicFields: registrationData.dynamicFields,
      });
      
      showToast({
        type: 'success',
        message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      });
      
      setCurrentStep('otp-verification');
    } catch (error) {
      showToast({
        type: 'error',
        message: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.',
      });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyOtpMutation.mutateAsync({
        email: registrationData.businessInfo.email,
        otp,
      });
      
      showToast({
        type: 'success',
        message: 'تم التحقق بنجاح! جاري مراجعة طلبك.',
      });
      
      // Redirect to partner status page
      router.push('/partner/status');
    } catch (error) {
      showToast({
        type: 'error',
        message: 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.',
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      await registerMutation.mutateAsync({
        businessName: registrationData.businessInfo.businessName,
        email: registrationData.businessInfo.email,
        phone: registrationData.businessInfo.phone,
        password: registrationData.businessInfo.password,
        serviceTypeId: registrationData.serviceTypeId,
        dynamicFields: registrationData.dynamicFields,
      });
      
      showToast({
        type: 'success',
        message: 'تم إعادة إرسال رمز التحقق',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'فشل في إعادة إرسال الرمز. يرجى المحاولة مرة أخرى.',
      });
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            لقطة
          </Link>
          <h1>تسجيل شريك جديد</h1>
        </div>

        {/* Progress Steps */}
        <div className={styles.progressContainer}>
          <div className={styles.progressSteps}>
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={`${styles.progressStep} ${
                  index <= currentStepIndex ? styles.active : ''
                } ${index < currentStepIndex ? styles.completed : ''}`}
              >
                <div className={styles.stepNumber}>
                  {index < currentStepIndex ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
                {index < steps.length - 1 && (
                  <div className={styles.stepConnector} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card variant="default" className={styles.stepCard}>
          {currentStep === 'service-type' && (
            <ServiceTypeSelection
              serviceTypes={serviceTypesData?.data}
              isLoading={isLoadingServiceTypes}
              selectedId={registrationData.serviceTypeId}
              onSelect={handleServiceTypeSelect}
              onNext={() => setCurrentStep('business-info')}
            />
          )}

          {currentStep === 'business-info' && (
            <BusinessInfoStep
              registrationData={registrationData}
              onUpdateBusinessInfo={handleUpdateBusinessInfo}
              onUpdateDynamicFields={handleUpdateDynamicFields}
              onBack={() => setCurrentStep('service-type')}
              onNext={() => setCurrentStep('confirmation')}
            />
          )}

          {currentStep === 'confirmation' && (
            <ConfirmationStep
              registrationData={registrationData}
              onBack={() => setCurrentStep('business-info')}
              onSubmit={handleSubmit}
              isSubmitting={registerMutation.isPending}
            />
          )}

          {currentStep === 'otp-verification' && (
            <OtpVerificationStep
              email={registrationData.businessInfo.email}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              isVerifying={verifyOtpMutation.isPending}
              isResending={registerMutation.isPending}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
