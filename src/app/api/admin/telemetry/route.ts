import { NextRequest, NextResponse } from 'next/server';
import { getTelemetrySummary, clearTelemetry, getLLMUsage, getAPITelemetry } from '@/lib/api/telemetry';

/**
 * GET /api/admin/telemetry
 * Development endpoint to access telemetry data
 * Note: In production, this would be replaced by Grafana integration
 */
export async function GET(request: NextRequest) {
  // In production, this endpoint should be protected by admin-level authentication
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'This endpoint is for development only',
    }, { status: 403 });
  }
  
  // Get detail level from request
  const searchParams = request.nextUrl.searchParams;
  const detail = searchParams.get('detail') || 'summary';
  
  // Return different views based on detail level
  if (detail === 'summary') {
    return NextResponse.json(getTelemetrySummary());
  } else if (detail === 'llm') {
    return NextResponse.json({
      llmUsage: getLLMUsage(),
    });
  } else if (detail === 'api') {
    return NextResponse.json({
      apiTelemetry: getAPITelemetry(),
    });
  } else if (detail === 'all') {
    return NextResponse.json({
      summary: getTelemetrySummary(),
      llmUsage: getLLMUsage(),
      apiTelemetry: getAPITelemetry(),
    });
  }
  
  return NextResponse.json({
    error: 'Invalid detail level',
  }, { status: 400 });
}

/**
 * POST /api/admin/telemetry/clear
 * Development endpoint to clear telemetry data
 */
export async function POST(request: NextRequest) {
  // In production, this endpoint should be protected by admin-level authentication
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'This endpoint is for development only',
    }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    
    if (body.action === 'clear') {
      return NextResponse.json(clearTelemetry());
    }
    
    return NextResponse.json({
      error: 'Invalid action',
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid request body',
    }, { status: 400 });
  }
} 