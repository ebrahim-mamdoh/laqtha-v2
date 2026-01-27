/**
 * Dynamic Form Engine Types
 * 
 * Type definitions for the schema-driven form system that supports
 * all 18 field types defined in the FRONTEND_SPECIFICATION.md
 */

import { DynamicField, FieldType } from '@/types';

// Re-export for convenience
export type { DynamicField, FieldType };

/* ============================================================================
   Field Configuration Types
   ============================================================================ */

export interface FieldConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  helperText?: string;
  defaultValue?: unknown;
  validation?: FieldValidation;
  options?: SelectFieldOption[];
  dependsOn?: FieldDependency;
  conditional?: FieldConditional;
  className?: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  custom?: (value: unknown, formValues: Record<string, unknown>) => string | undefined;
}

export interface SelectFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FieldDependency {
  field: string;
  condition: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in';
  value: unknown;
}

export interface FieldConditional {
  show?: FieldDependency;
  hide?: FieldDependency;
  enable?: FieldDependency;
  disable?: FieldDependency;
}

/* ============================================================================
   Field Type Specific Props
   ============================================================================ */

// Text Field
export interface TextFieldProps extends FieldConfig {
  type: 'text' | 'email' | 'phone' | 'url';
}

// Textarea Field
export interface TextareaFieldProps extends FieldConfig {
  type: 'textarea';
  rows?: number;
}

// Number/Decimal Field
export interface NumberFieldProps extends FieldConfig {
  type: 'number' | 'decimal';
  step?: number;
  currency?: string;
}

// Price Field
export interface PriceFieldProps extends FieldConfig {
  type: 'price';
  currency?: string;
  showCurrencySymbol?: boolean;
}

// Boolean Field
export interface BooleanFieldProps extends FieldConfig {
  type: 'boolean';
  variant?: 'checkbox' | 'switch' | 'radio';
  trueLabel?: string;
  falseLabel?: string;
}

// Select Field
export interface SelectFieldProps extends FieldConfig {
  type: 'select';
  options: SelectFieldOption[];
  searchable?: boolean;
}

// MultiSelect Field
export interface MultiSelectFieldProps extends FieldConfig {
  type: 'multiselect';
  options: SelectFieldOption[];
  maxSelections?: number;
}

// Date/Time Fields
export interface DateFieldProps extends FieldConfig {
  type: 'date' | 'time' | 'datetime';
  format?: string;
  minDate?: string;
  maxDate?: string;
}

// Time Range Field
export interface TimeRangeFieldProps extends FieldConfig {
  type: 'timeRange';
  startLabel?: string;
  endLabel?: string;
}

// Image Field
export interface ImageFieldProps extends FieldConfig {
  type: 'image';
  accept?: string;
  maxSize?: number; // in bytes
  aspectRatio?: string;
  previewWidth?: number;
  previewHeight?: number;
}

// Gallery Field
export interface GalleryFieldProps extends FieldConfig {
  type: 'gallery';
  accept?: string;
  maxSize?: number;
  maxImages?: number;
  minImages?: number;
}

// Location Field
export interface LocationFieldProps extends FieldConfig {
  type: 'location';
  showMap?: boolean;
  defaultCenter?: {
    lat: number;
    lng: number;
  };
  defaultZoom?: number;
}

// Rating Field
export interface RatingFieldProps extends FieldConfig {
  type: 'rating';
  maxStars?: number;
  allowHalf?: boolean;
}

/* ============================================================================
   Form Configuration
   ============================================================================ */

export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  fields: FieldConfig[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormConfig {
  id: string;
  sections?: FormSection[];
  fields?: FieldConfig[];
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  layout?: 'vertical' | 'horizontal' | 'inline';
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/* ============================================================================
   Form State Types
   ============================================================================ */

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isValid: boolean;
}

export interface FormActions {
  setValue: (name: string, value: unknown) => void;
  setValues: (values: Record<string, unknown>) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string, touched?: boolean) => void;
  reset: () => void;
  validate: () => Promise<boolean>;
  submit: () => Promise<void>;
}

/* ============================================================================
   Field Renderer Props
   ============================================================================ */

export interface FieldRendererProps {
  field: FieldConfig;
  value: unknown;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

/* ============================================================================
   Utility Types
   ============================================================================ */

// Convert DynamicField from backend to FieldConfig
export function dynamicFieldToFieldConfig(field: DynamicField): FieldConfig {
  const config: FieldConfig = {
    name: field.name,
    type: field.type,
    label: field.label,
    placeholder: field.placeholder,
    required: field.required,
    helperText: field.helperText,
    defaultValue: field.defaultValue,
  };

  // Add validation rules
  if (field.validation) {
    config.validation = {
      min: field.validation.min,
      max: field.validation.max,
      minLength: field.validation.minLength,
      maxLength: field.validation.maxLength,
      pattern: field.validation.pattern,
    };
  }

  // Add options for select fields
  if (field.options && (field.type === 'select' || field.type === 'multiselect')) {
    config.options = field.options.map(opt => ({
      value: opt.value,
      label: opt.label,
    }));
  }

  return config;
}

// Convert array of DynamicFields to FormConfig
export function createFormConfigFromFields(
  fields: DynamicField[],
  options?: Partial<FormConfig>
): FormConfig {
  return {
    id: options?.id || 'dynamic-form',
    fields: fields.map(dynamicFieldToFieldConfig),
    ...options,
  };
}
