'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { UserRole } from '@/lib/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [] 
}: ProtectedRouteProps) {
  const { user, userRole, isAuthorized, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Only run client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run checks on client and after auth state is loaded
    if (mounted && !loading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push('/login');
      } 
      // If authenticated but not authorized (not kamil@texonica.com)
      else if (!isAuthorized) {
        router.push('/unauthorized');
      } 
      // If authenticated and authorized but doesn't have required role
      else if (
        requiredRoles.length > 0 && 
        userRole && 
        !requiredRoles.includes(userRole)
      ) {
        router.push('/unauthorized');
      }
    }
  }, [user, userRole, isAuthorized, loading, router, requiredRoles, mounted]);

  // Don't render anything during SSR or loading
  if (!mounted || loading) {
    return null;
  }

  // If not authenticated or not authorized, don't render children
  if (!user || !isAuthorized) {
    return null;
  }

  // If roles are specified and user doesn't have required role, don't render
  if (requiredRoles.length > 0 && userRole && !requiredRoles.includes(userRole)) {
    return null;
  }

  // Otherwise, render children
  return <>{children}</>;
} 