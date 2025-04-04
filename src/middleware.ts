import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Declare global types for telemetry storage
declare global {
  var apiTelemetry: any[];
}

// Telemetry function for future Grafana integration
function recordTelemetry(request: NextRequest, responseStatus: number, startTime: number) {
  // Calculate request duration
  const duration = Date.now() - startTime;
  
  // Extract useful information for monitoring
  const path = request.nextUrl.pathname;
  const method = request.method;
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const apiKey = request.headers.get('x-api-key') ? 'present' : 'missing';
  
  // Create telemetry object for logging
  const telemetry = {
    timestamp: new Date().toISOString(),
    path,
    method,
    userAgent,
    apiKey,
    responseStatus,
    duration,
    // Add cache hit indicator in future implementation
    cacheHit: false,
  };
  
  // TODO: In future implementation, this would be sent to a logging service or Grafana
  // Current simple implementation just logs to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API Telemetry]', JSON.stringify(telemetry));
  }

  // Store in memory temporarily (consider using a proper store in production)
  if (typeof global.apiTelemetry === 'undefined') {
    global.apiTelemetry = [];
  }
  global.apiTelemetry.push(telemetry);
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Record start time for duration calculation
  const startTime = Date.now();
  
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the request is for an API route
  if (path.startsWith('/api/')) {
    // Check if we're bypassing auth in development
    const devAuthBypass = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';
    
    // If we're not bypassing auth, check for the API key
    if (!devAuthBypass) {
      const apiKey = request.headers.get('x-api-key');
      const validApiKey = process.env.TEMPORARY_API_KEY;
      
      console.log('[Debug] Authentication check - Path:', path);
      console.log('[Debug] Checking API key:', apiKey, 'Valid key:', validApiKey);
      console.log('[Debug] DEV_AUTH_BYPASS:', process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS);

      // If no API key is provided or it doesn't match, return 401 Unauthorized
      if (!apiKey || apiKey !== validApiKey) {
        const response = new NextResponse(
          JSON.stringify({ error: 'Unauthorized access' }),
          { 
            status: 401, 
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        // Record telemetry for unauthorized requests
        recordTelemetry(request, 401, startTime);
        
        return response;
      }
    } else {
      console.log('[Debug] Bypassing auth check in development mode for:', path);
    }
  }

  // For successful requests, we need to record telemetry after the response is generated
  const response = NextResponse.next();
  
  // Record telemetry for successful requests
  recordTelemetry(request, 200, startTime);
  
  return response;
}
