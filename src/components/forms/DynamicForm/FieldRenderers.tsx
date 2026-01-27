'use client';

import React from 'react';
import type { FieldRendererProps, FieldConfig } from './types';
import { Input, Textarea } from '@/components/ui/Input/Input';
import { Select, MultiSelect } from '@/components/ui/Select/Select';
import styles from './FieldRenderers.module.css';

/* ============================================================================
   Text Field Renderer
   ============================================================================ */

export function TextFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  return (
    <Input
      name={field.name}
      label={field.label}
      placeholder={field.placeholder}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      className={field.className}
    />
  );
}

/* ============================================================================
   Email Field Renderer
   ============================================================================ */

export function EmailFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  return (
    <Input
      type="email"
      name={field.name}
      label={field.label}
      placeholder={field.placeholder || 'example@domain.com'}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      className={field.className}
    />
  );
}

/* ============================================================================
   Phone Field Renderer
   ============================================================================ */

export function PhoneFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  return (
    <Input
      type="tel"
      name={field.name}
      label={field.label}
      placeholder={field.placeholder || '05xxxxxxxx'}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      className={field.className}
      dir="ltr"
    />
  );
}

/* ============================================================================
   URL Field Renderer
   ============================================================================ */

export function UrlFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  return (
    <Input
      type="url"
      name={field.name}
      label={field.label}
      placeholder={field.placeholder || 'https://example.com'}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      className={field.className}
      dir="ltr"
    />
  );
}

/* ============================================================================
   Textarea Field Renderer
   ============================================================================ */

export function TextareaFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  return (
    <Textarea
      name={field.name}
      label={field.label}
      placeholder={field.placeholder}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      rows={(field as { rows?: number }).rows || 4}
      className={field.className}
    />
  );
}

/* ============================================================================
   Number Field Renderer
   ============================================================================ */

export function NumberFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const step = field.type === 'decimal' ? (field as { step?: number }).step || 0.01 : 1;
  
  return (
    <Input
      type="number"
      name={field.name}
      label={field.label}
      placeholder={field.placeholder}
      value={value !== undefined && value !== null ? String(value) : ''}
      onChange={(e) => {
        const val = e.target.value === '' ? '' : Number(e.target.value);
        onChange(val);
      }}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      step={step}
      min={field.validation?.min}
      max={field.validation?.max}
      className={field.className}
      dir="ltr"
    />
  );
}

/* ============================================================================
   Price Field Renderer
   ============================================================================ */

export function PriceFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const currency = (field as { currency?: string }).currency || 'ر.س';
  
  return (
    <div className={styles.priceField}>
      <Input
        type="number"
        name={field.name}
        label={field.label}
        placeholder={field.placeholder || '0.00'}
        value={value !== undefined && value !== null ? String(value) : ''}
        onChange={(e) => {
          const val = e.target.value === '' ? '' : Number(e.target.value);
          onChange(val);
        }}
        onBlur={onBlur}
        error={touched ? error : undefined}
        helperText={field.helperText}
        disabled={disabled || field.disabled}
        required={field.required}
        step={0.01}
        min={0}
        className={field.className}
        dir="ltr"
        rightIcon={<span className={styles.currencySymbol}>{currency}</span>}
      />
    </div>
  );
}

/* ============================================================================
   Boolean Field Renderer
   ============================================================================ */

