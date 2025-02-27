import { NextRequest, NextResponse } from 'next/server';
import { AITableClient } from '@/lib/api/aitable-client';

// Create a singleton instance of AITableClient
const client = new AITableClient(process.env.AITABLE_API_TOKEN || '');

// GET records from a datasheet
export async function GET(
  request: NextRequest,
  { params }: { params: { datasheetId: string } }
) {
  try {
    const datasheetId = params.datasheetId;
    const { searchParams } = request.nextUrl;
    
    // Extract query parameters
    const viewId = searchParams.get('viewId') || undefined;
    const fieldKey = searchParams.get('fieldKey') as 'name' | 'id' | undefined;
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : undefined;
    const pageToken = searchParams.get('pageToken') || undefined;
    
    // Get records from the datasheet
    const result = await client.getRecords(datasheetId, {
      viewId,
      fieldKey,
      pageSize,
      pageToken
    });
    
    return NextResponse.json({ success: true, data: result.records });
  } catch (error: any) {
    console.error('Error fetching records:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
} 