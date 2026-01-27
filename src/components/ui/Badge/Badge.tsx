// ============================================================================
// Badge Component
// For states, tags, and status indicators
// ============================================================================

'use client';

import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  className = '',
}: BadgeProps) {
  const badgeClasses = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClasses}>
      {dot && <span className={styles.dot} />}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
}

// ============================================================================
// State Badge for Partner/Item States
// ============================================================================

import { PARTNER_STATE_CONFIG, ITEM_STATE_CONFIG } from '@/types';
import type { PartnerState, ItemState } from '@/types';

interface StateBadgeProps {
  state: PartnerState | ItemState;
  type: 'partner' | 'item';
  showIcon?: boolean;
  size?: BadgeSize;
}

export function StateBadge({ state, type, showIcon = true, size = 'md' }: StateBadgeProps) {
  const config = type === 'partner' 
    ? PARTNER_STATE_CONFIG[state as PartnerState]
    : ITEM_STATE_CONFIG[state as ItemState];

  if (!config) return null;

  const variantMap: Record<string, BadgeVariant> = {
    gray: 'secondary',
    yellow: 'warning',
    orange: 'warning',
    green: 'success',
    red: 'danger',
  };

  return (
    <Badge variant={variantMap[config.color] || 'default'} size={size}>
      {showIcon && <span className={styles.stateIcon}>{config.icon}</span>}
      {config.ar}
    </Badge>
  );
}

// ============================================================================
// Count Badge (for navigation items, etc.)
// ============================================================================

interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  className?: string;
}

export function CountBadge({ count, max = 99, variant = 'danger', className = '' }: CountBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <span className={`${styles.countBadge} ${styles[variant]} ${className}`}>
      {displayCount}
    </span>
  );
}

export default Badge;
