// ============================================================================
// Core Type Definitions for Laqtha Multi-Service Marketplace Platform
// Based on FRONTEND_SPECIFICATION.md v1.0.0
// ============================================================================

// ============================================================================
// User & Authentication Types
// ============================================================================

export type UserRole = 'customer' | 'admin' | 'partner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  partner: Partner | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
}

// ============================================================================
// Partner Types
// ============================================================================

export type PartnerState = 
  | 'pending_otp'
  | 'pending_approval'
  | 'changes_required'
  | 'rejected'
  | 'approved'
  | 'suspended';

export interface PartnerStateLabels {
  key: PartnerState;
  ar: string;
  en: string;
  color: 'gray' | 'yellow' | 'orange' | 'green' | 'red';
  icon: string;
}

export const PARTNER_STATE_CONFIG: Record<PartnerState, PartnerStateLabels> = {
  pending_otp: { key: 'pending_otp', ar: 'في انتظار التحقق', en: 'Pending OTP', color: 'gray', icon: '⏳' },
  pending_approval: { key: 'pending_approval', ar: 'في انتظار الموافقة', en: 'Pending Approval', color: 'yellow', icon: '⏳' },
  changes_required: { key: 'changes_required', ar: 'مطلوب تعديلات', en: 'Changes Required', color: 'orange', icon: '⚠️' },
  rejected: { key: 'rejected', ar: 'مرفوض', en: 'Rejected', color: 'red', icon: '❌' },
  approved: { key: 'approved', ar: 'معتمد', en: 'Approved', color: 'green', icon: '✅' },
  suspended: { key: 'suspended', ar: 'موقوف', en: 'Suspended', color: 'red', icon: '🚫' },
};

export interface PartnerPermissions {
  canLogin: boolean;
  canEditProfile: boolean;
  canManageItems: boolean;
  canAccessDashboard: boolean;
  canChangeServiceType: boolean;
  visibleToPublic: boolean;
}

export interface Partner {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  website?: string;
  postalCode?: string;
  serviceTypeKey: string;
  serviceTypeData: Record<string, unknown>;
  state: PartnerState;
  stateMessage?: string;
  stateHistory: StateHistoryEntry[];
  suspensionReason?: string;
  suspensionDuration?: number;
  suspensionEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StateHistoryEntry {
  from: PartnerState | null;
  to: PartnerState;
  reason?: string;
  changedBy: string;
  changedAt: string;
}

// ============================================================================
// Service Type Types
// ============================================================================

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'decimal'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'time'
  | 'datetime'
  | 'image'
  | 'gallery'
  | 'location'
  | 'phone'
  | 'email'
  | 'url'
  | 'rating'
  | 'price'
  | 'timeRange';

export interface FieldOption {
  value: string;
  label: {
    ar: string;
    en?: string;
  };
}

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
}

export interface DynamicField {
  key: string;
  type: FieldType;
  label: {
    ar: string;
    en?: string;
  };
  placeholder?: {
    ar?: string;
    en?: string;
  };
  required: boolean;
  showInList: boolean;
  options?: FieldOption[];
  validation?: FieldValidation;
  defaultValue?: unknown;
  helpText?: {
    ar?: string;
    en?: string;
  };
  order: number;
}

