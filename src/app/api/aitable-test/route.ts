import { NextResponse } from 'next/server';
import { AITABLE_CONFIG, fetchTableRecords, fetchSpaceDetails, fetchTables } from '@/lib/api/aitable';

// This is a test route to verify AITable API connectivity
export async function GET() {
  try {
    // Fetch base details and tables using our client functions
    const baseData = await fetchSpaceDetails();
    let tablesData = null;
    let projectsData = null;
    
    try {
      tablesData = await fetchTables();
    } catch (tablesError) {
      console.error('Error fetching tables:', tablesError);
    }
    
    try {
      // Fetch a few sample projects
      projectsData = await fetchTableRecords(AITABLE_CONFIG.PROJECTS_TABLE_ID);
      
      // Only take the first 5 for the test
      if (projectsData.length > 5) {
        projectsData = projectsData.slice(0, 5);
      }
    } catch (projectsError) {
      console.error('Error fetching projects:', projectsError);
    }
    
    // Format projects for the response
    const projects = projectsData ? projectsData.map(record => ({
      id: record.id,
      title: record.fields?.Title || 'Untitled Project',
      stage: record.fields?.Stage
    })) : [];
    
    return NextResponse.json({
      message: 'AITable API test results',
      baseDetails: baseData,
      tablesCount: tablesData ? Object.keys(tablesData).length : 0,
      projects,
      config: {
        baseId: AITABLE_CONFIG.BASE_ID,
        tableId: AITABLE_CONFIG.PROJECTS_TABLE_ID
      }
    });
  } catch (error) {
    console.error('Error testing AITable connection:', error);
    
    return NextResponse.json(
      { error: 'Failed to connect to AITable', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 