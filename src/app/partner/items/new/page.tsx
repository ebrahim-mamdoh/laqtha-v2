'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useServiceType, useCreatePartnerItem } from '@/hooks';
import { PartnerLayout } from '@/layouts';
import { DynamicForm, createFormConfigFromFields, FormConfig } from '@/components/forms/DynamicForm';
import { Button, Card, Spinner } from '@/components/ui';
import { useToast } from '@/components/ui/Toast/Toast';
import { ServiceType } from '@/types';
import styles from './page.module.css';

export default function NewPartnerItemPage() {
  const router = useRouter();
  const { partner, isPartnerLoading } = useAuth();
  const { showToast } = useToast();

  // Get the partner's service type
  const serviceTypeId = typeof partner?.serviceTypeId === 'object' 
    ? partner.serviceTypeId._id 
    : partner?.serviceTypeId;

  // Fetch service type details to get required fields
  const { data: serviceTypeData, isLoading: isLoadingServiceType } = useServiceType(
    serviceTypeId || ''
  );

  const createItemMutation = useCreatePartnerItem();

  // Form config based on service type fields
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);

  // Generate form config when service type is loaded
  useEffect(() => {
    if (serviceTypeData?.data?.requiredFields) {
      const serviceType = serviceTypeData.data;
      
      // Create form config with basic fields + dynamic fields
      const config = createFormConfigFromFields(
        [
          // Basic required fields
          {
            key: 'name',
            label: 'اسم العنصر',
            type: 'text' as const,
            required: true,
            placeholder: 'أدخل اسم العنصر',
          },
          {
            key: 'description',
            label: 'الوصف',
            type: 'textarea' as const,
            required: false,
            placeholder: 'أدخل وصف العنصر',
          },
          // Add service type specific fields
          ...serviceType.requiredFields,
        ],
        {
          id: 'new-item-form',
          submitLabel: 'إنشاء العنصر',
          columns: 2,
          sections: [
            {
              id: 'basic',
              title: 'المعلومات الأساسية',
              description: 'معلومات العنصر الرئيسية',
              fields: ['name', 'description'],
            },
            {
              id: 'details',
              title: `تفاصيل ${serviceType.name}`,
              description: 'معلومات إضافية خاصة بنوع الخدمة',
              fields: serviceType.requiredFields.map((f) => f.key),
            },
          ],
        }
      );

      setFormConfig(config);
    }
  }, [serviceTypeData]);

  // Handle form submission
  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      // Extract basic fields
      const { name, description, ...dynamicFields } = data;

      await createItemMutation.mutateAsync({
        name: name as string,
        description: description as string,
        dynamicFields,
      });

      showToast({
        type: 'success',
        message: 'تم إنشاء العنصر بنجاح',
      });

      router.push('/partner/items');
    } catch (error) {
      showToast({
        type: 'error',
        message: 'فشل في إنشاء العنصر. يرجى المحاولة مرة أخرى.',
      });
    }
  };

  // Loading state
  if (isPartnerLoading || isLoadingServiceType) {
    return (
      <PartnerLayout>
        <div className={styles.loadingContainer}>
          <Spinner size="lg" />
          <p>جاري تحميل النموذج...</p>
        </div>
      </PartnerLayout>
    );
  }

  // No service type found
  if (!serviceTypeData?.data) {
    return (
      <PartnerLayout>
        <div className={styles.errorContainer}>
          <h2>لا يمكن تحميل نوع الخدمة</h2>
          <p>حدث خطأ أثناء تحميل نوع الخدمة. يرجى المحاولة مرة أخرى.</p>
          <Button variant="outline" onClick={() => router.push('/partner/items')}>
            العودة للقائمة
          </Button>
        </div>
      </PartnerLayout>
    );
  }

  const serviceType = serviceTypeData.data;

  return (
    <PartnerLayout>
      <div className={styles.newItemPage}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/partner/dashboard">لوحة التحكم</Link>
          <span className={styles.separator}>/</span>
          <Link href="/partner/items">عناصر الخدمة</Link>
          <span className={styles.separator}>/</span>
          <span>إضافة عنصر جديد</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>إضافة عنصر جديد</h1>
            <p>أضف عنصر خدمة جديد من نوع "{serviceType.name}"</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/partner/items')}>
            إلغاء
          </Button>
        </div>

        {/* Form Card */}
        <Card variant="bordered" className={styles.formCard}>
          {formConfig ? (
            <DynamicForm
              config={formConfig}
              onSubmit={handleSubmit}
              loading={createItemMutation.isPending}
              onCancel={() => router.push('/partner/items')}
            />
          ) : (
            <div className={styles.loadingContainer}>
              <Spinner size="md" />
              <p>جاري إنشاء النموذج...</p>
            </div>
          )}
        </Card>

        {/* Help Text */}
        <Card variant="flat" className={styles.helpCard}>
          <h3>نصائح لإنشاء عنصر ناجح</h3>
          <ul>
            <li>
              <strong>اسم واضح:</strong> استخدم اسماً وصفياً يسهل على العملاء فهم ما تقدمه.
            </li>
            <li>
              <strong>وصف شامل:</strong> قدم وصفاً مفصلاً يتضمن جميع المميزات والتفاصيل المهمة.
            </li>
            <li>
              <strong>صور عالية الجودة:</strong> استخدم صوراً واضحة وجذابة تعرض العنصر بشكل احترافي.
            </li>
            <li>
              <strong>أسعار دقيقة:</strong> تأكد من إدخال الأسعار بشكل صحيح ومحدث.
            </li>
          </ul>
        </Card>
      </div>
    </PartnerLayout>
  );
}
