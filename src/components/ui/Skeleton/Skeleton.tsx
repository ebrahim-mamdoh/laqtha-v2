'use client';

import React from 'react';
import styles from './Skeleton.module.css';

/* ============================================================================
   Types
   ============================================================================ */

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

/* ============================================================================
   Skeleton Component
   ============================================================================ */

export function Skeleton({
  width,
  height,
  variant = 'text',
  animation = 'pulse',
  className,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <span
      className={[
        styles.skeleton,
        styles[variant],
        styles[animation],
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    />
  );
}

/* ============================================================================
   Common Skeleton Patterns
   ============================================================================ */

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  className,
}: SkeletonTextProps) {
  return (
    <div className={[styles.textGroup, className].filter(Boolean).join(' ')}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  const sizes = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  return (
    <Skeleton
      variant="circular"
      width={sizes[size]}
      height={sizes[size]}
      className={className}
    />
  );
}

interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  className?: string;
}

export function SkeletonButton({ size = 'md', width = 120, className }: SkeletonButtonProps) {
  const heights = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={heights[size]}
      className={className}
    />
  );
}

/* ============================================================================
   Card Skeleton
   ============================================================================ */

interface SkeletonCardProps {
  hasImage?: boolean;
  imageHeight?: number;
  className?: string;
}

export function SkeletonCard({
  hasImage = true,
  imageHeight = 200,
  className,
}: SkeletonCardProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      {hasImage && (
        <Skeleton variant="rectangular" height={imageHeight} />
      )}
      <div className={styles.cardContent}>
        <Skeleton variant="text" width="80%" height={24} />
        <div className={styles.cardMeta}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={100} />
        </div>
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}

/* ============================================================================
   Table Skeleton
   ============================================================================ */

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: SkeletonTableProps) {
  return (
    <div className={[styles.table, className].filter(Boolean).join(' ')}>
      <div className={styles.tableHeader}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" height={20} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.tableRow}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              height={16}
              width={colIndex === 0 ? '60%' : '80%'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   List Skeleton
   ============================================================================ */

interface SkeletonListItemProps {
  hasAvatar?: boolean;
  hasSubtitle?: boolean;
  hasAction?: boolean;
  className?: string;
}

export function SkeletonListItem({
  hasAvatar = true,
  hasSubtitle = true,
  hasAction = false,
  className,
}: SkeletonListItemProps) {
  return (
    <div className={[styles.listItem, className].filter(Boolean).join(' ')}>
      {hasAvatar && <SkeletonAvatar size="md" />}
      <div className={styles.listItemContent}>
        <Skeleton variant="text" width="60%" height={18} />
        {hasSubtitle && <Skeleton variant="text" width="40%" height={14} />}
      </div>
      {hasAction && <SkeletonButton size="sm" width={80} />}
    </div>
  );
}

interface SkeletonListProps {
  items?: number;
  hasAvatar?: boolean;
  hasSubtitle?: boolean;
  hasAction?: boolean;
  className?: string;
}

export function SkeletonList({
  items = 5,
  hasAvatar = true,
  hasSubtitle = true,
  hasAction = false,
  className,
}: SkeletonListProps) {
  return (
    <div className={[styles.list, className].filter(Boolean).join(' ')}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonListItem
          key={index}
          hasAvatar={hasAvatar}
          hasSubtitle={hasSubtitle}
          hasAction={hasAction}
        />
      ))}
    </div>
  );
}

/* ============================================================================
   Stats Skeleton
   ============================================================================ */

export function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={[styles.stats, className].filter(Boolean).join(' ')}>
      <div className={styles.statsIcon}>
        <Skeleton variant="rounded" width={48} height={48} />
      </div>
      <div className={styles.statsContent}>
        <Skeleton variant="text" width={60} height={14} />
        <Skeleton variant="text" width={100} height={28} />
      </div>
    </div>
  );
}

/* ============================================================================
   Form Skeleton
   ============================================================================ */

interface SkeletonFormProps {
  fields?: number;
  className?: string;
}

export function SkeletonForm({ fields = 4, className }: SkeletonFormProps) {
  return (
    <div className={[styles.form, className].filter(Boolean).join(' ')}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className={styles.formField}>
          <Skeleton variant="text" width={80} height={16} />
          <Skeleton variant="rounded" height={40} />
        </div>
      ))}
      <SkeletonButton size="lg" width="100%" />
    </div>
  );
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default Skeleton;
