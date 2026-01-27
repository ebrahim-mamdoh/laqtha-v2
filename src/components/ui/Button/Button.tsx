// ============================================================================
// Button Component
// Reusable button with multiple variants and states
// ============================================================================

'use client';

import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} disabled={isDisabled} {...props}>
      {isLoading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

// ============================================================================
// Icon Button
// ============================================================================

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string; // For accessibility
  isLoading?: boolean;
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  isLoading = false,
  disabled,
  className = '',
  ...props
}: IconButtonProps) {
  const buttonClasses = [
    styles.iconButton,
    styles[variant],
    styles[`icon${size.toUpperCase()}`],
    isLoading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      aria-label={label}
      title={label}
      {...props}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : icon}
    </button>
  );
}

export default Button;
