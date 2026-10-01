import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge, checkPermissionEdge } from './lib/api/edge-auth';
import { createLogger } from './lib/logger';

const logger = createLogger('middleware');

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/api/auth/login'];

// Define role-based route access
const roleBasedRoutes: Record<string, string[]> = {
  '/dashboard/finance': ['CEO', 'CFO'],
  '/dashboard/sales': ['CEO', 'SalesManager'],
  '/dashboard/projects': ['CEO', 'PM'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/auth/'))) {
    return NextResponse.next();
  }
  
  // Special bypass for development/testing (not for production)
  if (process.env.NODE_ENV !== 'production' && request.headers.get('x-bypass-auth') === 'true') {
    logger.debug(`Authentication bypassed for ${pathname} in development mode`);
    return NextResponse.next();
  }
  
  // Check for auth token
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    logger.warn(`Unauthorized access attempt to ${pathname}`);
    
    // Redirect to login page
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
  
  // Verify token and get user
  const user = await verifyTokenEdge(token);
  
  if (!user) {
    logger.warn(`Invalid token for access to ${pathname}`);
    
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
  
  // Check role-based access for specific routes
  for (const [route, roles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route)) {
      const hasAccess = roles.some(role => checkPermissionEdge(user.role, role as any));
      
      if (!hasAccess) {
        logger.warn(`Access denied for user ${user.username} (${user.role}) to ${pathname}`);
        
        // Redirect to dashboard home
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }
  
  logger.debug(`Access granted for user ${user.username} (${user.role}) to ${pathname}`);
  
  // Allow access
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 