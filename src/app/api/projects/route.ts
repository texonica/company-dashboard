import { NextResponse } from 'next/server';
import { AITABLE_CONFIG, fetchTableRecords, fetchClientsByIds, fetchMembersByIds, AITableClient, AITableMember } from '@/lib/api/aitable';

// Type guard to check if a value is a string record ID
function isRecordId(value: any): value is string {
  if (typeof value !== 'string') return false;
  return /^rec[a-zA-Z0-9]{8,}$/.test(value);
}

// Type for client field which could be a string, array, or other value
type ClientFieldType = string | string[] | any;

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

    // Check for clients table ID
    if (!process.env.AITABLE_CLIENTS_TABLE_ID || process.env.AITABLE_CLIENTS_TABLE_ID.includes('YourClientsTableIdHere')) {
      console.warn('Missing or invalid AITABLE_CLIENTS_TABLE_ID environment variable - client names cannot be resolved');
    }

    // Check for members table ID
    if (!process.env.AITABLE_MEMBERS_TABLE_ID || process.env.AITABLE_MEMBERS_TABLE_ID.includes('YourMembersTableIdHere')) {
      console.warn('Missing or invalid AITABLE_MEMBERS_TABLE_ID environment variable - media buyer names cannot be resolved');
    }

    // Log configuration for debugging
    console.log('API Config:', {
      baseId: process.env.AITABLE_BASE_ID,
      projectsTableId: process.env.AITABLE_PROJECTS_TABLE_ID,
      clientsTableId: process.env.AITABLE_CLIENTS_TABLE_ID || 'NOT CONFIGURED',
      tokenPrefix: process.env.AITABLE_API_TOKEN ? process.env.AITABLE_API_TOKEN.substring(0, 5) + '...' : 'missing'
    });

    // Use the filter to only get launched and onboarding projects
    const filter = 'OR(Stage="Launched",Stage="Onboarding")';
    
    try {
      // Use our client function which returns records directly
      const records = await fetchTableRecords(AITABLE_CONFIG.PROJECTS_TABLE_ID as string, filter);
      console.log(`Fetched ${records.length} project records`);
      
      // Debug log of the first few records to see the structure
      if (records.length > 0) {
        console.log('Sample record fields:', JSON.stringify(records[0].fields, null, 2));
      }
      
      let clientsMap: Record<string, AITableClient> = {};
      let membersMap: Record<string, AITableMember> = {};
      
      // Collect client IDs by looking for fields that look like AITable record IDs (rec...)
      const clientIds: string[] = [];
      const memberIds: string[] = [];
      
      records.forEach(record => {
        const client: ClientFieldType = record.fields?.Client;
        
        // Use the helper function to check if it's a valid record ID
        if (isRecordId(client)) {
          console.log(`Found client ID: ${client}`);
          clientIds.push(client);
        } else if (Array.isArray(client) && client.length > 0) {
          // Handle case where Client is an array of IDs
          client.forEach((item: any) => {
            if (isRecordId(item)) {
              console.log(`Found client ID (from array): ${item}`);
              clientIds.push(item);
            }
          });
        }
        
        // Handle media buyer IDs
        const mediaBuyer: ClientFieldType = record.fields?.Mediabuyer;
        
        // Use the helper function to check if it's a valid record ID
        if (isRecordId(mediaBuyer)) {
          console.log(`Found media buyer ID: ${mediaBuyer}`);
          memberIds.push(mediaBuyer);
        } else if (Array.isArray(mediaBuyer) && mediaBuyer.length > 0) {
          // Handle case where Mediabuyer is an array of IDs
          mediaBuyer.forEach((item: any) => {
            if (isRecordId(item)) {
              console.log(`Found media buyer ID (from array): ${item}`);
              memberIds.push(item);
            }
          });
        }
      });
      
      // Get unique IDs (remove duplicates)
      const uniqueClientIds = [...new Set(clientIds)];
      const uniqueMemberIds = [...new Set(memberIds)];
      
      console.log(`Found ${uniqueClientIds.length} unique client IDs to lookup: ${uniqueClientIds.join(', ')}`);
      console.log(`Found ${uniqueMemberIds.length} unique media buyer IDs to lookup: ${uniqueMemberIds.join(', ')}`);
      
      // Only attempt client lookup if we have the clients table ID and it's properly configured
      if (process.env.AITABLE_CLIENTS_TABLE_ID && 
          !process.env.AITABLE_CLIENTS_TABLE_ID.includes('YourClientsTableIdHere') && 
          uniqueClientIds.length > 0) {
        try {
          // Fetch client data
          clientsMap = await fetchClientsByIds(uniqueClientIds); 
          console.log(`Successfully fetched ${Object.keys(clientsMap).length} client records`);
        } catch (clientError) {
          console.error('Error fetching client data:', clientError);
          // Continue with empty clientsMap - we'll use fallback values
        }
      }
      
      // Only attempt media buyer lookup if we have the members table ID and it's properly configured
      if (process.env.AITABLE_MEMBERS_TABLE_ID && 
          !process.env.AITABLE_MEMBERS_TABLE_ID.includes('YourMembersTableIdHere') && 
          uniqueMemberIds.length > 0) {
        try {
          // Fetch media buyer data
          membersMap = await fetchMembersByIds(uniqueMemberIds); 
          console.log(`Successfully fetched ${Object.keys(membersMap).length} member records`);
        } catch (memberError) {
          console.error('Error fetching member data:', memberError);
          // Continue with empty membersMap - we'll use fallback values
        }
      }
        
      // Format the response for our frontend
      const projects = records.map((record) => {
        const clientId: ClientFieldType = record.fields?.Client;
        
        // Default to showing client ID if we have one
        let clientName = 'No Client';
        let clientIdForDisplay: string | null = null;
        
        // Handle different data types for Client field
        if (isRecordId(clientId)) {
          // Client is a single record ID
          clientIdForDisplay = clientId;
          if (clientsMap[clientId] && clientsMap[clientId].fields.Name) {
            clientName = clientsMap[clientId].fields.Name;
          } else {
            // If we have a client ID but no mapped name, show the ID as fallback
            clientName = clientId;
          }
        } else if (Array.isArray(clientId) && clientId.length > 0) {
          // Client is an array, check the first item
          const firstItem = clientId[0];
          if (isRecordId(firstItem)) {
            clientIdForDisplay = firstItem;
            if (clientsMap[firstItem] && clientsMap[firstItem].fields.Name) {
              clientName = clientsMap[firstItem].fields.Name;
            } else {
              // If we have a client ID but no mapped name, show the ID as fallback
              clientName = firstItem;
            }
          }
        }
        
        // Handle budget field which could be a string or number
        let budget = 'Not specified';
        if (record.fields?.Budget) {
          if (typeof record.fields.Budget === 'string') {
            budget = record.fields.Budget;
          } else if (typeof record.fields.Budget === 'number') {
            budget = `$${record.fields.Budget.toLocaleString()}`;
          }
        }
        
        // Handle media buyer field which could be a single ID or array of IDs
        let mediaBuyerName = 'Not assigned';
        const mediaBuyerId: ClientFieldType = record.fields?.Mediabuyer;
        
        if (isRecordId(mediaBuyerId)) {
          // Media buyer is a single record ID
          if (membersMap[mediaBuyerId] && membersMap[mediaBuyerId].fields.Title) {
            mediaBuyerName = membersMap[mediaBuyerId].fields.Title;
          } else {
            // If we have an ID but no mapped name, show the ID as fallback
            mediaBuyerName = mediaBuyerId;
          }
        } else if (Array.isArray(mediaBuyerId) && mediaBuyerId.length > 0) {
          // Media buyer is an array, check the first item
          const firstItem = mediaBuyerId[0];
          if (isRecordId(firstItem)) {
            if (membersMap[firstItem] && membersMap[firstItem].fields.Title) {
              mediaBuyerName = membersMap[firstItem].fields.Title;
            } else {
              // If we have an ID but no mapped name, show the ID as fallback
              mediaBuyerName = firstItem;
            }
          }
        }
            
        return {
          id: record.recordId,
          title: record.fields?.Title || record.fields?.Name || 'Untitled Project',
          stage: record.fields?.Stage || 'Unknown',
          client: clientName,
          clientId: clientIdForDisplay,
          budget: budget,
          startDate: record.fields?.StartDate || 'Not specified',
          mediaBuyer: mediaBuyerName,
          team: record.fields?.team_lookup || 'Unassigned'
        };
      });
  
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