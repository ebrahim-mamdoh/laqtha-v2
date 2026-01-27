// ============================================================================
// React Query Keys - Centralized query key management
// ============================================================================

export const queryKeys = {
  // Authentication
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.users.all, 'list', params] as const,
    stats: () => [...queryKeys.users.all, 'stats'] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },

  // Partners (Admin)
  adminPartners: {
    all: ['admin', 'partners'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.adminPartners.all, 'list', params] as const,
    stats: () => [...queryKeys.adminPartners.all, 'stats'] as const,
    detail: (id: string) => [...queryKeys.adminPartners.all, 'detail', id] as const,
  },

  // Partner (Self)
  partner: {
    all: ['partner'] as const,
    me: () => [...queryKeys.partner.all, 'me'] as const,
    profile: () => [...queryKeys.partner.all, 'profile'] as const,
    status: () => [...queryKeys.partner.all, 'status'] as const,
  },

  // Partner Items (Self)
  partnerItems: {
    all: ['partner', 'items'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.partnerItems.all, 'list', params] as const,
    summary: () => [...queryKeys.partnerItems.all, 'summary'] as const,
    fields: () => [...queryKeys.partnerItems.all, 'fields'] as const,
    detail: (id: string) => [...queryKeys.partnerItems.all, 'detail', id] as const,
  },

  // Service Types
  serviceTypes: {
    all: ['serviceTypes'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.serviceTypes.all, 'list', params] as const,
    stats: () => [...queryKeys.serviceTypes.all, 'stats'] as const,
    detail: (key: string) => [...queryKeys.serviceTypes.all, 'detail', key] as const,
    fields: (key: string) => [...queryKeys.serviceTypes.all, 'fields', key] as const,
    public: () => [...queryKeys.serviceTypes.all, 'public'] as const,
  },

  // Admin Service Items
  adminItems: {
    all: ['admin', 'items'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.adminItems.all, 'list', params] as const,
    stats: () => [...queryKeys.adminItems.all, 'stats'] as const,
    detail: (id: string) => [...queryKeys.adminItems.all, 'detail', id] as const,
  },

  // Public Services
  services: {
    all: ['services'] as const,
    search: (params?: Record<string, unknown>) => [...queryKeys.services.all, 'search', params] as const,
    categories: () => [...queryKeys.services.all, 'categories'] as const,
    partnerItems: (partnerId: string, params?: Record<string, unknown>) =>
      [...queryKeys.services.all, 'partner', partnerId, 'items', params] as const,
    itemDetail: (partnerId: string, itemId: string) =>
      [...queryKeys.services.all, 'partner', partnerId, 'item', itemId] as const,
  },

  // Dashboard Stats
  dashboard: {
    admin: () => ['dashboard', 'admin'] as const,
    partner: () => ['dashboard', 'partner'] as const,
  },
} as const;

// Type helper for query keys
export type QueryKeys = typeof queryKeys;
