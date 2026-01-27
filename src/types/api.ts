// ============================================================================
// API Type Definitions - Request/Response shapes for all endpoints
// Based on FRONTEND_SPECIFICATION.md Section 7
// ============================================================================

import type { 
  User, 
  Partner, 
  PartnerState, 
  ServiceType, 
  ServiceItem, 
  ItemState,
  DynamicField,
  PaginatedResponse
} from './index';

// ============================================================================
// Authentication API Types
// ============================================================================

// POST /api/auth/login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

// POST /api/auth/register
export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId: string;
}

// POST /api/auth/verify
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

// POST /api/auth/forgot-password
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// POST /api/auth/reset-password
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// POST /api/auth/resend-verification
export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

// POST /api/refresh
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

// GET /api/auth/me or /api/user/me
export interface GetCurrentUserResponse {
  success: boolean;
  user: User;
}

// ============================================================================
// Partner Authentication API Types
// ============================================================================

// POST /api/partners/register
export interface PartnerRegisterRequest {
  serviceTypeKey: string;
  businessName: string;
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  website?: string;
  serviceTypeData: Record<string, unknown>;
}

export interface PartnerRegisterResponse {
  success: boolean;
  message: string;
  partnerId: string;
}

// POST /api/partners/verify-otp
export interface PartnerVerifyOtpRequest {
  email: string;
  otp: string;
}

export interface PartnerVerifyOtpResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  partner: Partner;
}

// POST /api/partners/login
export interface PartnerLoginRequest {
  email: string;
  password: string;
}

export interface PartnerLoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  partner: Partner;
}

// POST /api/partners/resend-otp
export interface PartnerResendOtpRequest {
  email: string;
}

export interface PartnerResendOtpResponse {
  success: boolean;
  message: string;
}

// GET /api/partners/me
export interface GetPartnerMeResponse {
  success: boolean;
  partner: Partner;
}

// GET /api/partners/me/status
export interface GetPartnerStatusResponse {
  success: boolean;
  state: PartnerState;
  stateMessage?: string;
  changesRequired?: string;
}

// GET /api/partners/me/profile
export interface GetPartnerProfileResponse {
  success: boolean;
  partner: Partner;
}

// PUT /api/partners/me/profile
export interface UpdatePartnerProfileRequest {
  businessName?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  address?: string;
  website?: string;
  serviceTypeData?: Record<string, unknown>;
}

export interface UpdatePartnerProfileResponse {
  success: boolean;
  message: string;
  partner: Partner;
}

// PUT /api/partners/me/service-type
export interface ChangeServiceTypeRequest {
  serviceTypeKey: string;
  serviceTypeData: Record<string, unknown>;
}

export interface ChangeServiceTypeResponse {
  success: boolean;
  message: string;
}

// POST /api/partners/me/resubmit
export interface ResubmitApplicationResponse {
  success: boolean;
  message: string;
  newState: PartnerState;
}

// ============================================================================
// Admin - Service Types API Types
// ============================================================================

// GET /api/admin/service-types
export interface GetServiceTypesParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type GetServiceTypesResponse = PaginatedResponse<ServiceType>;

// GET /api/admin/service-types/stats
export interface ServiceTypesStatsResponse {
  success: boolean;
  total: number;
  active: number;
  inactive: number;
}

// GET /api/admin/service-types/:key
export interface GetServiceTypeResponse {
  success: boolean;
  serviceType: ServiceType;
}