export function BooleanFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const variant = (field as { variant?: 'checkbox' | 'switch' | 'radio' }).variant || 'checkbox';
  const trueLabel = (field as { trueLabel?: string }).trueLabel || 'نعم';
  const falseLabel = (field as { falseLabel?: string }).falseLabel || 'لا';
  
  if (variant === 'switch') {
    return (
      <div className={styles.fieldWrapper}>
        <label className={styles.switchLabel}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </label>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            disabled={disabled || field.disabled}
          />
          <span className={styles.switchSlider} />
        </label>
        {field.helperText && <p className={styles.helperText}>{field.helperText}</p>}
        {touched && error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  }

  if (variant === 'radio') {
    return (
      <div className={styles.fieldWrapper}>
        <label className={styles.fieldLabel}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name={field.name}
              checked={value === true}
              onChange={() => onChange(true)}
              onBlur={onBlur}
              disabled={disabled || field.disabled}
            />
            <span>{trueLabel}</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name={field.name}
              checked={value === false}
              onChange={() => onChange(false)}
              onBlur={onBlur}
              disabled={disabled || field.disabled}
            />
            <span>{falseLabel}</span>
          </label>
        </div>
        {field.helperText && <p className={styles.helperText}>{field.helperText}</p>}
        {touched && error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  }

  // Default checkbox
  return (
    <div className={styles.fieldWrapper}>
      <label className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          className={styles.checkbox}
        />
        <span className={styles.checkboxLabel}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </span>
      </label>
      {field.helperText && <p className={styles.helperText}>{field.helperText}</p>}
      {touched && error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ============================================================================
   Select Field Renderer
   ============================================================================ */

export function SelectFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const options = (field.options || []).map(opt => ({
    value: String(opt.value),
    label: opt.label,
    disabled: opt.disabled,
  }));

  return (
    <Select
      name={field.name}
      label={field.label}
      placeholder={field.placeholder}
      value={String(value ?? '')}
      options={options}
      onChange={(val) => onChange(val)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      className={field.className}
    />
  );
}

/* ============================================================================
   MultiSelect Field Renderer
   ============================================================================ */

export function MultiSelectFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const options = (field.options || []).map(opt => ({
    value: String(opt.value),
    label: opt.label,
    disabled: opt.disabled,
  }));

  const selectedValues = Array.isArray(value) ? value.map(String) : [];

  return (
    <MultiSelect
      name={field.name}
      label={field.label}
      placeholder={field.placeholder}
      value={selectedValues}
      options={options}
      onChange={(vals) => onChange(vals)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      className={field.className}
    />
  );
}

/* ============================================================================
   Date Field Renderer
   ============================================================================ */

export function DateFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  return (
    <Input
      type="date"
      name={field.name}
      label={field.label}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      min={(field as { minDate?: string }).minDate}
      max={(field as { maxDate?: string }).maxDate}
      className={field.className}
    />
  );
}

/* ============================================================================
   Time Field Renderer
   ============================================================================ */

export function TimeFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  return (
    <Input
      type="time"
      name={field.name}
      label={field.label}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      className={field.className}
    />
  );
}

/* ============================================================================
   DateTime Field Renderer
   ============================================================================ */

export function DateTimeFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  return (
    <Input
      type="datetime-local"
      name={field.name}
      label={field.label}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={touched ? error : undefined}
      helperText={field.helperText}
      disabled={disabled || field.disabled}
      required={field.required}
      className={field.className}
    />
  );
}

/* ============================================================================
   Time Range Field Renderer
   ============================================================================ */

interface TimeRangeValue {
  start?: string;
  end?: string;
}

export function TimeRangeFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const rangeValue = (value as TimeRangeValue) || { start: '', end: '' };
  const startLabel = (field as { startLabel?: string }).startLabel || 'من';
  const endLabel = (field as { endLabel?: string }).endLabel || 'إلى';

  const handleChange = (key: 'start' | 'end', val: string) => {
    onChange({ ...rangeValue, [key]: val });
  };

  return (
    <div className={styles.fieldWrapper}>
      <label className={styles.fieldLabel}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.timeRangeInputs}>
        <div className={styles.timeRangeInput}>
          <label className={styles.timeLabel}>{startLabel}</label>
          <input
            type="time"
            value={rangeValue.start || ''}
            onChange={(e) => handleChange('start', e.target.value)}
            onBlur={onBlur}
            disabled={disabled || field.disabled}
            className={styles.input}
          />
        </div>
        <span className={styles.timeRangeSeparator}>—</span>
        <div className={styles.timeRangeInput}>
          <label className={styles.timeLabel}>{endLabel}</label>
          <input
            type="time"
            value={rangeValue.end || ''}
            onChange={(e) => handleChange('end', e.target.value)}
            onBlur={onBlur}
            disabled={disabled || field.disabled}
            className={styles.input}
          />
        </div>
      </div>
      {field.helperText && <p className={styles.helperText}>{field.helperText}</p>}
      {touched && error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ============================================================================
   Rating Field Renderer
   ============================================================================ */

export function RatingFieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const maxStars = (field as { maxStars?: number }).maxStars || 5;
  const currentValue = Number(value) || 0;

  return (
    <div className={styles.fieldWrapper}>
      <label className={styles.fieldLabel}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.ratingStars} onBlur={onBlur}>
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= currentValue;
          
          return (
            <button
              key={index}
              type="button"
              className={[styles.star, isFilled && styles.starFilled].filter(Boolean).join(' ')}
              onClick={() => !disabled && !field.disabled && onChange(starValue)}
              disabled={disabled || field.disabled}
              aria-label={`${starValue} نجمة`}
            >
              ★
            </button>
          );
        })}
        <span className={styles.ratingValue}>{currentValue} / {maxStars}</span>
      </div>
      {field.helperText && <p className={styles.helperText}>{field.helperText}</p>}
      {touched && error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ============================================================================
   Default Export - Field Renderer Map
   ============================================================================ */

export const fieldRenderers: Record<string, React.ComponentType<FieldRendererProps>> = {
  text: TextFieldRenderer,
  email: EmailFieldRenderer,
  phone: PhoneFieldRenderer,
  url: UrlFieldRenderer,
  textarea: TextareaFieldRenderer,
  number: NumberFieldRenderer,
  decimal: NumberFieldRenderer,
  price: PriceFieldRenderer,
  boolean: BooleanFieldRenderer,
  select: SelectFieldRenderer,
  multiselect: MultiSelectFieldRenderer,
  date: DateFieldRenderer,
  time: TimeFieldRenderer,
  datetime: DateTimeFieldRenderer,
  timeRange: TimeRangeFieldRenderer,
  rating: RatingFieldRenderer,
  // These will be added in a separate file due to complexity
  image: TextFieldRenderer, // Placeholder
  gallery: TextFieldRenderer, // Placeholder
  location: TextFieldRenderer, // Placeholder
};

export function getFieldRenderer(type: string): React.ComponentType<FieldRendererProps> {
  return fieldRenderers[type] || TextFieldRenderer;
}
