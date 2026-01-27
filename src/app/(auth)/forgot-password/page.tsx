// ============================================================================
// Forgot Password Page
// Request password reset via email
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useForgotPassword } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './page.module.css';

// ============================================================================
// Component
// ============================================================================

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isUserAuthenticated, isLoading: authLoading } = useAuth();
  const forgotMutation = useForgotPassword();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isUserAuthenticated) {
      router.replace('/');
    }
  }, [isUserAuthenticated, authLoading, router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('البريد الإلكتروني غير صالح');
      return;
    }

    try {
      await forgotMutation.mutateAsync({ email });
      setIsSubmitted(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'حدث خطأ أثناء إرسال رابط الاستعادة');
    }
  };

  if (authLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <span className={styles.successIcon}>📧</span>
          <h2>تم إرسال الرابط!</h2>
          <p>
            تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني
          </p>
          <p className={styles.emailSent}>{email}</p>
          <p className={styles.hint}>
            تحقق من صندوق الوارد أو مجلد الرسائل غير المرغوب فيها
          </p>
        </div>

        <Button
          variant="outline"
          fullWidth
          onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
        >
          لدي رمز التحقق
        </Button>

        <p className={styles.backLink}>
          <Link href="/login">← العودة لتسجيل الدخول</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.icon}>🔐</span>
        <h1 className={styles.title}>نسيت كلمة المرور؟</h1>
        <p className={styles.subtitle}>
          أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة كلمة المرور
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={styles.alert} role="alert">
          <span className={styles.alertIcon}>⚠️</span>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          error={error ? ' ' : undefined} // Show error state without duplicate message
          isRequired
          autoComplete="email"
          autoFocus
          dir="ltr"
        />

        <Button
          type="submit"
          fullWidth
          isLoading={forgotMutation.isPending}
          loadingText="جاري الإرسال..."
        >
          إرسال رابط الاستعادة
        </Button>
      </form>

      {/* Back to Login */}
      <p className={styles.backLink}>
        <Link href="/login">← العودة لتسجيل الدخول</Link>
      </p>
    </div>
  );
}
