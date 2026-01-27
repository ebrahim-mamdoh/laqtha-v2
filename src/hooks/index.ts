// ============================================================================
// Hooks Barrel Export
// ============================================================================

// Authentication Hooks
export {
  useCurrentUser,
  useLogin,
  useRegister,
  useVerifyOtp,
  useResendVerification,
  useForgotPassword,
  useResetPassword,
  useLogout,
} from './useAuth';

// Partner Hooks
export {
  usePartnerRegister,
  usePartnerVerifyOtp,
  usePartnerLogin,
  usePartnerResendOtp,
  usePartnerMe,
  usePartnerStatus,
  usePartnerProfile,
  useUpdatePartnerProfile,
  useChangeServiceType,
  useResubmitApplication,
  usePartnerItems,
  usePartnerItemsSummary,
  usePartnerItemFields,
  usePartnerItem,
  useCreateItem,
  useUpdateItem,
  useChangeItemState,
  useDeleteItem,
} from './usePartner';

// Admin Hooks
export {
  // Service Types
  useServiceTypes,
  useServiceTypesStats,
  useServiceType,
  useCreateServiceType,
  useUpdateServiceType,
  useToggleServiceTypeStatus,
  useDeleteServiceType,
  // Partners
  useAdminPartners,
  usePartnersStats,
  useAdminPartner,
  useApprovePartner,
  useRejectPartner,
  useRequestChanges,
  useSuspendPartner,
  useReinstatePartner,
  // Items
  useAdminItems,
  useItemsStats,
  useAdminItem,
  useHideItem,
  useShowItem,
  useArchiveItem,
  useAdminDeleteItem,
  useCleanupItems,
  // Users
  useUsers,
  useUsersStats,
  useUser,
  useUpdateUserRole,
  useToggleUserVerification,
  useDeleteUser,
} from './useAdmin';

// Public Services Hooks
export {
  usePublicServiceTypes,
  usePublicServiceType,
  useServiceTypeFields,
  useSearch,
  useInfiniteSearch,
  useCategories,
  usePartnerPublicItems,
  usePublicItemDetails,
  usePartnerPublicProfile,
  usePartnersByServiceType,
} from './useServices';
