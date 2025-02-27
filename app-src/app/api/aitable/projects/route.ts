import { NextRequest, NextResponse } from 'next/server';
import { AITableClient } from '@/lib/api/aitable-client';
import { PROJECT_FIELDS } from '@/lib/utils/aitable-utils';

// Create a singleton instance of AITableClient
const client = new AITableClient(process.env.AITABLE_API_TOKEN || '');

// Use hardcoded datasheet ID
const PROJECTS_DATASHEET_ID = 'dstq4onAEtjMleaeCm';
const SPACE_ID = 'spc12q5HY4ay5';

// GET all projects
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');
  
  try {
    if (projectId) {
      // Get a single project by ID
      const response = await client.getRecords(PROJECTS_DATASHEET_ID, {
        fieldKey: 'name',
      });
      
      const project = response.records.find(record => record.recordId === projectId);
      
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, data: project });
    } else {
      // Get all projects
      const response = await client.getRecords(PROJECTS_DATASHEET_ID, {
        fieldKey: 'name',
      });
      
      return NextResponse.json({ success: true, data: response.records });
    }
  } catch (error: any) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// CREATE a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body[PROJECT_FIELDS.NAME]) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    
    const response = await client.createRecords(
      PROJECTS_DATASHEET_ID,
      [{ fields: body }],
      'name'
    );
    
    return NextResponse.json({ 
      success: true, 
      data: response[0],
      message: 'Project created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating project:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// UPDATE an existing project
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.recordId) {
      return NextResponse.json({ error: 'Project ID (recordId) is required' }, { status: 400 });
    }
    
    const response = await client.updateRecords(
      PROJECTS_DATASHEET_ID,
      [{ recordId: body.recordId, fields: body.fields }],
      'name'
    );
    
    return NextResponse.json({ 
      success: true, 
      data: response[0],
      message: 'Project updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating project:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// DELETE a project
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');
  
  if (!projectId) {
    return NextResponse.json({ error: 'Project ID (projectId) is required' }, { status: 400 });
  }
  
  try {
    await client.deleteRecords(PROJECTS_DATASHEET_ID, [projectId]);
    
    return NextResponse.json({ 
      success: true,
      message: 'Project deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting project:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
} 