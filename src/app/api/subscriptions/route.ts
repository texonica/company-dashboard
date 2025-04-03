import { NextResponse } from 'next/server';
import { AITABLE_CONFIG, fetchTableRecords, fetchRecord, fetchClientsByIds, fetchProjectsByIds, AITableSubscription, AITableClient } from '@/lib/api/aitable';

// Type guard to check if a value is a string record ID
function isRecordId(value: any): value is string {
  if (typeof value !== 'string') return false;
  return /^rec[a-zA-Z0-9]{8,}$/.test(value);
}

// Type for relation field which could be a string, array, or other value
type RelationFieldType = string | string[] | any;

export async function GET(request: Request) {
  try {
    // Check if environment variables are properly configured
    if (!process.env.AITABLE_API_TOKEN || !process.env.AITABLE_BASE_ID || !process.env.AITABLE_SUBSCRIPTIONS_TABLE_ID) {
      console.error('Missing required environment variables for AITable API');
      return NextResponse.json(
        { error: 'Server configuration error: AITable API credentials missing or Subscriptions table not configured' },
        { status: 500 }
      );
    }

    // Get subscription ID from query params if present
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');
    const clientId = searchParams.get('clientId');

    try {
      if (subscriptionId) {
        // If specific subscription ID was requested
        const record = await fetchRecord(AITABLE_CONFIG.SUBSCRIPTIONS_TABLE_ID as string, subscriptionId);
        
        if (!record) {
          return NextResponse.json(
            { error: `Subscription with ID ${subscriptionId} not found` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          id: record.recordId,
          name: record.fields.Name || '[No Name]',
          fields: record.fields
        });
      } else {
        // No specific subscription requested, return all subscriptions or filter by client
        let filter = '';
        if (clientId) {
          filter = `FIND("${clientId}", Client)`;
        }
        
        const records = await fetchTableRecords(AITABLE_CONFIG.SUBSCRIPTIONS_TABLE_ID as string, filter);
        
        // Collect client and project IDs
        const clientIds: string[] = [];
        const projectIds: string[] = [];
        
        records.forEach(record => {
          // Collect client IDs
          const client: RelationFieldType = record.fields?.Client;
          if (isRecordId(client)) {
            clientIds.push(client);
          } else if (Array.isArray(client) && client.length > 0) {
            client.forEach((item: any) => {
              if (isRecordId(item)) {
                clientIds.push(item);
              }
            });
          }
          
          // Collect project IDs
          const projects: RelationFieldType = record.fields?.Projects;
          if (isRecordId(projects)) {
            projectIds.push(projects);
          } else if (Array.isArray(projects) && projects.length > 0) {
            projects.forEach((item: any) => {
              if (isRecordId(item)) {
                projectIds.push(item);
              }
            });
          }
        });
        
        // Get unique IDs (remove duplicates)
        const uniqueClientIds = [...new Set(clientIds)];
        const uniqueProjectIds = [...new Set(projectIds)];
        
        // Maps to store lookup data
        let clientsMap: Record<string, AITableClient> = {};
        let projectsMap: Record<string, any> = {};
        
        // Only attempt client lookup if clients table ID is configured
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
        
        // Fetch project data if we have project IDs
        if (process.env.AITABLE_PROJECTS_TABLE_ID && uniqueProjectIds.length > 0) {
          try {
            // Use the fetchProjectsByIds function instead of individual record lookups
            projectsMap = await fetchProjectsByIds(uniqueProjectIds);
            console.log(`Successfully fetched ${Object.keys(projectsMap).length} project records`);
          } catch (projectError) {
            console.error('Error in project data fetch:', projectError);
          }
        }
        
        const subscriptions = records.map(record => {
          // Process client data
          const clientField: RelationFieldType = record.fields?.Client;
          let clientInfo = {
            id: null as string | null,
            name: '-' as string
          };
          
          if (isRecordId(clientField)) {
            clientInfo.id = clientField;
            if (clientsMap[clientField] && clientsMap[clientField].fields.Name) {
              clientInfo.name = clientsMap[clientField].fields.Name;
            } else {
              clientInfo.name = clientField;
            }
          } else if (Array.isArray(clientField) && clientField.length > 0) {
            const firstItem = clientField[0];
            if (isRecordId(firstItem)) {
              clientInfo.id = firstItem;
              if (clientsMap[firstItem] && clientsMap[firstItem].fields.Name) {
                clientInfo.name = clientsMap[firstItem].fields.Name;
              } else {
                clientInfo.name = firstItem;
              }
            }
          }
          
          // Process projects data
          const projectsField: RelationFieldType = record.fields?.Projects;
          let projectsInfo = {
            count: 0,
            names: [] as string[],
            display: '-' as string
          };
          
          if (isRecordId(projectsField)) {
            projectsInfo.count = 1;
            if (projectsMap[projectsField]) {
              const projectName = projectsMap[projectsField].fields.Title || projectsMap[projectsField].fields.Name || projectsField;
              projectsInfo.names.push(projectName);
              projectsInfo.display = projectName;
            } else {
              projectsInfo.names.push(projectsField);
              projectsInfo.display = projectsField;
            }
          } else if (Array.isArray(projectsField) && projectsField.length > 0) {
            projectsInfo.count = projectsField.length;
            projectsInfo.display = `${projectsField.length} project(s)`;
            
            // Get the names of the first few projects (up to 5)
            const projectNames = projectsField
              .slice(0, 5)
              .map(id => {
                if (isRecordId(id) && projectsMap[id]) {
                  return projectsMap[id].fields.Title || projectsMap[id].fields.Name || id;
                }
                return isRecordId(id) ? id : String(id);
              });
            
            projectsInfo.names = projectNames;
            
            if (projectNames.length > 0) {
              projectsInfo.display = projectNames.join(', ');
              if (projectsField.length > 5) {
                projectsInfo.display += ` (+${projectsField.length - 5} more)`;
              }
            }
          }
          
          return {
            id: record.recordId,
            name: record.fields.Name || '[No Name]',
            client: clientInfo,
            projects: projectsInfo,
            startDate: record.fields.StartDate,
            endDate: record.fields.EndDate,
            status: record.fields.Status,
            amount: record.fields.Amount,
            billingCycle: record.fields.BillingCycle,
            fields: record.fields
          };
        });
        
        return NextResponse.json(subscriptions);
      }
    } catch (apiError) {
      // Handle specific API errors
      console.error('AITable API error:', apiError);
      
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      
      // Look for specific error codes to give more meaningful responses
      if (errorMessage.includes('404') || errorMessage.includes('Record not found')) {
        return NextResponse.json(
          { error: 'Subscription not found' },
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
    console.error('Error fetching subscriptions from AITable:', error);
    
    // Return the actual error
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions from AITable', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 