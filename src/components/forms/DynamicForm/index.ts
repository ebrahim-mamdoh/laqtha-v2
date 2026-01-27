/**
 * Dynamic Form Engine
 * 
 * A schema-driven form system that supports all 18 field types defined in the specification:
 * - text, textarea, number, decimal, boolean
 * - select, multiselect
 * - date, time, datetime, timeRange
 * - image, gallery, location
 * - phone, email, url
 * - rating, price
 * 
 * Usage:
 * ```tsx
 * import { DynamicForm, createFormConfigFromFields } from '@/components/forms/DynamicForm';
 * 
 * // From backend DynamicFields
 * const config = createFormConfigFromFields(serviceType.requiredFields, {
 *   id: 'service-form',
 *   submitLabel: 'حفظ',
 *   columns: 2,
 * });
 * 
 * <DynamicForm
 *   config={config}
 *   initialValues={initialData}
 *   onSubmit={handleSubmit}
 *   loading={isLoading}
 * />
 * ```
 */

// Main Component
export { DynamicForm, default } from './DynamicForm';

// Context and Hooks
export { FormProvider, useFormContext, useField, validateForm } from './FormContext';

// Types
export type {
  FieldConfig,
  FieldType,
  FieldValidation,
  SelectFieldOption,
  FieldDependency,
  FieldConditional,
  FormSection,
  FormConfig,
  FormState,
  FormActions,
  FieldRendererProps,
  DynamicField,
} from './types';

// Utilities
export { dynamicFieldToFieldConfig, createFormConfigFromFields } from './types';

// Field Renderers (for custom form building)
export {
  TextFieldRenderer,
  EmailFieldRenderer,
  PhoneFieldRenderer,
  UrlFieldRenderer,
  TextareaFieldRenderer,
  NumberFieldRenderer,
  PriceFieldRenderer,
  BooleanFieldRenderer,
  SelectFieldRenderer,
  MultiSelectFieldRenderer,
  DateFieldRenderer,
  TimeFieldRenderer,
  DateTimeFieldRenderer,
  TimeRangeFieldRenderer,
  RatingFieldRenderer,
  fieldRenderers,
  getFieldRenderer,
} from './FieldRenderers';

export {
  ImageFieldRenderer,
  GalleryFieldRenderer,
  LocationFieldRenderer,
} from './MediaFieldRenderers';
