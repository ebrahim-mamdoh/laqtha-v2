// ============================================================================
// Public Services React Query Hooks
// ============================================================================

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { servicesApi, queryKeys } from '@/lib/api';
import type { SearchServicesParams, GetPartnerPublicItemsParams } from '@/types/api';

// ============================================================================
// Service Types (Public)
// ============================================================================

export function usePublicServiceTypes() {
  return useQuery({
    queryKey: queryKeys.serviceTypes.public(),
    queryFn: () => servicesApi.getServiceTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes - service types don't change often
  });
}

export function usePublicServiceType(key: string) {
  return useQuery({
    queryKey: queryKeys.serviceTypes.detail(key),
    queryFn: () => servicesApi.getServiceType(key),
    enabled: !!key,
    staleTime: 10 * 60 * 1000,
  });
}

export function useServiceTypeFields(key: string) {
  return useQuery({
    queryKey: queryKeys.serviceTypes.fields(key),
    queryFn: () => servicesApi.getServiceTypeFields(key),
    enabled: !!key,
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Search & Browse
// ============================================================================

export function useSearch(params?: SearchServicesParams) {
  return useQuery({
    queryKey: queryKeys.services.search(params),
    queryFn: () => servicesApi.search(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useInfiniteSearch(params?: Omit<SearchServicesParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.services.search(params),
    queryFn: ({ pageParam = 1 }) => servicesApi.search({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.services.categories(),
    queryFn: () => servicesApi.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Partner Public Profile & Items
// ============================================================================

export function usePartnerPublicItems(partnerId: string, params?: GetPartnerPublicItemsParams) {
  return useQuery({
    queryKey: queryKeys.services.partnerItems(partnerId, params),
    queryFn: () => servicesApi.getPartnerItems(partnerId, params),
    enabled: !!partnerId,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicItemDetails(partnerId: string, itemId: string) {
  return useQuery({
    queryKey: queryKeys.services.itemDetail(partnerId, itemId),
    queryFn: () => servicesApi.getItemDetails(partnerId, itemId),
    enabled: !!partnerId && !!itemId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Workaround Hooks
// ============================================================================

/**
 * Uses the workaround to get partner profile from items response
 */
export function usePartnerPublicProfile(partnerId: string) {
  return useQuery({
    queryKey: ['partner', 'public', partnerId, 'profile'],
    queryFn: () => servicesApi.getPartnerProfile(partnerId),
    enabled: !!partnerId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Uses the workaround to get partners by service type
 */
export function usePartnersByServiceType(serviceTypeKey: string) {
  return useQuery({
    queryKey: ['partners', 'byServiceType', serviceTypeKey],
    queryFn: () => servicesApi.getPartnersByServiceType(serviceTypeKey),
    enabled: !!serviceTypeKey,
    staleTime: 5 * 60 * 1000,
  });
}
