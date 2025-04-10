import type { NextRequest } from 'next/server';
import { processWebhook } from '@/lib/api/chargebee';

/**
 * Webhook handler for Chargebee events
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const result = await processWebhook(payload);
    
    return Response.json({ success: true, result });
  } catch (error: any) {
    console.error('Error processing Chargebee webhook:', error);
    return Response.json(
      { error: error.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Only allow POST requests to this endpoint
export async function GET() {
  return Response.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
} 