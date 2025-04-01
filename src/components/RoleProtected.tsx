'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { UserRole } from '@/lib/firebase';

interface RoleProtectedProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders content based on user role
 * 
 * @param children Content to render if user has one of the allowed roles
 * @param allowedRoles Array of roles that are allowed to view the content
 * @param fallback Optional content to render if user doesn't have any of the allowed roles
 */
export function RoleProtected({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleProtectedProps) {
  const { userRole } = useAuth();

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 