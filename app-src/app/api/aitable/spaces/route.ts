import { NextRequest, NextResponse } from 'next/server';
import { AITableClient } from '@/lib/api/aitable-client';

// Create a singleton instance of AITableClient
const client = new AITableClient(process.env.AITABLE_API_TOKEN || '');

// GET all spaces
export async function GET(request: NextRequest) {
  try {
    // Get all spaces
    const spaces = await client.getSpaces();
    
    return NextResponse.json({ success: true, data: spaces });
  } catch (error: any) {
    console.error('Error fetching spaces:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
} 