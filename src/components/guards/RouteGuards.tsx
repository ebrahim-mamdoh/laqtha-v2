// ============================================================================
// Route Guards and Protected Route Components
// ============================================================================

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useCanPartnerAccessRoute } from '@/context/AuthContext.tsx';
import type { UserRole, PartnerState } from '@/types';

// ============================================================================
// Loading Component
// ============================================================================

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  );
}

// ============================================================================
// Unauthorized Component
// ============================================================================

function UnauthorizedScreen({ message }: { message?: string }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center max-w-md p-8">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h1>
        <p className="text-gray-600 mb-6">
          {message || 'ليس لديك صلاحية للوصول إلى هذه الصفحة'}
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          العودة
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Public Route Guard (Redirect authenticated users)
// ============================================================================

interface PublicRouteGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRouteGuard({ children, redirectTo = '/' }: PublicRouteGuardProps) {
  const { isUserAuthenticated, isPartnerAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isUserAuthenticated || isPartnerAuthenticated)) {
      router.replace(redirectTo);
    }
  }, [isLoading, isUserAuthenticated, isPartnerAuthenticated, router, redirectTo]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isUserAuthenticated || isPartnerAuthenticated) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}

// ============================================================================
// User Route Guard
// ============================================================================

interface UserRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

export function UserRouteGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/login' 
}: UserRouteGuardProps) {
  const { user, isUserAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isUserAuthenticated) {
        router.replace(fallbackPath);
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.replace('/unauthorized');
      }
    }
  }, [isLoading, isUserAuthenticated, user, allowedRoles, router, fallbackPath]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isUserAuthenticated) {
    return <AuthLoadingScreen />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <UnauthorizedScreen />;
  }

  return <>{children}</>;
}

// ============================================================================
// Admin Route Guard
// ============================================================================

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  return (
    <UserRouteGuard allowedRoles={['admin']} fallbackPath="/login">
      {children}
    </UserRouteGuard>
  );
}

// ============================================================================
// Partner Route Guard with State-Based Redirects
// ============================================================================

interface PartnerRouteGuardProps {
  children: React.ReactNode;
  requiredStates?: PartnerState[];
  redirectMap?: Partial<Record<PartnerState, string>>;
}

const DEFAULT_PARTNER_REDIRECTS: Record<PartnerState, string> = {
  pending_otp: '/partner/verify-otp',
  pending_approval: '/partner/pending',
  changes_required: '/partner/changes-required',
  rejected: '/partner/rejected',
  approved: '/partner/dashboard',
  suspended: '/partner/suspended',
};

export function PartnerRouteGuard({ 
  children, 
  requiredStates,
  redirectMap = DEFAULT_PARTNER_REDIRECTS 
}: PartnerRouteGuardProps) {
  const { partner, isPartnerAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const canAccess = useCanPartnerAccessRoute(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isPartnerAuthenticated) {
        router.replace('/partner/login');
        return;
      }

      if (!partner) return;

      // If specific states are required, check them
      if (requiredStates && !requiredStates.includes(partner.state)) {
        const redirectPath = redirectMap[partner.state] || '/partner/dashboard';
        if (pathname !== redirectPath) {
          router.replace(redirectPath);
        }
        return;
      }

      // Check route-specific access
      if (!canAccess) {
        const redirectPath = redirectMap[partner.state] || '/partner/dashboard';
        if (pathname !== redirectPath) {
          router.replace(redirectPath);
        }
      }
    }
  }, [isLoading, isPartnerAuthenticated, partner, requiredStates, canAccess, pathname, router, redirectMap]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isPartnerAuthenticated) {
    return <AuthLoadingScreen />;
  }

  if (!canAccess) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}

// ============================================================================
// Partner Dashboard Guard (Only approved or suspended with read-only)
// ============================================================================

export function PartnerDashboardGuard({ children }: { children: React.ReactNode }) {
  return (
    <PartnerRouteGuard requiredStates={['approved', 'suspended']}>
      {children}
    </PartnerRouteGuard>
  );
}

// ============================================================================
// Partner Items Management Guard (Only approved)
// ============================================================================

export function PartnerItemsGuard({ children }: { children: React.ReactNode }) {
  return (
    <PartnerRouteGuard requiredStates={['approved']}>
      {children}
    </PartnerRouteGuard>
  );
}

// ============================================================================
// Higher-Order Component Versions
// ============================================================================

export function withUserAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { allowedRoles?: UserRole[]; fallbackPath?: string }
) {
  return function WrappedComponent(props: P) {
    return (
      <UserRouteGuard allowedRoles={options?.allowedRoles} fallbackPath={options?.fallbackPath}>
        <Component {...props} />
      </UserRouteGuard>
    );
  };
}

export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    return (
      <AdminRouteGuard>
        <Component {...props} />
      </AdminRouteGuard>
    );
  };
}

export function withPartnerAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requiredStates?: PartnerState[] }
) {
  return function WrappedComponent(props: P) {
    return (
      <PartnerRouteGuard requiredStates={options?.requiredStates}>
        <Component {...props} />
      </PartnerRouteGuard>
    );
  };
}

// ============================================================================
// Custom Hook for Conditional Rendering
// ============================================================================

export function useRequireAuth(type: 'user' | 'partner' | 'admin') {
  const { isUserAuthenticated, isPartnerAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    switch (type) {
      case 'user':
        if (!isUserAuthenticated) router.replace('/login');
        break;
      case 'admin':
        if (!isUserAuthenticated || user?.role !== 'admin') router.replace('/login');
        break;
      case 'partner':
        if (!isPartnerAuthenticated) router.replace('/partner/login');
        break;
    }
  }, [type, isUserAuthenticated, isPartnerAuthenticated, user, isLoading, router]);

  return {
    isLoading,
    isAuthorized:
      type === 'user'
        ? isUserAuthenticated
        : type === 'admin'
        ? isUserAuthenticated && user?.role === 'admin'
        : isPartnerAuthenticated,
  };
}
