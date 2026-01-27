// ============================================================================
// Admin React Query Hooks
// ============================================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, queryKeys, tokenManager } from '@/lib/api';
import type {
  // Service Types
  GetServiceTypesParams,
  CreateServiceTypeRequest,
  UpdateServiceTypeRequest,
  ToggleServiceTypeStatusRequest,
  // Partners
  GetPartnersParams,
  ApprovePartnerRequest,
  RejectPartnerRequest,
  RequestChangesRequest,
  SuspendPartnerRequest,
  ReinstatePartnerRequest,
  // Items
  GetAdminItemsParams,
  HideItemRequest,
  // Users
  GetUsersParams,
  UpdateUserRoleRequest,
  ToggleVerificationRequest,
} from '@/types/api';

// ============================================================================
// Service Types Queries & Mutations
// ============================================================================

export function useServiceTypes(params?: GetServiceTypesParams) {
  return useQuery({
    queryKey: queryKeys.serviceTypes.list(params),
    queryFn: () => adminApi.getServiceTypes(params),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useServiceTypesStats() {
  return useQuery({
    queryKey: queryKeys.serviceTypes.stats(),
    queryFn: () => adminApi.getServiceTypesStats(),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useServiceType(key: string) {
  return useQuery({
    queryKey: queryKeys.serviceTypes.detail(key),
    queryFn: () => adminApi.getServiceType(key),
    enabled: !!key && tokenManager.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateServiceType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceTypeRequest) => adminApi.createServiceType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceTypes.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceTypes.stats() });
    },
  });
}

export function useUpdateServiceType(key: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateServiceTypeRequest) => adminApi.updateServiceType(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceTypes.detail(key) });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceTypes.list() });
    },
  });
}

export function useToggleServiceTypeStatus(key: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ToggleServiceTypeStatusRequest) => adminApi.toggleServiceTypeStatus(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceTypes.detail(key) });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceTypes.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceTypes.stats() });
    },
  });
}

export function useDeleteServiceType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => adminApi.deleteServiceType(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceTypes.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceTypes.stats() });
    },
  });
}

// ============================================================================
// Partners Queries & Mutations
// ============================================================================

export function useAdminPartners(params?: GetPartnersParams) {
  return useQuery({
    queryKey: queryKeys.adminPartners.list(params),
    queryFn: () => adminApi.getPartners(params),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePartnersStats() {
  return useQuery({
    queryKey: queryKeys.adminPartners.stats(),
    queryFn: () => adminApi.getPartnersStats(),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminPartner(partnerId: string) {
  return useQuery({
    queryKey: queryKeys.adminPartners.detail(partnerId),
    queryFn: () => adminApi.getPartner(partnerId),
    enabled: !!partnerId && tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useApprovePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partnerId, data }: { partnerId: string; data?: ApprovePartnerRequest }) =>
      adminApi.approvePartner(partnerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.detail(variables.partnerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.stats() });
    },
  });
}

export function useRejectPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partnerId, data }: { partnerId: string; data: RejectPartnerRequest }) =>
      adminApi.rejectPartner(partnerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.detail(variables.partnerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.stats() });
    },
  });
}

export function useRequestChanges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partnerId, data }: { partnerId: string; data: RequestChangesRequest }) =>
      adminApi.requestChanges(partnerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.detail(variables.partnerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.stats() });
    },
  });
}

export function useSuspendPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partnerId, data }: { partnerId: string; data: SuspendPartnerRequest }) =>
      adminApi.suspendPartner(partnerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.detail(variables.partnerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.stats() });
    },
  });
}

export function useReinstatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partnerId, data }: { partnerId: string; data?: ReinstatePartnerRequest }) =>
      adminApi.reinstatePartner(partnerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.detail(variables.partnerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPartners.stats() });
    },
  });
}

// ============================================================================
// Items Queries & Mutations
// ============================================================================

export function useAdminItems(params?: GetAdminItemsParams) {
  return useQuery({
    queryKey: queryKeys.adminItems.list(params),
    queryFn: () => adminApi.getItems(params),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useItemsStats() {
  return useQuery({
    queryKey: queryKeys.adminItems.stats(),
    queryFn: () => adminApi.getItemsStats(),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminItem(itemId: string) {
  return useQuery({
    queryKey: queryKeys.adminItems.detail(itemId),
    queryFn: () => adminApi.getItem(itemId),
    enabled: !!itemId && tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useHideItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: HideItemRequest }) =>
      adminApi.hideItem(itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.detail(variables.itemId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.stats() });
    },
  });
}

export function useShowItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => adminApi.showItem(itemId),
    onSuccess: (_, itemId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.detail(itemId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.stats() });
    },
  });
}

export function useArchiveItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => adminApi.archiveItem(itemId),
    onSuccess: (_, itemId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.detail(itemId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.stats() });
    },
  });
}

export function useAdminDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => adminApi.deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.stats() });
    },
  });
}

export function useCleanupItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminApi.cleanupItems(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminItems.stats() });
    },
  });
}

// ============================================================================
// Users Queries & Mutations
// ============================================================================

export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => adminApi.getUsers(params),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUsersStats() {
  return useQuery({
    queryKey: queryKeys.users.stats(),
    queryFn: () => adminApi.getUsersStats(),
    enabled: tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => adminApi.getUser(userId),
    enabled: !!userId && tokenManager.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRoleRequest }) =>
      adminApi.updateUserRole(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() });
    },
  });
}

export function useToggleUserVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ToggleVerificationRequest }) =>
      adminApi.toggleUserVerification(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() });
    },
  });
}
