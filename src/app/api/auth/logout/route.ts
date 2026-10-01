import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { cookies } from 'next/headers';

const logger = createLogger('api-auth-logout');

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    
    // Get the user information from the request (set by middleware)
    const username = request.headers.get('x-user-name');
    
    logger.info('User logging out', { username });
    
    // Create a response that clears the auth token cookie
    const response = NextResponse.json({ success: true });
    
    // Clear the auth token cookie
    response.cookies.set({
      name: 'auth_token',
      value: '',
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    logger.debug('Auth token cookie cleared');
    
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error during logout', { error: errorMessage });
    
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
} 