export interface ServiceType {
  key: string;
  icon: string;
  label: {
    ar: string;
    en?: string;
  };
  itemLabel: {
    ar: string;
    en?: string;
  };
  commissionRate: number;
  isActive: boolean;
  fields: DynamicField[];
  itemFields: DynamicField[];
  fieldsCount: number;
  itemFieldsCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Service Item Types
// ============================================================================

export type ItemState = 'draft' | 'active' | 'inactive' | 'hidden' | 'archived';

export interface ItemStateLabels {
  key: ItemState;
  ar: string;
  en: string;
  color: 'gray' | 'green' | 'yellow' | 'red';
  icon: string;
}

export const ITEM_STATE_CONFIG: Record<ItemState, ItemStateLabels> = {
  draft: { key: 'draft', ar: 'مسودة', en: 'Draft', color: 'gray', icon: '📝' },
  active: { key: 'active', ar: 'نشط', en: 'Active', color: 'green', icon: '✅' },
  inactive: { key: 'inactive', ar: 'غير نشط', en: 'Inactive', color: 'yellow', icon: '⏸️' },
  hidden: { key: 'hidden', ar: 'مخفي', en: 'Hidden', color: 'red', icon: '🚫' },
  archived: { key: 'archived', ar: 'مؤرشف', en: 'Archived', color: 'gray', icon: '🗄️' },
};

export interface ServiceItem {
  id: string;
  partnerId: string;
  partnerName?: string;
  serviceTypeKey: string;
  name: {
    ar: string;
    en?: string;
  };
  description?: {
    ar?: string;
    en?: string;
  };
  data: Record<string, unknown>;
  state: ItemState;
  stateHistory: ItemStateHistoryEntry[];
  hiddenReason?: string;
  displayOrder: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemStateHistoryEntry {
  from: ItemState | null;
  to: ItemState;
  reason?: string;
  changedBy: string;
  changedAt: string;
}

export type ItemStateAction = 'publish' | 'unpublish' | 'archive' | 'restore';

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  search?: string;
  serviceType?: string;
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface AdminDashboardStats {
  serviceTypes: {
    total: number;
    active: number;
  };
  partners: {
    total: number;
    approved: number;
    pending: number;
    suspended: number;
    rejected: number;
  };
  items: {
    total: number;
    active: number;
    draft: number;
    hidden: number;
    archived: number;
  };
}

export interface PartnerDashboardStats {
  items: {
    total: number;
    active: number;
    draft: number;
    inactive: number;
    hidden: number;
  };
}

// ============================================================================
// Form Types
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface PartnerRegisterFormData {
  // Step 1: Service Type Selection
  serviceTypeKey: string;
  
  // Step 2: Business Information
  businessName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  website?: string;
  
  // Dynamic fields based on service type
  serviceTypeData: Record<string, unknown>;
  
  // Step 3: Confirmation
  acceptTerms: boolean;
}

export interface OtpFormData {
  otp: string;
  email?: string;
}

export interface PasswordResetFormData {
  email: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ServiceTypeFormData {
  key: string;
  icon: string;
  label: {
    ar: string;
    en?: string;
  };
  itemLabel: {
    ar: string;
    en?: string;
  };
  commissionRate: number;
  fields: DynamicField[];
  itemFields: DynamicField[];
}

export interface ServiceItemFormData {
  name: {
    ar: string;
    en?: string;
  };
  description?: {
    ar?: string;
    en?: string;
  };
  data: Record<string, unknown>;
  displayOrder?: number;
  isFeatured?: boolean;
}

// ============================================================================
// Modal Types
// ============================================================================

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface PartnerActionModalData {
  partnerId: string;
  partnerName: string;
  action: 'approve' | 'reject' | 'request-changes' | 'suspend' | 'reinstate';
  reason?: string;
  duration?: number;
}

export interface ItemActionModalData {
  itemId: string;
  itemName: string;
  action: 'hide' | 'show' | 'archive' | 'delete';
  reason?: string;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavItem {
  key: string;
  label: {
    ar: string;
    en?: string;
  };
  href: string;
  icon?: string;
  badge?: number;
  children?: NavItem[];
  visibilityCondition?: (context: { partnerState?: PartnerState; role?: UserRole }) => boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================================================
// Table Types
// ============================================================================

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface TableAction<T> {
  key: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
  condition?: (row: T) => boolean;
  onClick: (row: T) => void;
}

// ============================================================================
// Toast/Notification Types
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// ============================================================================
// Loading/Error States
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  retry?: () => void;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'search';
  options?: FilterOption[];
  defaultValue?: unknown;
}

export interface ActiveFilters {
  [key: string]: unknown;
}
