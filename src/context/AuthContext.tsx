// ============================================================================
// Authentication Context with TypeScript
// Handles both User and Partner authentication
// ============================================================================

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { tokenManager } from '@/lib/api';
import type { User, Partner, PartnerState, UserRole, PartnerPermissions } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface AuthContextState {
  // User state
  user: User | null;
  isUserAuthenticated: boolean;
  
  // Partner state
  partner: Partner | null;
  isPartnerAuthenticated: boolean;
  partnerPermissions: PartnerPermissions | null;
  
  // General state
  isLoading: boolean;
  authType: 'user' | 'partner' | null;
  
  // Actions
  setUserAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setPartnerAuth: (partner: Partner, accessToken: string, refreshToken: string) => void;
  updateUser: (updates: Partial<User>) => void;
  updatePartner: (updates: Partial<Partner>) => void;
  logout: () => void;
  clearAuth: () => void;
}

// ============================================================================
// Partner Permissions Calculator
// ============================================================================

function calculatePartnerPermissions(state: PartnerState): PartnerPermissions {
  const permissionsMap: Record<PartnerState, PartnerPermissions> = {
    pending_otp: {
      canLogin: false,
      canEditProfile: false,
      canManageItems: false,
      canAccessDashboard: false,
      canChangeServiceType: false,
      visibleToPublic: false,
    },
    pending_approval: {
      canLogin: true,
      canEditProfile: true,
      canManageItems: false,
      canAccessDashboard: false,
      canChangeServiceType: true,
      visibleToPublic: false,
    },
    changes_required: {
      canLogin: true,
      canEditProfile: true,
      canManageItems: false,
      canAccessDashboard: false,
      canChangeServiceType: true,
      visibleToPublic: false,
    },
    rejected: {
      canLogin: true,
      canEditProfile: false,
      canManageItems: false,
      canAccessDashboard: false,
      canChangeServiceType: false,
      visibleToPublic: false,
    },
    approved: {
      canLogin: true,
      canEditProfile: true,
      canManageItems: true,
      canAccessDashboard: true,
      canChangeServiceType: false,
      visibleToPublic: true,
    },
    suspended: {
      canLogin: true,
      canEditProfile: false,
      canManageItems: false,
      canAccessDashboard: true, // Read-only
      canChangeServiceType: false,
      visibleToPublic: false,
    },
  };

  return permissionsMap[state] || permissionsMap.pending_approval;
}

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  USER: 'laqtha_user',
  PARTNER: 'laqtha_partner',
  AUTH_TYPE: 'laqtha_auth_type',
} as const;

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextState | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [authType, setAuthType] = useState<'user' | 'partner' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed values
  const isUserAuthenticated = !!user && authType === 'user';
  const isPartnerAuthenticated = !!partner && authType === 'partner';

  const partnerPermissions = useMemo(() => {
    if (!partner) return null;
    return calculatePartnerPermissions(partner.state);
  }, [partner]);

  // ============================================================================
  // Initialize from localStorage
  // ============================================================================

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window === 'undefined') return;

        const storedAuthType = localStorage.getItem(STORAGE_KEYS.AUTH_TYPE) as 'user' | 'partner' | null;
        const hasToken = tokenManager.isAuthenticated();

        if (!hasToken) {
          clearAuth();
          return;
        }

        if (storedAuthType === 'user') {
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setAuthType('user');
          }
        } else if (storedAuthType === 'partner') {
          const storedPartner = localStorage.getItem(STORAGE_KEYS.PARTNER);
          if (storedPartner) {
            setPartner(JSON.parse(storedPartner));
            setAuthType('partner');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ============================================================================
  // Listen for logout events from API interceptor
  // ============================================================================

  useEffect(() => {
    const handleLogout = () => {
      clearAuth();
      router.push('/login');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [router]);

  // ============================================================================
  // Actions
  // ============================================================================

  const setUserAuth = useCallback((newUser: User, accessToken: string, refreshToken: string) => {
    tokenManager.setTokens(accessToken, refreshToken);
    setUser(newUser);
    setPartner(null);
    setAuthType('user');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.AUTH_TYPE, 'user');
    localStorage.removeItem(STORAGE_KEYS.PARTNER);
  }, []);

  const setPartnerAuth = useCallback((newPartner: Partner, accessToken: string, refreshToken: string) => {
    tokenManager.setTokens(accessToken, refreshToken);
    setPartner(newPartner);
    setUser(null);
    setAuthType('partner');
    localStorage.setItem(STORAGE_KEYS.PARTNER, JSON.stringify(newPartner));
    localStorage.setItem(STORAGE_KEYS.AUTH_TYPE, 'partner');
    localStorage.removeItem(STORAGE_KEYS.USER);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updatePartner = useCallback((updates: Partial<Partner>) => {
    setPartner((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.PARTNER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAuth = useCallback(() => {
    tokenManager.clearTokens();
    setUser(null);
    setPartner(null);
    setAuthType(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PARTNER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TYPE);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    router.push('/');
  }, [clearAuth, router]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value = useMemo<AuthContextState>(
    () => ({
      user,
      isUserAuthenticated,
      partner,
      isPartnerAuthenticated,
      partnerPermissions,
      isLoading,
      authType,
      setUserAuth,
      setPartnerAuth,
      updateUser,
      updatePartner,
      logout,
      clearAuth,
    }),
    [
      user,
      isUserAuthenticated,
      partner,
      isPartnerAuthenticated,
      partnerPermissions,
      isLoading,
      authType,
      setUserAuth,
      setPartnerAuth,
      updateUser,
      updatePartner,
      logout,
      clearAuth,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ============================================================================
// Utility Hooks
// ============================================================================

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === 'admin';
}

export function useUserRole(): UserRole | null {
  const { user } = useAuth();
  return user?.role || null;
}

export function usePartnerState(): PartnerState | null {
  const { partner } = useAuth();
  return partner?.state || null;
}

export function useCanPartnerAccessRoute(route: string): boolean {
  const { partner, partnerPermissions } = useAuth();
  
  if (!partner || !partnerPermissions) return false;

  // Route access mapping based on partner state
  const routeAccessMap: Record<string, (perms: PartnerPermissions, state: PartnerState) => boolean> = {
    '/partner/dashboard': (perms) => perms.canAccessDashboard,
    '/partner/items': (perms) => perms.canManageItems,
    '/partner/items/new': (perms) => perms.canManageItems,
    '/partner/profile': (perms) => perms.canEditProfile,
    '/partner/settings': () => true,
    '/partner/status': (_, state) => state !== 'approved',
    '/partner/pending': (_, state) => state === 'pending_approval',
    '/partner/changes-required': (_, state) => state === 'changes_required',
    '/partner/rejected': (_, state) => state === 'rejected',
    '/partner/suspended': (_, state) => state === 'suspended',
    '/partner/verify-otp': (_, state) => state === 'pending_otp',
  };

  const checker = routeAccessMap[route];
  if (checker) {
    return checker(partnerPermissions, partner.state);
  }

  // Default: check if it's an item detail route
  if (route.startsWith('/partner/items/') && route !== '/partner/items/new') {
    return partnerPermissions.canManageItems || partner.state === 'suspended';
  }

  return true;
}

export default AuthContext;
