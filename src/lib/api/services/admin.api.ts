// ============================================================================
// Admin API Service
// ============================================================================

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../client';
import type {
  // Service Types
  GetServiceTypesParams,
  GetServiceTypesResponse,
  ServiceTypesStatsResponse,
  GetServiceTypeResponse,
  CreateServiceTypeRequest,
  CreateServiceTypeResponse,
  UpdateServiceTypeRequest,
  UpdateServiceTypeResponse,
  ToggleServiceTypeStatusRequest,
  ToggleServiceTypeStatusResponse,
  DeleteServiceTypeResponse,
  // Partners
  GetPartnersParams,
  GetPartnersResponse,
  PartnersStatsResponse,
  GetPartnerDetailsResponse,
  ApprovePartnerRequest,
  ApprovePartnerResponse,
  RejectPartnerRequest,
  RejectPartnerResponse,
  RequestChangesRequest,
  RequestChangesResponse,
  SuspendPartnerRequest,
  SuspendPartnerResponse,
  ReinstatePartnerRequest,
  ReinstatePartnerResponse,
  // Service Items
  GetAdminItemsParams,
  GetAdminItemsResponse,
  ItemsStatsResponse,
  GetAdminItemDetailsResponse,
  HideItemRequest,
  HideItemResponse,
  ShowItemResponse,
  ArchiveItemResponse,
  DeleteItemResponse,
  CleanupItemsResponse,
  // Users
  GetUsersParams,
  GetUsersResponse,
  UsersStatsResponse,
  GetUserDetailsResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
  ToggleVerificationRequest,
  ToggleVerificationResponse,
  DeleteUserResponse,
} from '@/types/api';

export const adminApi = {
  // ============================================================================
  // Service Types
  // ============================================================================

  getServiceTypes: (params?: GetServiceTypesParams) =>
    apiGet<GetServiceTypesResponse>('/admin/service-types', params as Record<string, unknown>),

  getServiceTypesStats: () =>
    apiGet<ServiceTypesStatsResponse>('/admin/service-types/stats'),

  getServiceType: (key: string) =>
    apiGet<GetServiceTypeResponse>(`/admin/service-types/${key}`),

  createServiceType: (data: CreateServiceTypeRequest) =>
    apiPost<CreateServiceTypeResponse>('/admin/service-types', data),

  updateServiceType: (key: string, data: UpdateServiceTypeRequest) =>
    apiPut<UpdateServiceTypeResponse>(`/admin/service-types/${key}`, data),

  toggleServiceTypeStatus: (key: string, data: ToggleServiceTypeStatusRequest) =>
    apiPatch<ToggleServiceTypeStatusResponse>(`/admin/service-types/${key}/status`, data),

  deleteServiceType: (key: string) =>
    apiDelete<DeleteServiceTypeResponse>(`/admin/service-types/${key}`),

  // ============================================================================
  // Partners Management
  // ============================================================================

  getPartners: (params?: GetPartnersParams) =>
    apiGet<GetPartnersResponse>('/admin/partners', params as Record<string, unknown>),

  getPartnersStats: () =>
    apiGet<PartnersStatsResponse>('/admin/partners/stats'),

  getPartner: (partnerId: string) =>
    apiGet<GetPartnerDetailsResponse>(`/admin/partners/${partnerId}`),

  approvePartner: (partnerId: string, data?: ApprovePartnerRequest) =>
    apiPost<ApprovePartnerResponse>(`/admin/partners/${partnerId}/approve`, data),

  rejectPartner: (partnerId: string, data: RejectPartnerRequest) =>
    apiPost<RejectPartnerResponse>(`/admin/partners/${partnerId}/reject`, data),

  requestChanges: (partnerId: string, data: RequestChangesRequest) =>
    apiPost<RequestChangesResponse>(`/admin/partners/${partnerId}/request-changes`, data),

  suspendPartner: (partnerId: string, data: SuspendPartnerRequest) =>
    apiPost<SuspendPartnerResponse>(`/admin/partners/${partnerId}/suspend`, data),

  reinstatePartner: (partnerId: string, data?: ReinstatePartnerRequest) =>
    apiPost<ReinstatePartnerResponse>(`/admin/partners/${partnerId}/reinstate`, data),

  // ============================================================================
  // Service Items Management
  // ============================================================================

  getItems: (params?: GetAdminItemsParams) =>
    apiGet<GetAdminItemsResponse>('/admin/service-items', params as Record<string, unknown>),

  getItemsStats: () =>
    apiGet<ItemsStatsResponse>('/admin/service-items/stats'),

  getItem: (itemId: string) =>
    apiGet<GetAdminItemDetailsResponse>(`/admin/service-items/${itemId}`),

  hideItem: (itemId: string, data: HideItemRequest) =>
    apiPost<HideItemResponse>(`/admin/service-items/${itemId}/hide`, data),

  showItem: (itemId: string) =>
    apiPost<ShowItemResponse>(`/admin/service-items/${itemId}/show`),

  archiveItem: (itemId: string) =>
    apiPost<ArchiveItemResponse>(`/admin/service-items/${itemId}/archive`),

  deleteItem: (itemId: string) =>
    apiDelete<DeleteItemResponse>(`/admin/service-items/${itemId}`),

  cleanupItems: () =>
    apiPost<CleanupItemsResponse>('/admin/service-items/cleanup'),

  // ============================================================================
  // Users Management
  // ============================================================================

  getUsers: (params?: GetUsersParams) =>
    apiGet<GetUsersResponse>('/user', params as Record<string, unknown>),

  getUsersStats: () =>
    apiGet<UsersStatsResponse>('/user/stats'),

  getUser: (userId: string) =>
    apiGet<GetUserDetailsResponse>(`/user/${userId}`),

  updateUserRole: (userId: string, data: UpdateUserRoleRequest) =>
    apiPatch<UpdateUserRoleResponse>(`/user/${userId}/role`, data),

  toggleUserVerification: (userId: string, data: ToggleVerificationRequest) =>
    apiPatch<ToggleVerificationResponse>(`/user/${userId}/verification`, data),

  deleteUser: (userId: string) =>
    apiDelete<DeleteUserResponse>(`/user/${userId}`),
};

export default adminApi;
