import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, validateRateLimit } from '@/lib/api/auth';
import { createLogger } from '@/lib/logger';

const logger = createLogger('api-auth-login');

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Check rate limit
  try {
    const rateLimitResult = await validateRateLimit(ip);
    
    if (rateLimitResult.limited) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      logger.warn('Missing username or password');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Authenticate user
    const authResult = await authenticateUser(username, password);
    
    if (!authResult) {
      logger.warn(`Authentication failed for user: ${username}`);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    const { user, token } = authResult;
    
    logger.info(`User authenticated: ${username}`, { role: user.role });
    
    // Set JWT token as HTTP-only cookie
    const response = NextResponse.json({ 
      success: true,
      user: {
        username: user.username,
        role: user.role
      }
    });
    
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return response;
  } catch (error) {
    logger.error('Login error', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 