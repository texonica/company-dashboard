import { NextResponse } from 'next/server';
import { AITABLE_CONFIG, fetchTableRecords, fetchRecord, fetchClientsByIds, fetchProjectsByIds, AITablePayment, AITableClient } from '@/lib/api/aitable';

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
    if (!process.env.AITABLE_API_TOKEN || !process.env.AITABLE_BASE_ID || !process.env.AITABLE_PAYMENTS_TABLE_ID) {
      console.error('Missing required environment variables for AITable API');
      return NextResponse.json(
        { error: 'Server configuration error: AITable API credentials missing or Payments table not configured' },
        { status: 500 }
      );
    }

    // Get payment ID from query params if present
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');
    const clientId = searchParams.get('clientId');
    const subscriptionId = searchParams.get('subscriptionId');
    const unmatched = searchParams.get('unmatched') === 'true';
    const paymentSource = searchParams.get('paymentSource');

    try {
      if (paymentId) {
        // If specific payment ID was requested
        const record = await fetchRecord(AITABLE_CONFIG.PAYMENTS_TABLE_ID as string, paymentId);
        
        if (!record) {
          return NextResponse.json(
            { error: `Payment with ID ${paymentId} not found` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          id: record.recordId,
          name: record.fields.Name || '[No Name]',
          fields: record.fields
        });
      } else {
        // No specific payment requested, return all payments or filter by client/subscription/unmatched
        let filter = '';
        const filters = [];
        
        if (clientId) {
          filters.push(`FIND("${clientId}", Client)`);
        }
        
        if (subscriptionId) {
          filters.push(`FIND("${subscriptionId}", Subscription)`);
        }
        
        if (unmatched) {
          filters.push('Client = ""');
        }
        
        if (paymentSource) {
          filters.push(`{PaymentSource} = "${paymentSource}"`);
        }
        
        if (filters.length > 0) {
          filter = filters.join(' AND ');
        }
        
        const records = await fetchTableRecords(AITABLE_CONFIG.PAYMENTS_TABLE_ID as string, filter);
        
        // Collect client, project, and subscription IDs
        const clientIds: string[] = [];
        const projectIds: string[] = [];
        const subscriptionIds: string[] = [];
        
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
          const project: RelationFieldType = record.fields?.Project;
          if (isRecordId(project)) {
            projectIds.push(project);
          } else if (Array.isArray(project) && project.length > 0) {
            project.forEach((item: any) => {
              if (isRecordId(item)) {
                projectIds.push(item);
              }
            });
          }
          
          // Collect subscription IDs
          const subscription: RelationFieldType = record.fields?.Subscription;
          if (isRecordId(subscription)) {
            subscriptionIds.push(subscription);
          } else if (Array.isArray(subscription) && subscription.length > 0) {
            subscription.forEach((item: any) => {
              if (isRecordId(item)) {
                subscriptionIds.push(item);
              }
            });
          }
        });
        
        // Get unique IDs (remove duplicates)
        const uniqueClientIds = [...new Set(clientIds)];
        const uniqueProjectIds = [...new Set(projectIds)];
        const uniqueSubscriptionIds = [...new Set(subscriptionIds)];
        
        // Maps to store lookup data
        let clientsMap: Record<string, AITableClient> = {};
        let projectsMap: Record<string, any> = {};
        let subscriptionsById: Record<string, any> = {};
        
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
            console.log(`Attempting to fetch ${uniqueProjectIds.length} project records`);
            
            // Use fetchProjectsByIds instead of individual calls
            projectsMap = await fetchProjectsByIds(uniqueProjectIds);
            
            // Log success/failure stats
            const successCount = Object.keys(projectsMap).length;
            const failureCount = uniqueProjectIds.length - successCount;
            
            console.log(`Successfully fetched ${successCount} project records${
              failureCount > 0 ? ` (${failureCount} records not found)` : ''
            }`);
          } catch (projectError) {
            console.error('Error in project data fetch:', projectError);
          }
        }
        
        // Get subscription data if we have subscription IDs
        if (subscriptionIds.length > 0 && process.env.AITABLE_SUBSCRIPTIONS_TABLE_ID) {
          console.log(`Attempting to fetch ${subscriptionIds.length} subscription records...`);
          
          try {
            // Create a filter formula to fetch all required subscriptions in one call
            const filter = subscriptionIds.map(id => `RECORD_ID()='${id}'`).join(',');
            const filterFormula = subscriptionIds.length === 1 ? filter : `OR(${filter})`;
            
            const subscriptionsData = await fetchTableRecords(
              process.env.AITABLE_SUBSCRIPTIONS_TABLE_ID,
              filterFormula
            );
            
            console.log(`Successfully fetched ${subscriptionsData.length} out of ${subscriptionIds.length} subscription records`);
            
            // Create a map of subscription records by ID
            subscriptionsById = Object.fromEntries(
              subscriptionsData.map(subscription => [
                subscription.recordId,
                {
                  id: subscription.recordId,
                  name: subscription.fields?.Name || subscription.recordId,
                  fields: subscription.fields
                }
              ])
            );
          } catch (error) {
            console.error('Error fetching subscription data:', error);
          }
        }
        
        const payments = records.map(record => {
          // Extract client, project, and subscription data
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
          
          // Process project data
          const projectField: RelationFieldType = record.fields?.Project;
          let projectInfo = {
            id: null as string | null,
            title: '-' as string
          };
          
          if (isRecordId(projectField)) {
            projectInfo.id = projectField;
            if (projectsMap[projectField]) {
              projectInfo.title = projectsMap[projectField].fields.Title || projectsMap[projectField].fields.Name || projectField;
            } else {
              projectInfo.title = projectField;
            }
          } else if (Array.isArray(projectField) && projectField.length > 0) {
            // Default value in case we can't find specific project titles
            projectInfo.title = `${projectField.length} project(s)`;
            
            // If we can get at least the first project's title, use it
            const firstItem = projectField[0];
            if (isRecordId(firstItem) && projectsMap[firstItem]) {
              projectInfo.id = firstItem;
              const firstProjectTitle = projectsMap[firstItem].fields.Title || 
                                      projectsMap[firstItem].fields.Name || 
                                      firstItem;
              
              if (projectField.length === 1) {
                // Just one project, use its title
                projectInfo.title = firstProjectTitle;
              } else {
                // Multiple projects, show first one with count of others
                projectInfo.title = `${firstProjectTitle} ${
                  projectField.length > 1 ? `(+${projectField.length - 1} more)` : ''
                }`;
              }
            }
          }
          
          // Process subscription data
          const subscriptionField: RelationFieldType = record.fields?.Subscription;
          let subscriptionInfo = {
            id: null as string | null,
            name: '-' as string
          };
          
          if (isRecordId(subscriptionField)) {
            subscriptionInfo.id = subscriptionField;
            if (subscriptionsById[subscriptionField]) {
              subscriptionInfo.name = subscriptionsById[subscriptionField].fields?.Title || subscriptionsById[subscriptionField].name || subscriptionField;
            } else {
              subscriptionInfo.name = subscriptionField;
            }
          } else if (Array.isArray(subscriptionField) && subscriptionField.length > 0) {
            const firstItem = subscriptionField[0];
            if (isRecordId(firstItem)) {
              subscriptionInfo.id = firstItem;
              if (subscriptionsById[firstItem]) {
                subscriptionInfo.name = subscriptionsById[firstItem].fields?.Title || subscriptionsById[firstItem].name || firstItem;
              } else {
                subscriptionInfo.name = firstItem;
              }
            }
          }
          
          return {
            id: record.recordId,
            name: record.fields.Name || '[No Name]',
            client: clientInfo,
            project: projectInfo,
            subscription: subscriptionInfo,
            date: record.fields.Date,
            amount: record.fields.Amount,
            status: record.fields.Status,
            paymentMethod: record.fields.PaymentMethod,
            fields: record.fields
          };
        });
        
        return NextResponse.json({
          payments: payments,
          total: payments.length
        });
      }
    } catch (apiError) {
      // Handle specific API errors
      console.error('AITable API error:', apiError);
      
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      
      // Look for specific error codes to give more meaningful responses
      if (errorMessage.includes('404') || errorMessage.includes('Record not found')) {
        return NextResponse.json(
          { error: 'Payment not found' },
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
    console.error('Error fetching payments from AITable:', error);
    
    // Return the actual error
    return NextResponse.json(
      { error: 'Failed to fetch payments from AITable', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 