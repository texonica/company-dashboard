import { NextRequest, NextResponse } from 'next/server';
import { AITableClient } from '@/lib/api/aitable-client';

// Create a singleton instance of AITableClient
const client = new AITableClient(process.env.AITABLE_API_TOKEN || '');

// GET views from a datasheet
export async function GET(
  request: NextRequest,
  { params }: { params: { datasheetId: string } }
) {
  try {
    const datasheetId = params.datasheetId;
    
    // Get views from the datasheet
    const views = await client.getViews(datasheetId);
    
    return NextResponse.json({ success: true, data: views });
  } catch (error: any) {
    console.error('Error fetching views:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
} 