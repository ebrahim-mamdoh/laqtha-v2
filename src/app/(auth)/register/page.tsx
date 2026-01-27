// ============================================================================
// Customer Registration Page
// Email/password registration with validation
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './page.module.css';

// ============================================================================
// Validation
// ============================================================================

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'الاسم مطلوب';
  } else if (data.name.trim().length < 2) {
    errors.name = 'الاسم يجب أن يكون أكثر من حرفين';
  }

  if (!data.email.trim()) {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'البريد الإلكتروني غير صالح';
  }

  if (data.phone && !/^(\+966|0)?5\d{8}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = 'رقم الهاتف غير صالح';
  }

  if (!data.password) {
    errors.password = 'كلمة المرور مطلوبة';
  } else if (data.password.length < 8) {
    errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = 'يجب أن تحتوي على حرف كبير';
  } else if (!/[0-9]/.test(data.password)) {
    errors.password = 'يجب أن تحتوي على رقم';
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
    errors.password = 'يجب أن تحتوي على رمز خاص';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'كلمات المرور غير متطابقة';
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = 'يجب الموافقة على الشروط والأحكام';
  }

  return errors;
}

// ============================================================================
// Component
// ============================================================================

export default function RegisterPage() {
  const router = useRouter();
  const { isUserAuthenticated, isLoading: authLoading } = useAuth();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isUserAuthenticated) {
      router.replace('/');
    }
  }, [isUserAuthenticated, authLoading, router]);

  // Update form field
  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      });

      // Redirect to OTP verification
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrors({
        general: err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب',
      });
    }
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
      <h1 className={styles.title}>إنشاء حساب جديد</h1>
      <p className={styles.subtitle}>
        أنشئ حسابك واستمتع بأفضل الخدمات
      </p>

      {/* Error Alert */}
      {errors.general && (
        <div className={styles.alert} role="alert">
          <span className={styles.alertIcon}>⚠️</span>
          {errors.general}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="text"
          label="الاسم الكامل"
          placeholder="أدخل اسمك الكامل"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors.name}
          isRequired
          autoComplete="name"
        />

        <Input
          type="email"
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          isRequired
          autoComplete="email"
          dir="ltr"
        />

        <Input
          type="tel"
          label="رقم الهاتف"
          placeholder="+966 5XX XXX XXXX"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          error={errors.phone}
          helperText="اختياري - لتلقي الإشعارات"
          autoComplete="tel"
          dir="ltr"
        />

        <Input
          type="password"
          label="كلمة المرور"
          placeholder="أدخل كلمة المرور"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
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
          value={formData.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          isRequired
          showPasswordToggle
          autoComplete="new-password"
          dir="ltr"
        />

        <div className={styles.termsWrapper}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => updateField('acceptTerms', e.target.checked)}
            />
            <span>
              أوافق على{' '}
              <Link href="/terms" target="_blank">الشروط والأحكام</Link>
              {' '}و{' '}
              <Link href="/privacy" target="_blank">سياسة الخصوصية</Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <span className={styles.fieldError}>{errors.acceptTerms}</span>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={registerMutation.isPending}
          loadingText="جاري إنشاء الحساب..."
        >
          إنشاء الحساب
        </Button>
      </form>

      {/* Login Link */}
      <p className={styles.loginLink}>
        لديك حساب بالفعل؟{' '}
        <Link href="/login">تسجيل الدخول</Link>
      </p>
    </div>
  );
}
