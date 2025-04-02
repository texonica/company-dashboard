import { NextResponse } from 'next/server';
import { AITABLE_CONFIG, fetchTableRecords, fetchClient } from '@/lib/api/aitable';

export async function GET(request: Request) {
  try {
    // Check if environment variables are properly configured
    if (!process.env.AITABLE_API_TOKEN || !process.env.AITABLE_BASE_ID || !process.env.AITABLE_CLIENTS_TABLE_ID) {
      console.error('Missing required environment variables for AITable API');
      return NextResponse.json(
        { error: 'Server configuration error: AITable API credentials missing' },
        { status: 500 }
      );
    }

    // Get client ID from query params if present
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('id');

    try {
      if (clientId) {
        // If specific client ID was requested
        const client = await fetchClient(clientId);
        
        if (!client) {
          return NextResponse.json(
            { error: `Client with ID ${clientId} not found` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          id: client.recordId,
          name: client.fields.Name || '[No Name]',
          fields: client.fields
        });
      } else {
        // No specific client requested, return all clients
        const records = await fetchTableRecords(AITABLE_CONFIG.CLIENTS_TABLE_ID as string);
        
        const clients = records.map(record => ({
          id: record.recordId,
          name: record.fields.Name || '[No Name]',
        }));
        
        return NextResponse.json(clients);
      }
    } catch (apiError) {
      // Handle specific API errors
      console.error('AITable API error:', apiError);
      
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      
      // Look for specific error codes to give more meaningful responses
      if (errorMessage.includes('404') || errorMessage.includes('Record not found')) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }
      
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
    console.error('Error fetching clients from AITable:', error);
    
    // Return the actual error
    return NextResponse.json(
      { error: 'Failed to fetch clients from AITable', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 