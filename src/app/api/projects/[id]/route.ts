import { NextRequest, NextResponse } from 'next/server';
import { AITABLE_CONFIG, fetchRecord, updateRecord } from '@/lib/api/aitable';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // With Next.js dynamic routes, params.id should always be defined
  const projectId: string = params.id;
  
  try {
    // Use our client function to fetch a single record
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
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // With Next.js dynamic routes, params.id should always be defined
  const projectId: string = params.id;
  
  try {
    const body = await request.json();
    
    // Ensure there are fields to update
    if (!body || !body.fields || Object.keys(body.fields).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // Update the record
    const updatedRecord = await updateRecord(
      AITABLE_CONFIG.PROJECTS_TABLE_ID,
      projectId,
      body.fields
    );
    
    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Extract status code if present
    const statusMatch = errorMessage.match(/AITable API error \((\d+)\)/);
    const status = statusMatch ? parseInt(statusMatch[1]) : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 