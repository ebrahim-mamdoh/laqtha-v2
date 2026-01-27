// ============================================================================
// Partner API Service
// ============================================================================

import { apiGet, apiPost, apiPut } from '../client';
import type {
  // Registration & Auth
  PartnerRegisterRequest,
  PartnerRegisterResponse,
  PartnerVerifyOtpRequest,
  PartnerVerifyOtpResponse,
  PartnerLoginRequest,
  PartnerLoginResponse,
  PartnerResendOtpRequest,
  PartnerResendOtpResponse,
  // Profile & Status
  GetPartnerMeResponse,
  GetPartnerStatusResponse,
  GetPartnerProfileResponse,
  UpdatePartnerProfileRequest,
  UpdatePartnerProfileResponse,
  ChangeServiceTypeRequest,
  ChangeServiceTypeResponse,
  ResubmitApplicationResponse,
  // Items
  GetPartnerItemsParams,
  GetPartnerItemsResponse,
  PartnerItemsSummaryResponse,
  GetPartnerItemFieldsResponse,
  GetPartnerItemResponse,
  CreateItemRequest,
  CreateItemResponse,
  UpdateItemRequest,
  UpdateItemResponse,
  ChangeItemStateRequest,
  ChangeItemStateResponse,
  DeletePartnerItemResponse,
} from '@/types/api';

export const partnerApi = {
  // ============================================================================
  // Authentication
  // ============================================================================
  
  register: (data: PartnerRegisterRequest) =>
    apiPost<PartnerRegisterResponse>('/partners/register', data),

  verifyOtp: (data: PartnerVerifyOtpRequest) =>
    apiPost<PartnerVerifyOtpResponse>('/partners/verify-otp', data),

  login: (data: PartnerLoginRequest) =>
    apiPost<PartnerLoginResponse>('/partners/login', data),

  resendOtp: (data: PartnerResendOtpRequest) =>
    apiPost<PartnerResendOtpResponse>('/partners/resend-otp', data),

  // ============================================================================
  // Profile & Status
  // ============================================================================

  getMe: () =>
    apiGet<GetPartnerMeResponse>('/partners/me'),

  getStatus: () =>
    apiGet<GetPartnerStatusResponse>('/partners/me/status'),

  getProfile: () =>
    apiGet<GetPartnerProfileResponse>('/partners/me/profile'),

  updateProfile: (data: UpdatePartnerProfileRequest) =>
    apiPut<UpdatePartnerProfileResponse>('/partners/me/profile', data),

  changeServiceType: (data: ChangeServiceTypeRequest) =>
    apiPut<ChangeServiceTypeResponse>('/partners/me/service-type', data),

  resubmit: () =>
    apiPost<ResubmitApplicationResponse>('/partners/me/resubmit'),

  // ============================================================================
  // Service Items
  // ============================================================================

  getItems: (params?: GetPartnerItemsParams) =>
    apiGet<GetPartnerItemsResponse>('/partner/items', params as Record<string, unknown>),

  getItemsSummary: () =>
    apiGet<PartnerItemsSummaryResponse>('/partner/items/summary'),

  getItemFields: () =>
    apiGet<GetPartnerItemFieldsResponse>('/partner/items/fields'),

  getItem: (itemId: string) =>
    apiGet<GetPartnerItemResponse>(`/partner/items/${itemId}`),

  createItem: (data: CreateItemRequest) =>
    apiPost<CreateItemResponse>('/partner/items', data),

  updateItem: (itemId: string, data: UpdateItemRequest) =>
    apiPut<UpdateItemResponse>(`/partner/items/${itemId}`, data),

  changeItemState: (itemId: string, data: ChangeItemStateRequest) =>
    apiPost<ChangeItemStateResponse>(`/partner/items/${itemId}/state`, data),

  deleteItem: (itemId: string) =>
    apiPost<DeletePartnerItemResponse>(`/partner/items/${itemId}`),
};

export default partnerApi;
