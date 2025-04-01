import { NextResponse } from 'next/server';
import { AITABLE_CONFIG, fetchTableRecords } from '@/lib/api/aitable';

export async function GET() {
  try {
    // Check if environment variables are properly configured
    if (!process.env.AITABLE_API_TOKEN || !process.env.AITABLE_BASE_ID || !process.env.AITABLE_PROJECTS_TABLE_ID) {
      console.error('Missing required environment variables for AITable API');
      return NextResponse.json(
        { error: 'Server configuration error: AITable API credentials missing' },
        { status: 500 }
      );
    }

    // Log configuration for debugging
    console.log('API Config:', {
      baseId: process.env.AITABLE_BASE_ID,
      tableId: process.env.AITABLE_PROJECTS_TABLE_ID,
      tokenPrefix: process.env.AITABLE_API_TOKEN ? process.env.AITABLE_API_TOKEN.substring(0, 5) + '...' : 'missing'
    });

    // Use the filter to only get launched and onboarding projects
    const filter = 'OR(Stage="Launched",Stage="Onboarding")';
    
    try {
      // Use our client function which returns records directly
      const records = await fetchTableRecords(AITABLE_CONFIG.PROJECTS_TABLE_ID as string, filter);
      
      // Format the response for our frontend
      const projects = records.map((record) => ({
        id: record.recordId,
        title: record.fields?.Title || record.fields?.Name || 'Untitled Project'
      }));
  
      return NextResponse.json(projects);
    } catch (apiError) {
      // Handle specific API errors
      console.error('AITable API error:', apiError);
      
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      
      // Look for specific error codes to give more meaningful responses
      if (errorMessage.includes('203')) {
        return NextResponse.json(
          { error: 'The specified AITable resources (table or base) do not exist or you do not have access to them. Please check your configuration.' },
          { status: 404 }
        );
      }
      
      const statusMatch = errorMessage.match(/AITable API error \((\d+)\)/);
      const status = statusMatch ? parseInt(statusMatch[1]) : 500;
      
      return NextResponse.json(
        { error: errorMessage },
        { status }
      );
    }
  } catch (error) {
    console.error('Error fetching projects from AITable:', error);
    
    // Return the actual error
    return NextResponse.json(
      { error: 'Failed to fetch projects from AITable', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 