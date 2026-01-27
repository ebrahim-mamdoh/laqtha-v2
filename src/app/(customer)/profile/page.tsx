// ============================================================================
// Customer Profile Page
// View and edit customer profile information
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './page.module.css';

// ============================================================================
// Types
// ============================================================================

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  general?: string;
}

// ============================================================================
// Component
// ============================================================================

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Update form field
  const updateField = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    if (!formData.name.trim()) {
      errs.name = 'الاسم مطلوب';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'الاسم يجب أن يكون أكثر من حرفين';
    }

    if (formData.phone && !/^(\+966|0)?5\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      errs.phone = 'رقم الهاتف غير صالح';
    }

    return errs;
  };

  // Handle save
  const handleSave = async () => {
    setErrors({});
    setSuccessMessage('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);

    try {
      // Call API to update profile
      // For now, update local state
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      updateUser({
        ...user!,
        name: formData.name,
        phone: formData.phone,
      });

      setIsEditing(false);
      setSuccessMessage('تم تحديث الملف الشخصي بنجاح');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrors({
        general: error.response?.data?.message || 'حدث خطأ أثناء حفظ البيانات',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>الملف الشخصي</h1>
        <p className={styles.subtitle}>إدارة معلوماتك الشخصية</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={styles.success} role="status">
          <span className={styles.successIcon}>✓</span>
          {successMessage}
        </div>
      )}

      {/* Error Alert */}
      {errors.general && (
        <div className={styles.alert} role="alert">
          <span className={styles.alertIcon}>⚠️</span>
          {errors.general}
        </div>
      )}

      {/* Profile Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>المعلومات الأساسية</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              تعديل
            </button>
          )}
        </div>

        <div className={styles.cardBody}>
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className={styles.form}
            >
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
                value={formData.email}
                disabled
                helperText="لا يمكن تغيير البريد الإلكتروني"
                dir="ltr"
              />

              <Input
                type="tel"
                label="رقم الهاتف"
                placeholder="+966 5XX XXX XXXX"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                error={errors.phone}
                autoComplete="tel"
                dir="ltr"
              />

              <div className={styles.formActions}>
                <Button
                  type="submit"
                  isLoading={isSaving}
                  loadingText="جاري الحفظ..."
                >
                  حفظ التغييرات
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          ) : (
            <div className={styles.fields}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>الاسم الكامل</span>
                <span className={styles.fieldValue}>{user?.name || '—'}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>البريد الإلكتروني</span>
                <span className={styles.fieldValue} dir="ltr">
                  {user?.email || '—'}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>رقم الهاتف</span>
                <span className={styles.fieldValue} dir="ltr">
                  {user?.phone || '—'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>الأمان</h2>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.securityItem}>
            <div className={styles.securityInfo}>
              <span className={styles.securityLabel}>كلمة المرور</span>
              <span className={styles.securityDesc}>
                تم آخر تحديث منذ فترة
              </span>
            </div>
            <Link href="/change-password" className={styles.securityLink}>
              تغيير كلمة المرور
            </Link>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${styles.card} ${styles.dangerCard}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>منطقة الخطر</h2>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.dangerItem}>
            <div className={styles.dangerInfo}>
              <span className={styles.dangerLabel}>حذف الحساب</span>
              <span className={styles.dangerDesc}>
                سيتم حذف جميع بياناتك نهائياً ولا يمكن استرجاعها
              </span>
            </div>
            <Button variant="outline" size="sm" className={styles.dangerButton}>
              حذف الحساب
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
