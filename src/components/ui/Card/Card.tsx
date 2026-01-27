// ============================================================================
// Card Component
// Reusable card container with variants
// ============================================================================

'use client';

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
}: CardProps) {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    hoverable ? styles.hoverable : '',
    clickable ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Component = clickable ? 'button' : 'div';

  return (
    <Component className={cardClasses} onClick={onClick}>
      {children}
    </Component>
  );
}

// ============================================================================
// Card Header
// ============================================================================

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function CardHeader({ children, className = '', actions }: CardHeaderProps) {
  return (
    <div className={`${styles.header} ${className}`}>
      <div className={styles.headerContent}>{children}</div>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </div>
  );
}

// ============================================================================
// Card Title
// ============================================================================

interface CardTitleProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

export function CardTitle({ children, as: Component = 'h3', className = '' }: CardTitleProps) {
  return <Component className={`${styles.title} ${className}`}>{children}</Component>;
}

// ============================================================================
// Card Description
// ============================================================================

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return <p className={`${styles.description} ${className}`}>{children}</p>;
}

// ============================================================================
// Card Body
// ============================================================================

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

// ============================================================================
// Card Footer
// ============================================================================

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'between';
}

export function CardFooter({ children, className = '', align = 'end' }: CardFooterProps) {
  return <div className={`${styles.footer} ${styles[`align-${align}`]} ${className}`}>{children}</div>;
}

// ============================================================================
// Stats Card
// ============================================================================

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  onClick?: () => void;
}

export function StatsCard({ title, value, icon, trend, subtitle, onClick }: StatsCardProps) {
  return (
    <Card
      variant="bordered"
      hoverable={!!onClick}
      clickable={!!onClick}
      onClick={onClick}
      className={styles.statsCard}
    >
      <div className={styles.statsContent}>
        {icon && <div className={styles.statsIcon}>{icon}</div>}
        <div className={styles.statsInfo}>
          <span className={styles.statsTitle}>{title}</span>
          <span className={styles.statsValue}>{value}</span>
          {subtitle && <span className={styles.statsSubtitle}>{subtitle}</span>}
        </div>
      </div>
      {trend && (
        <div className={`${styles.statsTrend} ${trend.isPositive ? styles.positive : styles.negative}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </Card>
  );
}

export default Card;
