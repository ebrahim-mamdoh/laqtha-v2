// ============================================================================
// Zod Validation Schemas for Forms
// Based on FRONTEND_SPECIFICATION.md
// ============================================================================

import { z } from 'zod';
import type { FieldType, DynamicField } from '@/types';

// ============================================================================
// Common Validators
// ============================================================================

export const emailSchema = z
  .string()
  .min(1, 'البريد الإلكتروني مطلوب')
  .email('البريد الإلكتروني غير صحيح');

export const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
  .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'يجب أن تحتوي على رمز خاص واحد على الأقل');

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, 'رقم الهاتف غير صحيح')
  .optional()
  .or(z.literal(''));

export const arabicTextSchema = z
  .string()
  .min(1, 'هذا الحقل مطلوب');

export const optionalArabicTextSchema = z.string().optional().or(z.literal(''));

export const urlSchema = z
  .string()
  .url('الرابط غير صحيح')
  .optional()
  .or(z.literal(''));

// ============================================================================
// Authentication Schemas
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'يجب الموافقة على شروط الاستخدام',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, 'رمز التحقق يجب أن يكون 4 أرقام')
    .regex(/^[0-9]+$/, 'رمز التحقق يجب أن يحتوي على أرقام فقط'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: z.string().length(4, 'رمز التحقق يجب أن يكون 4 أرقام'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });

// ============================================================================
// Partner Registration Schemas
// ============================================================================

export const partnerStep1Schema = z.object({
  serviceTypeKey: z.string().min(1, 'يرجى اختيار نوع الخدمة'),
});

export const partnerStep2BaseSchema = z.object({
  businessName: z.string().min(2, 'اسم المنشأة مطلوب'),
  email: emailSchema,
  phone: z.string().min(10, 'رقم الهاتف مطلوب'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'اسم العائلة مطلوب'),
  city: z.string().min(2, 'المدينة مطلوبة'),
  address: z.string().min(5, 'العنوان مطلوب'),
  website: urlSchema,
});

export const partnerStep3Schema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'يجب الموافقة على شروط الاستخدام',
  }),
});

// Full partner registration schema (to be extended with dynamic fields)
export const partnerRegisterSchema = partnerStep2BaseSchema
  .extend({
    serviceTypeKey: z.string().min(1, 'يرجى اختيار نوع الخدمة'),
    serviceTypeData: z.record(z.unknown()).optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'يجب الموافقة على شروط الاستخدام',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });

export const partnerProfileUpdateSchema = z.object({
  businessName: z.string().min(2, 'اسم المنشأة مطلوب').optional(),
  phone: z.string().min(10, 'رقم الهاتف مطلوب').optional(),
  firstName: z.string().min(2, 'الاسم الأول مطلوب').optional(),
  lastName: z.string().min(2, 'اسم العائلة مطلوب').optional(),
  city: z.string().min(2, 'المدينة مطلوبة').optional(),
  address: z.string().min(5, 'العنوان مطلوب').optional(),
  website: urlSchema,
  serviceTypeData: z.record(z.unknown()).optional(),
});

// ============================================================================
// Service Type Schemas (Admin)
// ============================================================================

export const fieldOptionSchema = z.object({
  value: z.string().min(1, 'القيمة مطلوبة'),
  label: z.object({
    ar: z.string().min(1, 'التسمية بالعربية مطلوبة'),
    en: z.string().optional(),
  }),
});

export const fieldValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  patternMessage: z.string().optional(),
});

export const dynamicFieldSchema = z.object({
  key: z
    .string()
    .min(1, 'المفتاح مطلوب')
    .regex(/^[a-z][a-z0-9_]*$/, 'المفتاح يجب أن يكون بالإنجليزية بدون مسافات'),
  type: z.enum([
    'text',
    'textarea',
    'number',
    'decimal',
    'boolean',
    'select',
    'multiselect',
    'date',
    'time',
    'datetime',
    'image',
    'gallery',
    'location',
    'phone',
    'email',
    'url',
    'rating',
    'price',
    'timeRange',
  ] as const),
  label: z.object({
    ar: z.string().min(1, 'التسمية بالعربية مطلوبة'),
    en: z.string().optional(),
  }),
  placeholder: z
    .object({
      ar: z.string().optional(),
      en: z.string().optional(),
    })
    .optional(),
  required: z.boolean().default(false),
  showInList: z.boolean().default(false),
  options: z.array(fieldOptionSchema).optional(),
  validation: fieldValidationSchema.optional(),
  defaultValue: z.unknown().optional(),
  helpText: z
    .object({
      ar: z.string().optional(),
      en: z.string().optional(),
    })
    .optional(),
  order: z.number().default(0),
});

export const serviceTypeSchema = z.object({
  key: z
    .string()
    .min(1, 'المفتاح مطلوب')
    .regex(/^[a-z][a-z0-9_]*$/, 'المفتاح يجب أن يكون بالإنجليزية بدون مسافات'),
  icon: z.string().min(1, 'الأيقونة مطلوبة'),
  label: z.object({
    ar: z.string().min(1, 'الاسم بالعربية مطلوب'),
    en: z.string().optional(),
  }),
  itemLabel: z.object({
    ar: z.string().min(1, 'تسمية العنصر بالعربية مطلوبة'),
    en: z.string().optional(),
  }),
  commissionRate: z
    .number()
    .min(0, 'نسبة العمولة لا يمكن أن تكون سالبة')
    .max(100, 'نسبة العمولة لا يمكن أن تتجاوز 100%'),
  fields: z.array(dynamicFieldSchema).default([]),
  itemFields: z.array(dynamicFieldSchema).default([]),
});

// ============================================================================
// Service Item Schemas
// ============================================================================

