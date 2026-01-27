// ============================================================================
// Select Component
// Reusable select/dropdown with RTL support
// ============================================================================

'use client';

import React, { forwardRef, useId } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      helperText,
      isRequired = false,
      placeholder,
      className = '',
      id: providedId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const containerClasses = [
      styles.container,
      error ? styles.hasError : '',
      disabled ? styles.disabled : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
            {isRequired && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            id={id}
            className={styles.select}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.arrow} aria-hidden="true">
            ▼
          </span>
        </div>

        {error && (
          <p id={`${id}-error`} className={styles.error} role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${id}-helper`} className={styles.helperText}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ============================================================================
// Multi-Select Component (Checkboxes)
// ============================================================================

interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  error,
  helperText,
  isRequired = false,
  disabled = false,
  className = '',
}: MultiSelectProps) {
  const id = useId();

  const handleToggle = (optionValue: string) => {
    if (disabled) return;
    
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const containerClasses = [
    styles.multiSelectContainer,
    error ? styles.hasError : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <span className={styles.label}>
          {label}
          {isRequired && <span className={styles.required}>*</span>}
        </span>
      )}

      <div className={styles.optionsGrid} role="group" aria-labelledby={`${id}-label`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`${styles.checkboxLabel} ${option.disabled ? styles.optionDisabled : ''}`}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              disabled={disabled || option.disabled}
            />
            <span className={styles.checkboxText}>{option.label}</span>
          </label>
        ))}
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
}

export default Select;
