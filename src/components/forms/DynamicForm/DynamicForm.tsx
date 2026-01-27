'use client';

import React, { useMemo } from 'react';
import { FormProvider, useFormContext } from './FormContext';
import { getFieldRenderer, fieldRenderers } from './FieldRenderers';
import { ImageFieldRenderer, GalleryFieldRenderer, LocationFieldRenderer } from './MediaFieldRenderers';
import type { FormConfig, FieldConfig, FormSection } from './types';
import { Button } from '@/components/ui/Button/Button';
import styles from './DynamicForm.module.css';

// Register media field renderers
fieldRenderers.image = ImageFieldRenderer;
fieldRenderers.gallery = GalleryFieldRenderer;
fieldRenderers.location = LocationFieldRenderer;

/* ============================================================================
   Dynamic Form Props
   ============================================================================ */

interface DynamicFormProps {
  config: FormConfig;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onChange?: (values: Record<string, unknown>) => void;
  loading?: boolean;
  disabled?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
}

/* ============================================================================
   Dynamic Form Component
   ============================================================================ */

export function DynamicForm({
  config,
  initialValues = {},
  onSubmit,
  onChange,
  loading = false,
  disabled = false,
  validateOnChange = true,
  validateOnBlur = true,
  className,
}: DynamicFormProps) {
  // Flatten all fields from sections if provided
  const allFields = useMemo(() => {
    if (config.fields) {
      return config.fields;
    }
    if (config.sections) {
      return config.sections.flatMap(section => section.fields);
    }
    return [];
  }, [config.fields, config.sections]);

  return (
    <FormProvider
      fields={allFields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onChange={onChange}
      validateOnChange={validateOnChange}
      validateOnBlur={validateOnBlur}
    >
      <FormContent
        config={config}
        loading={loading}
        disabled={disabled}
        className={className}
      />
    </FormProvider>
  );
}

/* ============================================================================
   Form Content (Internal Component)
   ============================================================================ */

interface FormContentProps {
  config: FormConfig;
  loading: boolean;
  disabled: boolean;
  className?: string;
}

function FormContent({ config, loading, disabled, className }: FormContentProps) {
  const { state, actions } = useFormContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.submit();
  };

  const handleReset = () => {
    actions.reset();
  };

  const formClasses = [
    styles.form,
    config.layout && styles[`layout-${config.layout}`],
    config.columns && styles[`columns-${config.columns}`],
    className,
  ].filter(Boolean).join(' ');

  return (
    <form onSubmit={handleSubmit} className={formClasses} noValidate>
      {config.sections ? (
        // Render sections
        config.sections.map((section) => (
          <FormSectionComponent
            key={section.id}
            section={section}
            disabled={disabled || state.isSubmitting}
          />
        ))
      ) : config.fields ? (
        // Render flat fields
        <div className={styles.fieldsGrid}>
          {config.fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              disabled={disabled || state.isSubmitting}
            />
          ))}
        </div>
      ) : null}

      {/* Form Actions */}
      <div className={styles.formActions}>
        <Button
          type="submit"
          loading={loading || state.isSubmitting}
          disabled={disabled || !state.isValid}
        >
          {config.submitLabel || 'حفظ'}
        </Button>
        
        {config.showReset && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={disabled || state.isSubmitting || !state.isDirty}
          >
            {config.resetLabel || 'إعادة تعيين'}
          </Button>
        )}
      </div>
    </form>
  );
}

/* ============================================================================
   Form Section Component
   ============================================================================ */

interface FormSectionComponentProps {
  section: FormSection;
  disabled: boolean;
}

function FormSectionComponent({ section, disabled }: FormSectionComponentProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(section.defaultCollapsed || false);

  return (
    <div className={styles.section}>
      {(section.title || section.collapsible) && (
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrapper}>
            {section.title && <h3 className={styles.sectionTitle}>{section.title}</h3>}
            {section.description && (
              <p className={styles.sectionDescription}>{section.description}</p>
            )}
          </div>
          {section.collapsible && (
            <button
              type="button"
              className={styles.collapseButton}
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          )}
        </div>
      )}
      
      {!isCollapsed && (
        <div className={styles.sectionFields}>
          {section.fields.map((field) => (
            <FormField key={field.name} field={field} disabled={disabled} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   Form Field Component
   ============================================================================ */

interface FormFieldProps {
  field: FieldConfig;
  disabled: boolean;
}

function FormField({ field, disabled }: FormFieldProps) {
  const { state, actions } = useFormContext();
  
  const value = state.values[field.name];
  const error = state.errors[field.name];
  const touched = state.touched[field.name];
  
  const FieldRenderer = getFieldRenderer(field.type);

  // Check conditional visibility
  const isVisible = useMemo(() => {
    if (!field.conditional) return true;
    
    const { show, hide } = field.conditional;
    
    if (hide && evaluateCondition(hide, state.values)) {
      return false;
    }
    
    if (show && !evaluateCondition(show, state.values)) {
      return false;
    }
    
    return true;
  }, [field.conditional, state.values]);

  // Check conditional enabled state
  const isEnabled = useMemo(() => {
    if (!field.conditional) return !field.disabled;
    
    const { enable, disable } = field.conditional;
    
    if (disable && evaluateCondition(disable, state.values)) {
      return false;
    }
    
    if (enable && !evaluateCondition(enable, state.values)) {
      return false;
    }
    
    return !field.disabled;
  }, [field.conditional, field.disabled, state.values]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={[styles.fieldContainer, field.className].filter(Boolean).join(' ')}>
      <FieldRenderer
        field={field}
        value={value}
        error={error}
        touched={touched}
        disabled={disabled || !isEnabled}
        onChange={(val) => actions.setValue(field.name, val)}
        onBlur={() => actions.setTouched(field.name)}
      />
    </div>
  );
}

/* ============================================================================
   Conditional Evaluation
   ============================================================================ */

function evaluateCondition(
  condition: { field: string; condition: string; value: unknown },
  values: Record<string, unknown>
): boolean {
  const fieldValue = values[condition.field];
  
  switch (condition.condition) {
    case 'equals':
      return fieldValue === condition.value;
    case 'notEquals':
      return fieldValue !== condition.value;
    case 'contains':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value);
      }
      if (typeof fieldValue === 'string') {
        return fieldValue.includes(String(condition.value));
      }
      return false;
    case 'greaterThan':
      return Number(fieldValue) > Number(condition.value);
    case 'lessThan':
      return Number(fieldValue) < Number(condition.value);
    case 'in':
      if (Array.isArray(condition.value)) {
        return condition.value.includes(fieldValue);
      }
      return false;
    default:
      return true;
  }
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default DynamicForm;
