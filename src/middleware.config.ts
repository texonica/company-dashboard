import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
}; 