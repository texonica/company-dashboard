import { NextRequest, NextResponse } from 'next/server';
import clickUpApi from '@/lib/clickup';

/**
 * Handler for GET requests to /api/clickup
 * Returns information about the authenticated user and available workspaces
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize the ClickUp API client with token from environment variable
    const apiToken = process.env.CLICKUP_API_TOKEN;
    
    if (!apiToken) {
      return NextResponse.json(
        { error: 'ClickUp API token not configured' },
        { status: 500 }
      );
    }
    
    // Initialize the API
    const initialized = clickUpApi.initialize(apiToken);
    
    if (!initialized) {
      return NextResponse.json(
        { error: 'Failed to initialize ClickUp API' },
        { status: 500 }
      );
    }
    
    // Get authenticated user
    const user = await clickUpApi.getAuthenticatedUser();
    
    // Get available workspaces
    const workspaces = await clickUpApi.getWorkspaces();
    
    // Return the data
    return NextResponse.json({
      user,
      workspaces
    });
  } catch (error: any) {
    console.error('Error in ClickUp API route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Handler for POST requests to /api/clickup
 * Example of retrieving spaces for a specific workspace
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { workspaceId } = body;
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }
    
    // Initialize the ClickUp API client with token from environment variable
    const apiToken = process.env.CLICKUP_API_TOKEN;
    
    if (!apiToken) {
      return NextResponse.json(
        { error: 'ClickUp API token not configured' },
        { status: 500 }
      );
    }
    
    // Initialize the API
    const initialized = clickUpApi.initialize(apiToken);
    
    if (!initialized) {
      return NextResponse.json(
        { error: 'Failed to initialize ClickUp API' },
        { status: 500 }
      );
    }
    
    // Get spaces for the specified workspace
    const spaces = await clickUpApi.getSpaces(workspaceId);
    
    // Return the spaces
    return NextResponse.json({
      workspaceId,
      spaces
    });
  } catch (error: any) {
    console.error('Error in ClickUp API route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 