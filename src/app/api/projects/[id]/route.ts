import { NextRequest, NextResponse } from 'next/server';
import { AITABLE_CONFIG, fetchRecord } from '@/lib/api/aitable';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  try {
    try {
      // Use our new client function to fetch a single record
      const data = await fetchRecord(AITABLE_CONFIG.PROJECTS_TABLE_ID, projectId);
      
      return NextResponse.json(data);
    } catch (apiError) {
      console.error(`Error fetching project ${projectId}:`, apiError);
      
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      
      // Handle 404 specifically
      if (errorMessage.includes('Record not found')) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
      
      // Extract status code if present
      const statusMatch = errorMessage.match(/AITable API error \((\d+)\)/);
      const status = statusMatch ? parseInt(statusMatch[1]) : 500;
      
      return NextResponse.json(
        { error: errorMessage },
        { status }
      );
    }
  } catch (error) {
    console.error(`Error fetching project ${projectId} from AITable:`, error);
    
    // Return the actual error
    return NextResponse.json(
      { error: 'Failed to fetch project details', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 