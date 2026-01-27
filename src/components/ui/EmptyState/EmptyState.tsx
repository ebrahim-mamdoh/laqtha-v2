'use client';

import React from 'react';
import styles from './EmptyState.module.css';

/* ============================================================================
   Types
   ============================================================================ */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

/* ============================================================================
   EmptyState Component
   ============================================================================ */

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={[
        styles.emptyState,
        styles[variant],
        className,
      ].filter(Boolean).join(' ')}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

/* ============================================================================
   Preset Empty States
   ============================================================================ */

interface PresetEmptyStateProps {
  action?: React.ReactNode;
  className?: string;
}

// No Data
export function EmptyData({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<DataIcon />}
      title="لا توجد بيانات"
      description="لم يتم العثور على أي بيانات لعرضها"
      action={action}
      className={className}
    />
  );
}

// No Search Results
export function EmptySearch({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<SearchIcon />}
      title="لا توجد نتائج"
      description="لم نتمكن من إيجاد ما تبحث عنه. جرب تعديل معايير البحث"
      action={action}
      className={className}
    />
  );
}

// No Items
export function EmptyItems({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<BoxIcon />}
      title="لا توجد عناصر"
      description="لم تقم بإضافة أي عناصر بعد"
      action={action}
      className={className}
    />
  );
}

// No Services
export function EmptyServices({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<ServicesIcon />}
      title="لا توجد خدمات"
      description="لم يتم إضافة أي خدمات حتى الآن"
      action={action}
      className={className}
    />
  );
}

// No Partners
export function EmptyPartners({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<PartnersIcon />}
      title="لا يوجد شركاء"
      description="لم يتم تسجيل أي شركاء بعد"
      action={action}
      className={className}
    />
  );
}

// Error State
interface ErrorStateProps {
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  message = 'حدث خطأ أثناء تحميل البيانات',
  action,
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={<ErrorIcon />}
      title="حدث خطأ"
      description={message}
      action={action}
      className={className}
    />
  );
}

// Loading Failed
export function LoadingFailed({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={<RefreshIcon />}
      title="فشل التحميل"
      description="تعذر تحميل البيانات. يرجى المحاولة مرة أخرى"
      action={action}
      className={className}
    />
  );
}

/* ============================================================================
   Icons (Simple SVG Icons)
   ============================================================================ */

function DataIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function PartnersIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 4v6h-6M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default EmptyState;
