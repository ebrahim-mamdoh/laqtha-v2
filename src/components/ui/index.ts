/**
 * UI Component Library Barrel Export
 * 
 * This file exports all reusable UI components for easy importing throughout the application.
 * 
 * Usage:
 * import { Button, Input, Modal, Table } from '@/components/ui';
 */

// Button
export { Button, IconButton } from './Button/Button';
export type { ButtonProps } from './Button/Button';

// Input
export { Input, Textarea } from './Input/Input';
export type { InputProps, TextareaProps } from './Input/Input';

// Select
export { Select, MultiSelect } from './Select/Select';
export type { SelectProps, MultiSelectProps, SelectOption } from './Select/Select';

// Modal
export { Modal, ConfirmModal, useModal } from './Modal/Modal';
export type { ModalProps, ConfirmModalProps } from './Modal/Modal';

// Badge
export { Badge, StateBadge, CountBadge } from './Badge/Badge';
export type { BadgeProps, StateBadgeProps, CountBadgeProps } from './Badge/Badge';

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  StatsCard,
} from './Card/Card';
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardBodyProps,
  CardFooterProps,
  StatsCardProps,
} from './Card/Card';

// Table
export { Table, ActionCell } from './Table/Table';
export type { TableProps, Column } from './Table/Table';

// Toast
export { ToastProvider, useToast, StandaloneToast } from './Toast/Toast';
export type { Toast, ToastVariant } from './Toast/Toast';

// Skeleton
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  SkeletonListItem,
  SkeletonStats,
  SkeletonForm,
} from './Skeleton/Skeleton';

// EmptyState
export {
  EmptyState,
  EmptyData,
  EmptySearch,
  EmptyItems,
  EmptyServices,
  EmptyPartners,
  ErrorState,
  LoadingFailed,
} from './EmptyState/EmptyState';

// Pagination
export {
  Pagination,
  PageInfo,
  PageSizeSelector,
  FullPagination,
} from './Pagination/Pagination';
export type { PaginationProps } from './Pagination/Pagination';

// Spinner
export {
  Spinner,
  LoadingOverlay,
  LoadingPage,
  LoadingButtonContent,
} from './Spinner/Spinner';
