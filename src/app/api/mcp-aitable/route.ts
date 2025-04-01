import { NextResponse } from 'next/server';
import { AITABLE_CONFIG } from '@/lib/api/aitable';

export async function GET() {
  try {
    // Use MCP AITable functions directly
    const baseId = AITABLE_CONFIG.BASE_ID;
    const tableId = AITABLE_CONFIG.PROJECTS_TABLE_ID;
    const filter = 'OR(Stage="Launched",Stage="Onboarding")';
    
    try {
      // This would use MCP's AITable list_records function in a real implementation
      // For demonstration purposes, we'll use fetch to call the API
      // In the future this would be replaced with:
      // const records = await mcp_aitable_list_records({ baseId, tableId, filterByFormula: filter });
      
      const API_TOKEN = process.env.AITABLE_API_TOKEN;
      
      if (!API_TOKEN) {
        return NextResponse.json(
          { error: 'API configuration error: No API token provided' },
          { status: 401 }
        );
      }
      
      const url = `${AITABLE_CONFIG.BASE_URL}/api/v1/space/${baseId}/table/${tableId}/records?filterByFormula=${encodeURIComponent(filter)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        return NextResponse.json(
          { error: `AITable API error: ${response.status}` },
          { status: response.status }
        );
      }
      
      const data = await response.json();
      
      // Format the response to match our expected structure
      const mockResponse = {
        success: true,
        message: 'Projects fetched via MCP AITable integration',
        data: data.records?.map((record: any) => ({
          id: record.id,
          title: record.fields?.Title || 'Untitled Project'
        })) || []
      };
      
      return NextResponse.json(mockResponse);
    } catch (apiError) {
      console.error('AITable API error:', apiError);
      
      return NextResponse.json({ 
        error: 'Failed to fetch data via MCP AITable',
        details: apiError instanceof Error ? apiError.message : String(apiError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in MCP AITable route:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch data via MCP',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 