// POST /api/admin/service-types
export interface CreateServiceTypeRequest {
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

export interface CreateServiceTypeResponse {
  success: boolean;
  message: string;
  serviceType: ServiceType;
}

// PUT /api/admin/service-types/:key
export interface UpdateServiceTypeRequest {
  icon?: string;
  label?: {
    ar: string;
    en?: string;
  };
  itemLabel?: {
    ar: string;
    en?: string;
  };
  commissionRate?: number;
  fields?: DynamicField[];
  itemFields?: DynamicField[];
}

export interface UpdateServiceTypeResponse {
  success: boolean;
  message: string;
  serviceType: ServiceType;
}

// PATCH /api/admin/service-types/:key/status
export interface ToggleServiceTypeStatusRequest {
  isActive: boolean;
}

export interface ToggleServiceTypeStatusResponse {
  success: boolean;
  message: string;
  isActive: boolean;
}

// DELETE /api/admin/service-types/:key
export interface DeleteServiceTypeResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// Admin - Partners API Types
// ============================================================================

// GET /api/admin/partners
export interface GetPartnersParams {
  search?: string;
  state?: PartnerState;
  serviceTypeKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type GetPartnersResponse = PaginatedResponse<Partner>;

// GET /api/admin/partners/stats
export interface PartnersStatsResponse {
  success: boolean;
  total: number;
  byState: {
    pending_otp: number;
    pending_approval: number;
    changes_required: number;
    approved: number;
    rejected: number;
    suspended: number;
  };
}

// GET /api/admin/partners/:partnerId
export interface GetPartnerDetailsResponse {
  success: boolean;
  partner: Partner;
}

// POST /api/admin/partners/:partnerId/approve
export interface ApprovePartnerRequest {
  notes?: string;
}

export interface ApprovePartnerResponse {
  success: boolean;
  message: string;
  newState: PartnerState;
}

// POST /api/admin/partners/:partnerId/reject
export interface RejectPartnerRequest {
  reason: string;
}

export interface RejectPartnerResponse {
  success: boolean;
  message: string;
  newState: PartnerState;
}

// POST /api/admin/partners/:partnerId/request-changes
export interface RequestChangesRequest {
  changes: string;
}

export interface RequestChangesResponse {
  success: boolean;
  message: string;
  newState: PartnerState;
}

// POST /api/admin/partners/:partnerId/suspend
export interface SuspendPartnerRequest {
  reason: string;
  duration?: number; // days, null for permanent
}

export interface SuspendPartnerResponse {
  success: boolean;
  message: string;
  newState: PartnerState;
  suspensionEndDate?: string;
}

// POST /api/admin/partners/:partnerId/reinstate
export interface ReinstatePartnerRequest {
  notes?: string;
}

export interface ReinstatePartnerResponse {
  success: boolean;
  message: string;
  newState: PartnerState;
}

// ============================================================================
// Admin - Service Items API Types
// ============================================================================

// GET /api/admin/service-items
export interface GetAdminItemsParams {
  search?: string;
  state?: ItemState;
  serviceTypeKey?: string;
  partnerId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type GetAdminItemsResponse = PaginatedResponse<ServiceItem>;

// GET /api/admin/service-items/stats
export interface ItemsStatsResponse {
  success: boolean;
  total: number;
  byState: {
    draft: number;
    active: number;
    inactive: number;
    hidden: number;
    archived: number;
  };
}

// GET /api/admin/service-items/:itemId
export interface GetAdminItemDetailsResponse {
  success: boolean;
  item: ServiceItem;
}

// POST /api/admin/service-items/:itemId/hide
export interface HideItemRequest {
  reason: string;
}

export interface HideItemResponse {
  success: boolean;
  message: string;
  newState: ItemState;
}

// POST /api/admin/service-items/:itemId/show
export interface ShowItemResponse {
  success: boolean;
  message: string;
  newState: ItemState;
}

// POST /api/admin/service-items/:itemId/archive
export interface ArchiveItemResponse {
  success: boolean;
  message: string;
  newState: ItemState;
}

// DELETE /api/admin/service-items/:itemId
export interface DeleteItemResponse {
  success: boolean;
  message: string;
}

// POST /api/admin/service-items/cleanup
export interface CleanupItemsResponse {
  success: boolean;
  message: string;
  deletedCount: number;
}

// ============================================================================
// Admin - Users API Types
// ============================================================================

// GET /api/user
export interface GetUsersParams {
  search?: string;
  role?: 'customer' | 'admin';
  isVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type GetUsersResponse = PaginatedResponse<User>;

// GET /api/user/stats
export interface UsersStatsResponse {
  success: boolean;
  total: number;
  customers: number;
  admins: number;
  verified: number;
  unverified: number;
}

// GET /api/user/:id
export interface GetUserDetailsResponse {
  success: boolean;
  user: User;
}

// PATCH /api/user/:id/role
export interface UpdateUserRoleRequest {
  role: 'customer' | 'admin';
}

export interface UpdateUserRoleResponse {
  success: boolean;
  message: string;
  user: User;
}

// PATCH /api/user/:id/verification
export interface ToggleVerificationRequest {
  isVerified: boolean;
}

export interface ToggleVerificationResponse {
  success: boolean;
  message: string;
}

// DELETE /api/user/:id
export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// Partner - Items API Types
// ============================================================================

// GET /api/partner/items
export interface GetPartnerItemsParams {
  search?: string;
  state?: ItemState;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type GetPartnerItemsResponse = PaginatedResponse<ServiceItem>;

// GET /api/partner/items/summary
export interface PartnerItemsSummaryResponse {
  success: boolean;
  total: number;
  active: number;
  draft: number;
  inactive: number;
  hidden: number;
}

// GET /api/partner/items/fields
export interface GetPartnerItemFieldsResponse {
  success: boolean;
  fields: DynamicField[];
}

// GET /api/partner/items/:itemId
export interface GetPartnerItemResponse {
  success: boolean;
  item: ServiceItem;
}

// POST /api/partner/items
export interface CreateItemRequest {
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
  state?: 'draft' | 'active';
}

export interface CreateItemResponse {
  success: boolean;
  message: string;
  item: ServiceItem;
}

// PUT /api/partner/items/:itemId
export interface UpdateItemRequest {
  name?: {
    ar: string;
    en?: string;
  };
  description?: {
    ar?: string;
    en?: string;
  };
  data?: Record<string, unknown>;
  displayOrder?: number;
  isFeatured?: boolean;
}

export interface UpdateItemResponse {
  success: boolean;
  message: string;
  item: ServiceItem;
}

// POST /api/partner/items/:itemId/state
export interface ChangeItemStateRequest {
  action: 'publish' | 'unpublish' | 'archive' | 'restore';
}

export interface ChangeItemStateResponse {
  success: boolean;
  message: string;
  newState: ItemState;
}

// DELETE /api/partner/items/:itemId
export interface DeletePartnerItemResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// Public API Types
// ============================================================================

// GET /api/service-types
export interface GetPublicServiceTypesResponse {
  success: boolean;
  serviceTypes: Array<{
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
    itemsCount?: number;
    partnersCount?: number;
  }>;
}

// GET /api/service-types/:key
export interface GetPublicServiceTypeResponse {
  success: boolean;
  serviceType: ServiceType;
}

// GET /api/service-types/:key/fields
export interface GetServiceTypeFieldsResponse {
  success: boolean;
  fields: DynamicField[];
}

// GET /api/services/search
export interface SearchServicesParams {
  q?: string;
  serviceType?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type SearchServicesResponse = PaginatedResponse<ServiceItem>;

// GET /api/services/categories
export interface GetCategoriesResponse {
  success: boolean;
  categories: Array<{
    key: string;
    label: string;
    count: number;
  }>;
}

// GET /api/services/:partnerId/items
export interface GetPartnerPublicItemsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetPartnerPublicItemsResponse {
  success: boolean;
  partner: {
    id: string;
    businessName: string;
    city: string;
    serviceTypeKey: string;
    serviceTypeData: Record<string, unknown>;
  };
  items: ServiceItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// GET /api/services/:partnerId/items/:itemId
export interface GetPublicItemDetailsResponse {
  success: boolean;
  item: ServiceItem;
  partner: {
    id: string;
    businessName: string;
    city: string;
    serviceTypeKey: string;
  };
}

// ============================================================================
// BACKEND GAPS - Frontend Workarounds
// ============================================================================

/**
 * BACKEND GAP #1: Missing public partner profile endpoint
 * 
 * NEEDED: GET /api/services/:partnerId
 * CURRENT: Only GET /api/services/:partnerId/items returns items
 * 
 * WORKAROUND: Frontend extracts partner info from the items response
 * or uses a mock service until backend implements this endpoint.
 */

/**
 * BACKEND GAP #2: Partner listing by ServiceType with partner-level data
 * 
 * NEEDED: GET /api/services?serviceType=hotel (returns partners, not items)
 * CURRENT: Search returns items, need to aggregate by partner
 * 
 * WORKAROUND: Frontend groups search results by partnerId to show
 * partner cards instead of individual items on browse pages.
 */

/**
 * BACKEND GAP #3: Featured items filter
 * 
 * NEEDED: GET /api/services/search?featured=true
 * CURRENT: isFeatured field exists but filter may not be implemented
 * 
 * WORKAROUND: Frontend filters client-side or shows regular items
 * until backend adds this filter.
 */
