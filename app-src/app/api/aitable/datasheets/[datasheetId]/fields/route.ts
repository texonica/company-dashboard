import { NextRequest, NextResponse } from 'next/server';
import { AITableClient } from '@/lib/api/aitable-client';

// Create a singleton instance of AITableClient
const client = new AITableClient(process.env.AITABLE_API_TOKEN || '');

// GET fields from a datasheet
export async function GET(
  request: NextRequest,
  { params }: { params: { datasheetId: string } }
) {
  try {
    const datasheetId = params.datasheetId;
    const { searchParams } = request.nextUrl;
    const viewId = searchParams.get('viewId') || undefined;
    
    // Get fields from the datasheet
    const fields = await client.getFields(datasheetId, viewId);
    
    return NextResponse.json({ success: true, data: fields });
  } catch (error: any) {
    console.error('Error fetching fields:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
} 