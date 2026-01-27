// ============================================================================
// Partner React Query Hooks
// ============================================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { partnerApi, queryKeys, tokenManager } from '@/lib/api';
import type {
  PartnerRegisterRequest,
  PartnerVerifyOtpRequest,
  PartnerLoginRequest,
  PartnerResendOtpRequest,
  UpdatePartnerProfileRequest,
  ChangeServiceTypeRequest,
  GetPartnerItemsParams,
  CreateItemRequest,
  UpdateItemRequest,
  ChangeItemStateRequest,
} from '@/types/api';

// ============================================================================
// Auth Queries & Mutations
// ============================================================================

export function usePartnerRegister() {
  return useMutation({
    mutationFn: (data: PartnerRegisterRequest) => partnerApi.register(data),
  });
}

export function usePartnerVerifyOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartnerVerifyOtpRequest) => partnerApi.verifyOtp(data),
    onSuccess: (response) => {
      tokenManager.setTokens(response.accessToken, response.refreshToken);
      queryClient.setQueryData(queryKeys.partner.me(), { partner: response.partner });
    },
  });
}

export function usePartnerLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartnerLoginRequest) => partnerApi.login(data),
    onSuccess: (response) => {
      tokenManager.setTokens(response.accessToken, response.refreshToken);
      queryClient.setQueryData(queryKeys.partner.me(), { partner: response.partner });
    },
  });
}

export function usePartnerResendOtp() {
  return useMutation({
    mutationFn: (data: PartnerResendOtpRequest) => partnerApi.resendOtp(data),
  });
}

// ============================================================================
// Profile Queries & Mutations
// ============================================================================

export function usePartnerMe() {
  return useQuery({
    queryKey: queryKeys.partner.me(),
    queryFn: () => partnerApi.getMe(),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePartnerStatus() {
  return useQuery({
    queryKey: queryKeys.partner.status(),
    queryFn: () => partnerApi.getStatus(),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 60 * 1000, // 1 minute - check status more frequently
  });
}

export function usePartnerProfile() {
  return useQuery({
    queryKey: queryKeys.partner.profile(),
    queryFn: () => partnerApi.getProfile(),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdatePartnerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePartnerProfileRequest) => partnerApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.me() });
    },
  });
}

export function useChangeServiceType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeServiceTypeRequest) => partnerApi.changeServiceType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.all });
    },
  });
}

export function useResubmitApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => partnerApi.resubmit(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.status() });
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.me() });
    },
  });
}

// ============================================================================
// Items Queries & Mutations
// ============================================================================

export function usePartnerItems(params?: GetPartnerItemsParams) {
  return useQuery({
    queryKey: queryKeys.partnerItems.list(params),
    queryFn: () => partnerApi.getItems(params),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePartnerItemsSummary() {
  return useQuery({
    queryKey: queryKeys.partnerItems.summary(),
    queryFn: () => partnerApi.getItemsSummary(),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePartnerItemFields() {
  return useQuery({
    queryKey: queryKeys.partnerItems.fields(),
    queryFn: () => partnerApi.getItemFields(),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 10 * 60 * 1000, // Fields don't change often
  });
}

export function usePartnerItem(itemId: string) {
  return useQuery({
    queryKey: queryKeys.partnerItems.detail(itemId),
    queryFn: () => partnerApi.getItem(itemId),
    enabled: !!itemId && tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemRequest) => partnerApi.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerItems.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerItems.summary() });
    },
  });
}

export function useUpdateItem(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateItemRequest) => partnerApi.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerItems.detail(itemId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerItems.list() });
    },
  });
}

export function useChangeItemState(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeItemStateRequest) => partnerApi.changeItemState(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerItems.detail(itemId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerItems.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerItems.summary() });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => partnerApi.deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerItems.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerItems.summary() });
    },
  });
}
