'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/layouts/AdminSidebar/AdminSidebar';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { useCreateServiceType } from '@/hooks/useAdmin';
import { FIELD_TYPES, FieldType, DynamicField } from '@/types';
import styles from './page.module.css';

interface LocalizedText {
  ar: string;
  en: string;
}

interface FormData {
  key: string;
  icon: string;
  label: LocalizedText;
  itemLabel: LocalizedText;
  commissionRate: number;
}

const initialFormData: FormData = {
  key: '',
  icon: '🏢',
  label: { ar: '', en: '' },
  itemLabel: { ar: '', en: '' },
  commissionRate: 10,
};

const initialField: Omit<DynamicField, 'order'> = {
  key: '',
  type: 'text',
  label: { ar: '', en: '' },
  placeholder: { ar: '', en: '' },
  required: false,
  showInList: false,
  options: [],
  validation: {},
  helpText: { ar: '', en: '' },
};

export default function NewServiceTypePage() {
  const router = useRouter();
  const createServiceType = useCreateServiceType();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [itemFields, setItemFields] = useState<DynamicField[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'fields' | 'itemFields'>('basic');
  const [editingField, setEditingField] = useState<{ index: number; type: 'fields' | 'itemFields' } | null>(null);
  const [fieldForm, setFieldForm] = useState<Omit<DynamicField, 'order'>>(initialField);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.key.trim()) {
      newErrors.key = 'المعرف مطلوب';
    } else if (!/^[a-z][a-z0-9_]*$/.test(formData.key)) {
      newErrors.key = 'المعرف يجب أن يبدأ بحرف صغير ويحتوي فقط على أحرف صغيرة وأرقام و _';
    }

    if (!formData.icon.trim()) {
      newErrors.icon = 'الأيقونة مطلوبة';
    }

    if (!formData.label.ar.trim()) {
      newErrors['label.ar'] = 'الاسم بالعربية مطلوب';
    }

    if (!formData.itemLabel.ar.trim()) {
      newErrors['itemLabel.ar'] = 'اسم العنصر بالعربية مطلوب';
    }

    if (formData.commissionRate < 0 || formData.commissionRate > 100) {
      newErrors.commissionRate = 'نسبة العمولة يجب أن تكون بين 0 و 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setActiveTab('basic');
      return;
    }

    try {
      await createServiceType.mutateAsync({
        ...formData,
        fields,
        itemFields,
      });
      router.push('/admin/service-types');
    } catch (error) {
      console.error('Failed to create service type:', error);
    }
  };

  const addField = (type: 'fields' | 'itemFields') => {
    setEditingField({ index: -1, type });
    setFieldForm(initialField);
  };

  const editField = (index: number, type: 'fields' | 'itemFields') => {
    const targetFields = type === 'fields' ? fields : itemFields;
    const field = targetFields[index];
    setFieldForm({
      key: field.key,
      type: field.type,
      label: field.label as LocalizedText,
      placeholder: field.placeholder || { ar: '', en: '' },
      required: field.required,
      showInList: field.showInList,
      options: field.options || [],
      validation: field.validation || {},
      helpText: field.helpText || { ar: '', en: '' },
    });
    setEditingField({ index, type });
  };

  const saveField = () => {
    if (!editingField) return;

    if (!fieldForm.key.trim() || !fieldForm.label.ar.trim()) {
      return;
    }

    const { type, index } = editingField;
    const targetFields = type === 'fields' ? fields : itemFields;
    const setTargetFields = type === 'fields' ? setFields : setItemFields;

    if (index === -1) {
      // Adding new field
      setTargetFields([
        ...targetFields,
        { ...fieldForm, order: targetFields.length } as DynamicField,
      ]);
    } else {
      // Editing existing field
      const updated = [...targetFields];
      updated[index] = { ...fieldForm, order: index } as DynamicField;
      setTargetFields(updated);
    }

    setEditingField(null);
    setFieldForm(initialField);
  };

  const removeField = (index: number, type: 'fields' | 'itemFields') => {
    const targetFields = type === 'fields' ? fields : itemFields;
    const setTargetFields = type === 'fields' ? setFields : setItemFields;
    setTargetFields(targetFields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: 'up' | 'down', type: 'fields' | 'itemFields') => {
    const targetFields = type === 'fields' ? fields : itemFields;
    const setTargetFields = type === 'fields' ? setFields : setItemFields;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= targetFields.length) return;

    const updated = [...targetFields];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setTargetFields(updated.map((f, i) => ({ ...f, order: i })));
  };

  const addOption = () => {
    setFieldForm({
      ...fieldForm,
      options: [...(fieldForm.options || []), { value: '', label: { ar: '', en: '' } }],
    });
  };

  const updateOption = (optIndex: number, field: 'value' | 'ar' | 'en', value: string) => {
    const options = [...(fieldForm.options || [])];
    if (field === 'value') {
      options[optIndex] = { ...options[optIndex], value };
    } else {
      options[optIndex] = {
        ...options[optIndex],
        label: { ...options[optIndex].label, [field]: value },
      };
    }
    setFieldForm({ ...fieldForm, options });
  };

  const removeOption = (optIndex: number) => {
    setFieldForm({
      ...fieldForm,
      options: (fieldForm.options || []).filter((_, i) => i !== optIndex),
    });
  };

  const renderFieldsList = (targetFields: DynamicField[], type: 'fields' | 'itemFields') => (
    <div className={styles.fieldsList}>
      {targetFields.length === 0 ? (
        <div className={styles.noFieldsMessage}>
          <p>لا توجد حقول مضافة</p>
          <p>اضغط على "إضافة حقل" لإضافة حقل جديد</p>
        </div>
      ) : (
        targetFields.map((field, index) => (
          <div key={field.key} className={styles.fieldItem}>
            <div className={styles.fieldItemDrag}>
              <button
                type="button"
                onClick={() => moveField(index, 'up', type)}
                disabled={index === 0}
                className={styles.moveButton}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveField(index, 'down', type)}
                disabled={index === targetFields.length - 1}
                className={styles.moveButton}
              >
                ▼
              </button>
            </div>
            <div className={styles.fieldItemInfo}>
              <span className={styles.fieldItemKey}>{field.key}</span>
              <span className={styles.fieldItemLabel}>{field.label.ar}</span>
              <span className={styles.fieldItemType}>{field.type}</span>
              {field.required && <span className={styles.fieldItemRequired}>مطلوب</span>}
            </div>
            <div className={styles.fieldItemActions}>
              <button
                type="button"
                onClick={() => editField(index, type)}
                className={styles.editButton}
              >
                تعديل
              </button>
              <button
                type="button"
                onClick={() => removeField(index, type)}
                className={styles.deleteButton}
              >
                حذف
              </button>
            </div>
          </div>
        ))
      )}
      <Button type="button" variant="outline" onClick={() => addField(type)}>
        + إضافة حقل
      </Button>
    </div>
  );

  const renderFieldEditor = () => {
    if (!editingField) return null;

    const needsOptions = ['select', 'multiSelect', 'radio', 'checkboxGroup'].includes(fieldForm.type);

    return (
      <div className={styles.fieldEditor}>
        <div className={styles.fieldEditorHeader}>
          <h3>{editingField.index === -1 ? 'إضافة حقل جديد' : 'تعديل الحقل'}</h3>
          <button
            type="button"
            onClick={() => setEditingField(null)}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>
        <div className={styles.fieldEditorBody}>
          <div className={styles.fieldEditorGrid}>
            {/* Key */}
            <div className={styles.formGroup}>
              <label>المعرف (Key) *</label>
              <input
                type="text"
                value={fieldForm.key}
                onChange={(e) => setFieldForm({ ...fieldForm, key: e.target.value })}
                placeholder="مثال: phone_number"
                dir="ltr"
              />
            </div>

            {/* Type */}
            <div className={styles.formGroup}>
              <label>نوع الحقل *</label>
              <select
                value={fieldForm.type}
                onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value as FieldType })}
              >
                {FIELD_TYPES.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>

            {/* Label AR */}
            <div className={styles.formGroup}>
              <label>الاسم بالعربية *</label>
              <input
                type="text"
                value={fieldForm.label.ar}
                onChange={(e) =>
                  setFieldForm({ ...fieldForm, label: { ...fieldForm.label, ar: e.target.value } })
                }
                placeholder="مثال: رقم الهاتف"
              />
            </div>

            {/* Label EN */}
            <div className={styles.formGroup}>
              <label>الاسم بالإنجليزية</label>
              <input
                type="text"
                value={fieldForm.label.en || ''}
                onChange={(e) =>
                  setFieldForm({ ...fieldForm, label: { ...fieldForm.label, en: e.target.value } })
                }
                placeholder="e.g. Phone Number"
                dir="ltr"
              />
            </div>

            {/* Placeholder AR */}
            <div className={styles.formGroup}>
              <label>النص التوضيحي بالعربية</label>
              <input
                type="text"
                value={fieldForm.placeholder?.ar || ''}
                onChange={(e) =>
                  setFieldForm({
                    ...fieldForm,
                    placeholder: { ...fieldForm.placeholder, ar: e.target.value },
                  })
                }
                placeholder="مثال: أدخل رقم الهاتف"
              />
            </div>

            {/* Placeholder EN */}
            <div className={styles.formGroup}>
              <label>النص التوضيحي بالإنجليزية</label>
              <input
                type="text"
                value={fieldForm.placeholder?.en || ''}
                onChange={(e) =>
                  setFieldForm({
                    ...fieldForm,
                    placeholder: { ...fieldForm.placeholder, en: e.target.value },
                  })
                }
                placeholder="e.g. Enter phone number"
                dir="ltr"
              />
            </div>

            {/* Required & ShowInList */}
            <div className={styles.formGroup}>
              <label>خيارات</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={fieldForm.required}
                    onChange={(e) => setFieldForm({ ...fieldForm, required: e.target.checked })}
                  />
                  حقل مطلوب
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={fieldForm.showInList}
                    onChange={(e) => setFieldForm({ ...fieldForm, showInList: e.target.checked })}
                  />
                  عرض في القائمة
                </label>
              </div>
            </div>

            {/* Help Text */}
            <div className={styles.formGroup}>
              <label>نص المساعدة بالعربية</label>
              <input
                type="text"
                value={fieldForm.helpText?.ar || ''}
                onChange={(e) =>
                  setFieldForm({
                    ...fieldForm,
                    helpText: { ...fieldForm.helpText, ar: e.target.value },
                  })
                }
                placeholder="نص توضيحي إضافي"
              />
            </div>
          </div>

          {/* Options for select/radio/checkbox */}
          {needsOptions && (
            <div className={styles.optionsSection}>
              <h4>الخيارات</h4>
              {(fieldForm.options || []).map((opt, optIndex) => (
                <div key={optIndex} className={styles.optionRow}>
                  <input
                    type="text"
                    value={opt.value}
                    onChange={(e) => updateOption(optIndex, 'value', e.target.value)}
                    placeholder="القيمة"
                    dir="ltr"
                  />
                  <input
                    type="text"
                    value={opt.label.ar}
                    onChange={(e) => updateOption(optIndex, 'ar', e.target.value)}
                    placeholder="النص بالعربية"
                  />
                  <input
                    type="text"
                    value={opt.label.en || ''}
                    onChange={(e) => updateOption(optIndex, 'en', e.target.value)}
                    placeholder="النص بالإنجليزية"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(optIndex)}
                    className={styles.removeOptionButton}
                  >
                    ×
                  </button>
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={addOption}>
                + إضافة خيار
              </Button>
            </div>
          )}
        </div>
        <div className={styles.fieldEditorFooter}>
          <Button type="button" variant="outline" onClick={() => setEditingField(null)}>
            إلغاء
          </Button>
          <Button type="button" onClick={saveField}>
            حفظ الحقل
          </Button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className={styles.page}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/admin/dashboard">لوحة التحكم</Link>
          <span className={styles.breadcrumbSeparator}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <Link href="/admin/service-types">أنواع الخدمات</Link>
          <span className={styles.breadcrumbSeparator}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <span className={styles.breadcrumbCurrent}>إضافة نوع جديد</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>إضافة نوع خدمة جديد</h1>
            <p>قم بتعريف نوع خدمة جديد مع الحقول المخصصة</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'basic' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              المعلومات الأساسية
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'fields' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('fields')}
            >
              حقول الشريك ({fields.length})
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'itemFields' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('itemFields')}
            >
              حقول العنصر ({itemFields.length})
            </button>
          </div>

          {/* Tab Content */}
          <Card className={styles.formCard}>
            {activeTab === 'basic' && (
              <div className={styles.basicForm}>
                <div className={styles.formGrid}>
                  {/* Key */}
                  <div className={styles.formGroup}>
                    <label htmlFor="key">المعرف (Key) *</label>
                    <input
                      id="key"
                      type="text"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      placeholder="مثال: hotel"
                      dir="ltr"
                      className={errors.key ? styles.inputError : ''}
                    />
                    {errors.key && <span className={styles.errorText}>{errors.key}</span>}
                    <span className={styles.helpText}>
                      يستخدم في الروابط وقاعدة البيانات (أحرف صغيرة وأرقام فقط)
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={styles.formGroup}>
                    <label htmlFor="icon">الأيقونة *</label>
                    <div className={styles.iconInput}>
                      <span className={styles.iconPreview}>{formData.icon}</span>
                      <input
                        id="icon"
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="🏨"
                        className={errors.icon ? styles.inputError : ''}
                      />
                    </div>
                    {errors.icon && <span className={styles.errorText}>{errors.icon}</span>}
                    <span className={styles.helpText}>رمز إيموجي واحد</span>
                  </div>

                  {/* Label AR */}
                  <div className={styles.formGroup}>
                    <label htmlFor="labelAr">الاسم بالعربية *</label>
                    <input
                      id="labelAr"
                      type="text"
                      value={formData.label.ar}
                      onChange={(e) =>
                        setFormData({ ...formData, label: { ...formData.label, ar: e.target.value } })
                      }
                      placeholder="مثال: فنادق"
                      className={errors['label.ar'] ? styles.inputError : ''}
                    />
                    {errors['label.ar'] && <span className={styles.errorText}>{errors['label.ar']}</span>}
                  </div>

                  {/* Label EN */}
                  <div className={styles.formGroup}>
                    <label htmlFor="labelEn">الاسم بالإنجليزية</label>
                    <input
                      id="labelEn"
                      type="text"
                      value={formData.label.en}
                      onChange={(e) =>
                        setFormData({ ...formData, label: { ...formData.label, en: e.target.value } })
                      }
                      placeholder="e.g. Hotels"
                      dir="ltr"
                    />
                  </div>

                  {/* Item Label AR */}
                  <div className={styles.formGroup}>
                    <label htmlFor="itemLabelAr">اسم العنصر بالعربية *</label>
                    <input
                      id="itemLabelAr"
                      type="text"
                      value={formData.itemLabel.ar}
                      onChange={(e) =>
                        setFormData({ ...formData, itemLabel: { ...formData.itemLabel, ar: e.target.value } })
                      }
                      placeholder="مثال: فندق"
                      className={errors['itemLabel.ar'] ? styles.inputError : ''}
                    />
                    {errors['itemLabel.ar'] && <span className={styles.errorText}>{errors['itemLabel.ar']}</span>}
                    <span className={styles.helpText}>اسم المفرد للعنصر (مثل: فندق، مطعم، طبيب)</span>
                  </div>

                  {/* Item Label EN */}
                  <div className={styles.formGroup}>
                    <label htmlFor="itemLabelEn">اسم العنصر بالإنجليزية</label>
                    <input
                      id="itemLabelEn"
                      type="text"
                      value={formData.itemLabel.en}
                      onChange={(e) =>
                        setFormData({ ...formData, itemLabel: { ...formData.itemLabel, en: e.target.value } })
                      }
                      placeholder="e.g. Hotel"
                      dir="ltr"
                    />
                  </div>

                  {/* Commission Rate */}
                  <div className={styles.formGroup}>
                    <label htmlFor="commissionRate">نسبة العمولة (%) *</label>
                    <input
                      id="commissionRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={formData.commissionRate}
                      onChange={(e) =>
                        setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 0 })
                      }
                      className={errors.commissionRate ? styles.inputError : ''}
                    />
                    {errors.commissionRate && (
                      <span className={styles.errorText}>{errors.commissionRate}</span>
                    )}
                    <span className={styles.helpText}>النسبة المئوية من كل حجز</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fields' && (
              <div className={styles.fieldsTab}>
                <div className={styles.fieldsDescription}>
                  <h3>حقول تسجيل الشريك</h3>
                  <p>
                    هذه الحقول ستظهر للشريك عند التسجيل في هذا النوع من الخدمات. يمكنك إضافة حقول
                    مخصصة حسب متطلبات كل نوع خدمة.
                  </p>
                </div>
                {renderFieldsList(fields, 'fields')}
              </div>
            )}

            {activeTab === 'itemFields' && (
              <div className={styles.fieldsTab}>
                <div className={styles.fieldsDescription}>
                  <h3>حقول العنصر ({formData.itemLabel.ar || 'العنصر'})</h3>
                  <p>
                    هذه الحقول ستظهر للشريك عند إضافة عنصر جديد (مثل: فندق، مطعم، منتج). يمكنك
                    تخصيص الحقول حسب نوع العنصر.
                  </p>
                </div>
                {renderFieldsList(itemFields, 'itemFields')}
              </div>
            )}
          </Card>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/service-types">
              <Button type="button" variant="outline">
                إلغاء
              </Button>
            </Link>
            <Button type="submit" loading={createServiceType.isPending}>
              إنشاء نوع الخدمة
            </Button>
          </div>
        </form>

        {/* Field Editor Modal */}
        {editingField && <div className={styles.modalOverlay}>{renderFieldEditor()}</div>}
      </div>
    </AdminLayout>
  );
}
