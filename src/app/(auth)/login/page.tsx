// ============================================================================
// Customer Login Page
// Email/password login with Google OAuth option
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { authApi } from '@/lib/api';
import styles from './page.module.css';

// ============================================================================
// Validation
// ============================================================================

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validateForm(email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'البريد الإلكتروني غير صالح';
  }

  if (!password) {
    errors.password = 'كلمة المرور مطلوبة';
  }

  return errors;
}

// ============================================================================
// Component
// ============================================================================

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isUserAuthenticated, setUserAuth, isLoading: authLoading } = useAuth();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [rememberMe, setRememberMe] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isUserAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isUserAuthenticated, authLoading, router, redirectTo]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const validationErrors = validateForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({ email, password });
      setUserAuth(response.user, response.accessToken, response.refreshToken);
      router.push(redirectTo);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrors({
        general: err.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول',
      });
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    window.location.href = authApi.getGoogleAuthUrl();
  };

  if (authLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>تسجيل الدخول</h1>
      <p className={styles.subtitle}>
        أهلاً بك مجدداً! سجل دخولك للمتابعة
      </p>

      {/* Error Alert */}
      {errors.general && (
        <div className={styles.alert} role="alert">
          <span className={styles.alertIcon}>⚠️</span>
          {errors.general}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          isRequired
          autoComplete="email"
          dir="ltr"
        />

        <Input
          type="password"
          label="كلمة المرور"
          placeholder="أدخل كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          isRequired
          showPasswordToggle
          autoComplete="current-password"
          dir="ltr"
        />

        <div className={styles.options}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>تذكرني</span>
          </label>
          <Link href="/forgot-password" className={styles.forgotLink}>
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={loginMutation.isPending}
          loadingText="جاري تسجيل الدخول..."
        >
          تسجيل الدخول
        </Button>
      </form>

      {/* Divider */}
      <div className={styles.divider}>
        <span>أو</span>
      </div>

      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={handleGoogleLogin}
        leftIcon={<span className={styles.googleIcon}>G</span>}
      >
        تسجيل الدخول بحساب Google
      </Button>

      {/* Register Link */}
      <p className={styles.registerLink}>
        ليس لديك حساب؟{' '}
        <Link href="/register">إنشاء حساب جديد</Link>
      </p>

      {/* Partner Link */}
      <div className={styles.partnerLink}>
        <span>هل أنت شريك؟</span>
        <Link href="/partner/login">دخول الشركاء</Link>
      </div>
    </div>
  );
}
