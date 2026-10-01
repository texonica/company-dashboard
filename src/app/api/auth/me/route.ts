import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { User } from '@/types/aitable';

const logger = createLogger('api-auth-me');

export async function GET(request: NextRequest) {
  try {
    // Get user information from request headers (set by middleware)
    const username = request.headers.get('x-user-name');
    const role = request.headers.get('x-user-role');
    
    if (!username || !role) {
      logger.warn('User information not found in request headers');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    logger.debug('Returning user information', { username, role });
    
    const user: User = {
      username,
      role: role as 'CEO' | 'CFO' | 'SalesManager' | 'PM'
    };
    
    return NextResponse.json({ user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error retrieving user information', { error: errorMessage });
    
    return NextResponse.json(
      { error: 'Failed to retrieve user information' },
      { status: 500 }
    );
  }
} 