import { NextRequest, NextResponse } from 'next/server';
import { AITableClient } from '@/lib/api/aitable-client';

// Create a singleton instance of AITableClient
const client = new AITableClient(process.env.AITABLE_API_TOKEN || '');

// GET all datasheets in a space
export async function GET(
  request: NextRequest,
  { params }: { params: { spaceId: string } }
) {
  try {
    const spaceId = params.spaceId;
    
    // Get all nodes in the space
    const nodes = await client.getNodes(spaceId);
    
    // Filter only datasheet nodes
    const datasheets = nodes.filter(node => node.type === 'Datasheet');
    
    return NextResponse.json({ success: true, data: datasheets });
  } catch (error: any) {
    console.error('Error fetching datasheets:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
} 