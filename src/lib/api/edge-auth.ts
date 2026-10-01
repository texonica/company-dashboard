/**
 * Edge-compatible authentication utilities
 * For use in middleware and other Edge Runtime environments
 */

import { User, UserRole } from '../../types/aitable';
import { jwtVerify } from 'jose';
import { createLogger } from '../logger';

const logger = createLogger('edge-auth');

// Environment variables with defaults for local development
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';

/**
 * Verify JWT token and return user (Edge-compatible)
 */
export async function verifyTokenEdge(token: string): Promise<User | null> {
  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(JWT_SECRET);
    
    const { payload } = await jwtVerify(token, secretKey);
    
    if (!payload.username || !payload.role) {
      logger.warn('Token payload missing required fields');
      return null;
    }
    
    logger.debug(`Token verified for user ${payload.username}`);
    
    return {
      username: payload.username as string,
      role: payload.role as UserRole,
    };
  } catch (error) {
    logger.error('Token verification failed', error);
    return null;
  }
}

/**
 * Check if user has permission for a specific action
 */
export function checkPermissionEdge(userRole: UserRole, requiredRole: UserRole): boolean {
  // Permission hierarchy
  const roles: Record<UserRole, number> = {
    CEO: 0, // Highest permission
    CFO: 1,
    SalesManager: 2,
    PM: 3,
  };
  
  // CEO has access to everything, other roles have access based on hierarchy
  const hasPermission = roles[userRole] <= roles[requiredRole];
  
  logger.debug(`Permission check: user=${userRole}, required=${requiredRole}, granted=${hasPermission}`);
  
  return hasPermission;
} 