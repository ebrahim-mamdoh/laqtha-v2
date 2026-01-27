'use client';

import React from 'react';
import styles from './Spinner.module.css';

/* ============================================================================
   Types
   ============================================================================ */

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  className?: string;
}

/* ============================================================================
   Spinner Component
   ============================================================================ */

export function Spinner({
  size = 'md',
  color = 'primary',
  className,
}: SpinnerProps) {
  return (
    <span
      className={[
        styles.spinner,
        styles[`size-${size}`],
        styles[`color-${color}`],
        className,
      ].filter(Boolean).join(' ')}
      role="status"
      aria-label="جاري التحميل"
    />
  );
}

/* ============================================================================
   Loading Overlay Component
   ============================================================================ */

interface LoadingOverlayProps {
  visible?: boolean;
  fullScreen?: boolean;
  text?: string;
  blur?: boolean;
  className?: string;
}

export function LoadingOverlay({
  visible = true,
  fullScreen = false,
  text = 'جاري التحميل...',
  blur = true,
  className,
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={[
        styles.overlay,
        fullScreen && styles.fullScreen,
        blur && styles.blur,
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className={styles.overlayContent}>
        <Spinner size="lg" />
        {text && <p className={styles.overlayText}>{text}</p>}
      </div>
    </div>
  );
}

/* ============================================================================
   Loading Page Component
   ============================================================================ */

interface LoadingPageProps {
  text?: string;
  className?: string;
}

export function LoadingPage({
  text = 'جاري تحميل الصفحة...',
  className,
}: LoadingPageProps) {
  return (
    <div className={[styles.loadingPage, className].filter(Boolean).join(' ')}>
      <div className={styles.loadingPageContent}>
        <Spinner size="xl" />
        {text && <p className={styles.loadingPageText}>{text}</p>}
      </div>
    </div>
  );
}

/* ============================================================================
   Loading Button Content
   ============================================================================ */

interface LoadingButtonContentProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function LoadingButtonContent({
  loading,
  children,
  loadingText,
}: LoadingButtonContentProps) {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <>
      <Spinner size="sm" color="current" />
      {loadingText && <span>{loadingText}</span>}
    </>
  );
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default Spinner;
