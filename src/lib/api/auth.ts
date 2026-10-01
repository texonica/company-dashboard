/**
 * Authentication service
 * Handles user authentication and rate limiting
 */

import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { createLogger } from '../logger';
import { User, UserRole } from '../../types/aitable';

const logger = createLogger('auth');

// Environment variables with defaults for local development
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';
const USER_CREDENTIALS = process.env.USER_CREDENTIALS || 'admin:$2a$10$IG5Gu2mLXKALtB9lCJLdUORgZu5p.0u1v3u4U8.KvWLhXREvc1jEu,CEO';
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10); // 100 requests per window

// Rate limiter setup
const rateLimiter = new RateLimiterMemory({
  points: RATE_LIMIT_MAX_REQUESTS,
  duration: RATE_LIMIT_WINDOW_MS / 1000, // Convert ms to seconds
});

/**
 * Validate rate limit for an IP address
 */
export async function validateRateLimit(ip: string): Promise<{ limited: boolean; remainingPoints: number }> {
  try {
    const rateLimiterRes = await rateLimiter.consume(ip);
    logger.debug(`Rate limit for IP ${ip}`, {
      remainingPoints: rateLimiterRes.remainingPoints,
      msBeforeNext: rateLimiterRes.msBeforeNext,
    });
    
    return {
      limited: false,
      remainingPoints: rateLimiterRes.remainingPoints,
    };
  } catch (error: any) {
    if (error instanceof Error && !error.hasOwnProperty('msBeforeNext')) {
      // This is not a rate limiter error
      logger.error(`Rate limit error: ${error.message}`);
      throw error;
    }
    
    // This is a rate limiter error (user is blocked)
    logger.warn(`Rate limit exceeded for IP ${ip}`, {
      msBeforeNext: error.msBeforeNext,
    });
    
    return {
      limited: true,
      remainingPoints: 0,
    };
  }
}

/**
 * Parse USER_CREDENTIALS environment variable to get credentials map
 * Format: username:passwordHash,role;username2:passwordHash2,role2
 */
function parseUserCredentials(): Map<string, { password: string; role: UserRole }> {
  const credentialsMap = new Map<string, { password: string; role: UserRole }>();

  try {
    const credentialsArray = USER_CREDENTIALS.split(';');
    
    for (const credential of credentialsArray) {
      const [username, rest] = credential.split(':');
      if (!username || !rest) continue;
      
      const [password, role] = rest.split(',');
      if (!password || !role) continue;
      
      if (!['CEO', 'CFO', 'SalesManager', 'PM'].includes(role)) {
        logger.warn(`Invalid role '${role}' for user '${username}'`);
        continue;
      }
      
      credentialsMap.set(username, {
        password,
        role: role as UserRole,
      });
    }
    
    logger.info(`Loaded ${credentialsMap.size} user credentials`);
  } catch (error) {
    logger.error('Failed to parse user credentials', error);
  }

  return credentialsMap;
}

const userCredentials = parseUserCredentials();

/**
 * Authenticate a user with username and password
 */
export async function authenticateUser(username: string, password: string): Promise<{ user: User; token: string } | null> {
  logger.debug(`Authenticating user: ${username}`);
  
  const userCredential = userCredentials.get(username);
  
  if (!userCredential) {
    logger.warn(`Authentication failed: User ${username} not found`);
    return null;
  }
  
  try {
    const passwordMatch = await bcrypt.compare(password, userCredential.password);
    
    if (!passwordMatch) {
      logger.warn(`Authentication failed: Invalid password for user ${username}`);
      return null;
    }
    
    // Create user object
    const user: User = {
      username,
      role: userCredential.role,
    };
    
    // Create JWT token using jose
    const encoder = new TextEncoder();
    const token = await new SignJWT({ username, role: userCredential.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(encoder.encode(JWT_SECRET));
    
    logger.info(`User ${username} authenticated successfully`, { role: userCredential.role });
    
    return { user, token };
  } catch (error) {
    logger.error(`Authentication error for user ${username}`, error);
    return null;
  }
}

/**
 * Check if user has permission for a specific action
 */
export function checkPermission(userRole: UserRole, requiredRole: UserRole): boolean {
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

/**
 * Generate a password hash for a new user
 * This is a utility function for creating new users
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
} 