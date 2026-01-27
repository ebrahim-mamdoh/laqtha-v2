'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import styles from './Toast.module.css';

/* ============================================================================
   Types
   ============================================================================ */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  dismissible?: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
}

/* ============================================================================
   Context
   ============================================================================ */

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/* ============================================================================
   Toast Provider
   ============================================================================ */

interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast,
    };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      // Keep only the last maxToasts
      return updated.slice(-maxToasts);
    });

    return id;
  }, [maxToasts]);

  const success = useCallback(
    (message: string, title?: string) => addToast({ message, title, variant: 'success' }),
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string) => addToast({ message, title, variant: 'error' }),
    [addToast]
  );

  const warning = useCallback(
    (message: string, title?: string) => addToast({ message, title, variant: 'warning' }),
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string) => addToast({ message, title, variant: 'info' }),
    [addToast]
  );

  const value: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} position={position} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

/* ============================================================================
   Toast Container
   ============================================================================ */

interface ToastContainerProps {
  toasts: Toast[];
  position: ToastProviderProps['position'];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, position, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={[styles.container, styles[position!]].join(' ')} role="region" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

/* ============================================================================
   Toast Item
   ============================================================================ */

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const icons: Record<ToastVariant, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={[
        styles.toast,
        styles[toast.variant],
        isExiting && styles.exiting,
      ].filter(Boolean).join(' ')}
      role="alert"
    >
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icons[toast.variant]}</span>
      </div>
      <div className={styles.content}>
        {toast.title && <div className={styles.title}>{toast.title}</div>}
        <div className={styles.message}>{toast.message}</div>
      </div>
      {toast.dismissible && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleDismiss}
          aria-label="إغلاق"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/* ============================================================================
   Standalone Toast Component (for non-context usage)
   ============================================================================ */

interface StandaloneToastProps {
  title?: string;
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  dismissible?: boolean;
}

export function StandaloneToast({
  title,
  message,
  variant = 'info',
  onClose,
  dismissible = true,
}: StandaloneToastProps) {
  const icons: Record<ToastVariant, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={[styles.toast, styles[variant]].join(' ')} role="alert">
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icons[variant]}</span>
      </div>
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.message}>{message}</div>
      </div>
      {dismissible && onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="إغلاق"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default ToastProvider;
