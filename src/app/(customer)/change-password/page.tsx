// ============================================================================
// Change Password Page
// Change password for authenticated customers
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './page.module.css';

// ============================================================================
// Types
// ============================================================================

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

// ============================================================================
// Validation
// ============================================================================

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.currentPassword) {
    errors.currentPassword = 'كلمة المرور الحالية مطلوبة';
  }

  if (!data.newPassword) {
    errors.newPassword = 'كلمة المرور الجديدة مطلوبة';
  } else if (data.newPassword.length < 8) {
    errors.newPassword = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
  } else if (!/[A-Z]/.test(data.newPassword)) {
    errors.newPassword = 'يجب أن تحتوي على حرف كبير';
  } else if (!/[0-9]/.test(data.newPassword)) {
    errors.newPassword = 'يجب أن تحتوي على رقم';
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.newPassword)) {
    errors.newPassword = 'يجب أن تحتوي على رمز خاص';
  } else if (data.newPassword === data.currentPassword) {
    errors.newPassword = 'كلمة المرور الجديدة يجب أن تكون مختلفة';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = 'كلمات المرور غير متطابقة';
  }

  return errors;
}

// ============================================================================
// Component
// ============================================================================

export default function ChangePasswordPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update form field
  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    setIsSubmitting(true);

    try {
      // Call API to change password
      // const response = await authApi.changePassword({
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);

      // Logout and redirect to login
      setTimeout(() => {
        logout();
        router.push('/login?passwordChanged=true');
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrors({
        general:
          error.response?.data?.message ||
          'حدث خطأ أثناء تغيير كلمة المرور. تأكد من كلمة المرور الحالية.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <span className={styles.successIcon}>✓</span>
          <h2>تم تغيير كلمة المرور!</h2>
          <p>سيتم تسجيل خروجك الآن لإعادة تسجيل الدخول بكلمة المرور الجديدة</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <Link href="/profile" className={styles.backLink}>
          ← العودة للملف الشخصي
        </Link>
        <h1 className={styles.title}>تغيير كلمة المرور</h1>
        <p className={styles.subtitle}>
          أدخل كلمة المرور الحالية وكلمة المرور الجديدة
        </p>
      </div>

      {/* Error Alert */}
      {errors.general && (
        <div className={styles.alert} role="alert">
          <span className={styles.alertIcon}>⚠️</span>
          {errors.general}
        </div>
      )}

      {/* Form Card */}
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="password"
            label="كلمة المرور الحالية"
            placeholder="أدخل كلمة المرور الحالية"
            value={formData.currentPassword}
            onChange={(e) => updateField('currentPassword', e.target.value)}
            error={errors.currentPassword}
            isRequired
            showPasswordToggle
            autoComplete="current-password"
            dir="ltr"
          />

          <div className={styles.divider} />

          <Input
            type="password"
            label="كلمة المرور الجديدة"
            placeholder="أدخل كلمة المرور الجديدة"
            value={formData.newPassword}
            onChange={(e) => updateField('newPassword', e.target.value)}
            error={errors.newPassword}
            helperText="8 أحرف على الأقل، حرف كبير، رقم، رمز خاص"
            isRequired
            showPasswordToggle
            autoComplete="new-password"
            dir="ltr"
          />

          <Input
            type="password"
            label="تأكيد كلمة المرور الجديدة"
            placeholder="أعد إدخال كلمة المرور الجديدة"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            isRequired
            showPasswordToggle
            autoComplete="new-password"
            dir="ltr"
          />

          <div className={styles.formActions}>
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              loadingText="جاري تغيير كلمة المرور..."
            >
              تغيير كلمة المرور
            </Button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <span className={styles.infoIcon}>ℹ️</span>
        <p>
          بعد تغيير كلمة المرور، سيتم تسجيل خروجك من جميع الأجهزة وستحتاج إلى
          تسجيل الدخول مرة أخرى.
        </p>
      </div>
    </div>
  );
}
