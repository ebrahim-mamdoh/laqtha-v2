// ============================================================================
// OTP Verification Page
// Verify email with OTP code after registration
// ============================================================================

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useVerifyOtp, useResendVerification } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import styles from './page.module.css';

// ============================================================================
// Constants
// ============================================================================

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

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

    // Auto-focus next input
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
    // Focus last filled or next empty
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
// Main Component Content
// ============================================================================

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isUserAuthenticated, isLoading: authLoading, setUserAuth } = useAuth();
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendVerification();

  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!email && !authLoading) {
      router.replace('/register');
    }
  }, [email, authLoading, router]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isUserAuthenticated) {
      router.replace('/');
    }
  }, [isUserAuthenticated, authLoading, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === OTP_LENGTH && !verifyMutation.isPending) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  // Handle verification
  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      setError('يرجى إدخال رمز التحقق كاملاً');
      return;
    }

    setError('');

    try {
      const response = await verifyMutation.mutateAsync({
        email,
        otp: otpString,
      });

      setIsVerified(true);

      // If response includes tokens, auto-login
      if (response.accessToken && response.user) {
        setUserAuth(response.user, response.accessToken, response.refreshToken);
        setTimeout(() => router.push('/'), 1500);
      } else {
        // Redirect to login
        setTimeout(() => router.push('/login?verified=true'), 1500);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'رمز التحقق غير صحيح');
      setOtp(Array(OTP_LENGTH).fill(''));
    }
  };

  // Handle resend
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      await resendMutation.mutateAsync({ email });
      setResendCooldown(RESEND_COOLDOWN);
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'حدث خطأ أثناء إعادة الإرسال');
    }
  };

  if (authLoading || !email) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon}>✓</span>
        <h2>تم التحقق بنجاح!</h2>
        <p>جاري تحويلك...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.icon}>✉️</span>
        <h1 className={styles.title}>التحقق من البريد الإلكتروني</h1>
        <p className={styles.subtitle}>
          أدخل رمز التحقق المرسل إلى
        </p>
        <p className={styles.email}>{email}</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={styles.alert} role="alert">
          <span className={styles.alertIcon}>⚠️</span>
          {error}
        </div>
      )}

      {/* OTP Input */}
      <OTPInput
        value={otp}
        onChange={setOtp}
        disabled={verifyMutation.isPending}
        error={!!error}
      />

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        fullWidth
        isLoading={verifyMutation.isPending}
        loadingText="جاري التحقق..."
        disabled={otp.join('').length !== OTP_LENGTH}
      >
        تأكيد
      </Button>

      {/* Resend */}
      <div className={styles.resendWrapper}>
        <p className={styles.resendText}>
          لم تستلم الرمز؟
        </p>
        {resendCooldown > 0 ? (
          <span className={styles.cooldown}>
            إعادة الإرسال بعد {resendCooldown} ثانية
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className={styles.resendButton}
          >
            {resendMutation.isPending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
          </button>
        )}
      </div>

      {/* Back to Register */}
      <p className={styles.backLink}>
        <Link href="/register">← تغيير البريد الإلكتروني</Link>
      </p>
    </div>
  );
}

// ============================================================================
// Main Export with Suspense
// ============================================================================

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