export const serviceItemBaseSchema = z.object({
  name: z.object({
    ar: z.string().min(1, 'اسم العنصر بالعربية مطلوب'),
    en: z.string().optional(),
  }),
  description: z
    .object({
      ar: z.string().optional(),
      en: z.string().optional(),
    })
    .optional(),
  displayOrder: z.number().int().min(0).default(0).optional(),
  isFeatured: z.boolean().default(false).optional(),
});

// ============================================================================
// Admin Action Schemas
// ============================================================================

export const approvePartnerSchema = z.object({
  notes: z.string().optional(),
});

export const rejectPartnerSchema = z.object({
  reason: z.string().min(10, 'سبب الرفض يجب أن يكون 10 أحرف على الأقل'),
});

export const requestChangesSchema = z.object({
  changes: z.string().min(10, 'التعديلات المطلوبة يجب أن تكون 10 أحرف على الأقل'),
});

export const suspendPartnerSchema = z.object({
  reason: z.string().min(10, 'سبب الإيقاف يجب أن يكون 10 أحرف على الأقل'),
  duration: z.number().int().min(1).max(365).optional(),
});

export const reinstatePartnerSchema = z.object({
  notes: z.string().optional(),
});

export const hideItemSchema = z.object({
  reason: z.string().min(10, 'سبب الإخفاء يجب أن يكون 10 أحرف على الأقل'),
});

// ============================================================================
// Dynamic Schema Generator
// ============================================================================

/**
 * Generates a Zod schema dynamically based on field definitions
 * This is the core of the dynamic form engine
 */
export function generateDynamicSchema(fields: DynamicField[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema = getFieldTypeSchema(field);

    // Apply required validation
    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }

    schemaShape[field.key] = fieldSchema;
  }

  return z.object(schemaShape);
}

/**
 * Returns the appropriate Zod schema for a field type
 */
function getFieldTypeSchema(field: DynamicField): z.ZodTypeAny {
  const { type, validation, options } = field;

  switch (type) {
    case 'text':
    case 'textarea':
      let textSchema = z.string();
      if (validation?.minLength) {
        textSchema = textSchema.min(validation.minLength, `الحد الأدنى ${validation.minLength} أحرف`);
      }
      if (validation?.maxLength) {
        textSchema = textSchema.max(validation.maxLength, `الحد الأقصى ${validation.maxLength} أحرف`);
      }
      if (validation?.pattern) {
        textSchema = textSchema.regex(
          new RegExp(validation.pattern),
          validation.patternMessage || 'القيمة غير صحيحة'
        );
      }
      return textSchema;

    case 'number':
    case 'decimal':
      let numSchema = z.number({ invalid_type_error: 'يجب إدخال رقم' });
      if (validation?.min !== undefined) {
        numSchema = numSchema.min(validation.min, `الحد الأدنى ${validation.min}`);
      }
      if (validation?.max !== undefined) {
        numSchema = numSchema.max(validation.max, `الحد الأقصى ${validation.max}`);
      }
      return numSchema;

    case 'boolean':
      return z.boolean();

    case 'select':
      if (options?.length) {
        const values = options.map((o) => o.value) as [string, ...string[]];
        return z.enum(values, { errorMap: () => ({ message: 'يرجى اختيار قيمة صحيحة' }) });
      }
      return z.string();

    case 'multiselect':
      if (options?.length) {
        const values = options.map((o) => o.value);
        return z.array(z.string()).refine(
          (arr) => arr.every((v) => values.includes(v)),
          { message: 'يرجى اختيار قيم صحيحة' }
        );
      }
      return z.array(z.string());

    case 'date':
      return z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ غير صحيحة');

    case 'time':
      return z.string().regex(/^\d{2}:\d{2}$/, 'صيغة الوقت غير صحيحة');

    case 'datetime':
      return z.string().datetime({ message: 'صيغة التاريخ والوقت غير صحيحة' });

    case 'image':
    case 'url':
      return z.string().url('الرابط غير صحيح');

    case 'gallery':
      return z.array(z.string().url('الرابط غير صحيح'));

    case 'location':
      return z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      });

    case 'phone':
      return z.string().regex(/^\+?[0-9]{10,15}$/, 'رقم الهاتف غير صحيح');

    case 'email':
      return z.string().email('البريد الإلكتروني غير صحيح');

    case 'rating':
      return z.number().int().min(1).max(5);

    case 'price':
      return z.object({
        amount: z.number().min(0, 'السعر يجب أن يكون موجباً'),
        currency: z.string().default('SAR'),
      });

    case 'timeRange':
      return z.object({
        start: z.string().regex(/^\d{2}:\d{2}$/, 'صيغة الوقت غير صحيحة'),
        end: z.string().regex(/^\d{2}:\d{2}$/, 'صيغة الوقت غير صحيحة'),
      });

    default:
      return z.unknown();
  }
}

// ============================================================================
// Type Exports
// ============================================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type PartnerRegisterFormData = z.infer<typeof partnerRegisterSchema>;
export type PartnerProfileUpdateFormData = z.infer<typeof partnerProfileUpdateSchema>;
export type ServiceTypeFormData = z.infer<typeof serviceTypeSchema>;
export type DynamicFieldFormData = z.infer<typeof dynamicFieldSchema>;
export type ApprovePartnerFormData = z.infer<typeof approvePartnerSchema>;
export type RejectPartnerFormData = z.infer<typeof rejectPartnerSchema>;
export type RequestChangesFormData = z.infer<typeof requestChangesSchema>;
export type SuspendPartnerFormData = z.infer<typeof suspendPartnerSchema>;
export type HideItemFormData = z.infer<typeof hideItemSchema>;
