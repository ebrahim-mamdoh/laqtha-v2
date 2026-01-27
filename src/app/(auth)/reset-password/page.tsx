// ============================================================================
// Reset Password Page
// Set new password using OTP
// ============================================================================

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useResetPassword } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './page.module.css';

// ============================================================================
// Constants
// ============================================================================

const OTP_LENGTH = 6;

// ============================================================================
// OTP Input Component
// ============================================================================

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: boolean;
}

function OTPInput({ value, onChange, disabled, error }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    const newValue = [...value];
    for (let i = 0; i < Math.min(pastedData.length, OTP_LENGTH); i++) {
      newValue[i] = pastedData[i];
    }
    onChange(newValue);
    const lastIndex = Math.min(pastedData.length, OTP_LENGTH) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className={`${styles.otpContainer} ${error ? styles.otpError : ''}`}>
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={styles.otpInput}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Form Data
// ============================================================================

interface FormErrors {
  otp?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// ============================================================================
// Main Component Content
// ============================================================================

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isUserAuthenticated, isLoading: authLoading } = useAuth();
  const resetMutation = useResetPassword();

  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!email && !authLoading) {
      router.replace('/forgot-password');
    }
  }, [email, authLoading, router]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isUserAuthenticated) {
      router.replace('/');
    }
  }, [isUserAuthenticated, authLoading, router]);

  // Validate form
  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      errs.otp = 'يرجى إدخال رمز التحقق كاملاً';
    }

    if (!password) {
      errs.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 8) {
      errs.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    } else if (!/[A-Z]/.test(password)) {
      errs.password = 'يجب أن تحتوي على حرف كبير';
    } else if (!/[0-9]/.test(password)) {
      errs.password = 'يجب أن تحتوي على رقم';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errs.password = 'يجب أن تحتوي على رمز خاص';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    return errs;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await resetMutation.mutateAsync({
        email,
        otp: otp.join(''),
        newPassword: password,
      });

      setIsSuccess(true);
      setTimeout(() => router.push('/login?reset=true'), 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrors({
        general: error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور',
      });
    }
  };

  if (authLoading || !email) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon}>✓</span>
        <h2>تم تغيير كلمة المرور!</h2>
        <p>جاري تحويلك لتسجيل الدخول...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.icon}>🔑</span>
        <h1 className={styles.title}>تعيين كلمة مرور جديدة</h1>
        <p className={styles.subtitle}>
          أدخل رمز التحقق وكلمة المرور الجديدة
        </p>
        <p className={styles.email}>{email}</p>
      </div>

      {/* Error Alert */}
      {errors.general && (
        <div className={styles.alert} role="alert">
          <span className={styles.alertIcon}>⚠️</span>
          {errors.general}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* OTP Input */}
        <div className={styles.field}>
          <label className={styles.label}>رمز التحقق</label>
          <OTPInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (errors.otp) setErrors((p) => ({ ...p, otp: undefined }));
            }}
            disabled={resetMutation.isPending}
            error={!!errors.otp}
          />
          {errors.otp && <span className={styles.fieldError}>{errors.otp}</span>}
        </div>

        <Input
          type="password"
          label="كلمة المرور الجديدة"
          placeholder="أدخل كلمة المرور الجديدة"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
          }}
          error={errors.password}
          helperText="8 أحرف على الأقل، حرف كبير، رقم، رمز خاص"
          isRequired
          showPasswordToggle
          autoComplete="new-password"
          dir="ltr"
        />

        <Input
          type="password"
          label="تأكيد كلمة المرور"
          placeholder="أعد إدخال كلمة المرور"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
          isRequired
          showPasswordToggle
          autoComplete="new-password"
          dir="ltr"
        />

        <Button
          type="submit"
          fullWidth
          isLoading={resetMutation.isPending}
          loadingText="جاري التحديث..."
        >
          تحديث كلمة المرور
        </Button>
      </form>

      {/* Back Link */}
      <p className={styles.backLink}>
        <Link href="/forgot-password">← طلب رمز جديد</Link>
      </p>
    </div>
  );
}

// ============================================================================
// Main Export with Suspense
// ============================================================================

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
