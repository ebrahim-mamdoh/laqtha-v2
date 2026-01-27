// ============================================================================
// Public Services API
// ============================================================================

import { apiGet } from '../client';
import type {
  GetPublicServiceTypesResponse,
  GetPublicServiceTypeResponse,
  GetServiceTypeFieldsResponse,
  SearchServicesParams,
  SearchServicesResponse,
  GetCategoriesResponse,
  GetPartnerPublicItemsParams,
  GetPartnerPublicItemsResponse,
  GetPublicItemDetailsResponse,
} from '@/types/api';

export const servicesApi = {
  // ============================================================================
  // Service Types (Public)
  // ============================================================================

  getServiceTypes: () =>
    apiGet<GetPublicServiceTypesResponse>('/service-types'),

  getServiceType: (key: string) =>
    apiGet<GetPublicServiceTypeResponse>(`/service-types/${key}`),

  getServiceTypeFields: (key: string) =>
    apiGet<GetServiceTypeFieldsResponse>(`/service-types/${key}/fields`),

  // ============================================================================
  // Search & Browse
  // ============================================================================

  search: (params?: SearchServicesParams) =>
    apiGet<SearchServicesResponse>('/services/search', params as Record<string, unknown>),

  getCategories: () =>
    apiGet<GetCategoriesResponse>('/services/categories'),

  // ============================================================================
  // Partner Public Profile & Items
  // ============================================================================

  getPartnerItems: (partnerId: string, params?: GetPartnerPublicItemsParams) =>
    apiGet<GetPartnerPublicItemsResponse>(`/services/${partnerId}/items`, params as Record<string, unknown>),

  getItemDetails: (partnerId: string, itemId: string) =>
    apiGet<GetPublicItemDetailsResponse>(`/services/${partnerId}/items/${itemId}`),

  // ============================================================================
  // Backend Gap Workarounds
  // ============================================================================

  /**
   * WORKAROUND for missing GET /api/services/:partnerId
   * Extracts partner info from items response
   */
  getPartnerProfile: async (partnerId: string) => {
    const response = await apiGet<GetPartnerPublicItemsResponse>(`/services/${partnerId}/items`);
    return {
      success: true,
      partner: response.partner,
    };
  },

  /**
   * WORKAROUND for partner listing by service type
   * Groups search results by partnerId
   */
  getPartnersByServiceType: async (serviceTypeKey: string) => {
    const response = await servicesApi.search({ serviceType: serviceTypeKey, limit: 100 });
    
    // Group items by partnerId
    const partnerMap = new Map<string, {
      partnerId: string;
      partnerName?: string;
      itemsCount: number;
    }>();

    for (const item of response.data) {
      const existing = partnerMap.get(item.partnerId);
      if (existing) {
        existing.itemsCount++;
      } else {
        partnerMap.set(item.partnerId, {
          partnerId: item.partnerId,
          partnerName: item.partnerName,
          itemsCount: 1,
        });
      }
    }

    return {
      success: true,
      partners: Array.from(partnerMap.values()),
    };
  },
};

export default servicesApi;
