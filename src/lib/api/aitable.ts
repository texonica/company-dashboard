/**
 * AITable API client functions
 */

// Types for AITable data
export interface AITableProject {
  recordId: string;
  createdAt: number;
  updatedAt: number;
  fields: {
    Title?: string;
    RecordID?: string;
    Stage?: string;
    Name?: string;
    Client?: string;
    Budget?: number;
    StartDate?: string;
    ProjectManager?: string;
    Mediabuyer?: string | string[];
    team_lookup?: string;
    [key: string]: any;
  };
}

export interface AITableClient {
  recordId: string;
  fields: {
    Name?: string;
    [key: string]: any;
  };
}

export interface AITableSubscription {
  recordId: string;
  fields: {
    Name?: string;
    Client?: string; // Client ID or array of Client IDs
    StartDate?: string;
    EndDate?: string;
    Status?: string;
    Amount?: number;
    BillingCycle?: string;
    [key: string]: any;
  };
}

export interface AITablePayment {
  recordId: string;
  fields: {
    Name?: string;
    Client?: string; // Client ID or array of Client IDs
    Subscription?: string; // Subscription ID or array of Subscription IDs
    Date?: string;
    Amount?: number;
    Status?: string;
    PaymentMethod?: string;
    [key: string]: any;
  };
}

export interface AITableResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    total?: number;
    records: AITableProject[];
    [key: string]: any;
  } | null;
}

export interface AITableRecord {
  recordId: string;
  fields: Record<string, any>;
}

export interface AITableMember {
  recordId: string;
  fields: {
    Title?: string; // The member's name
    [key: string]: any;
  };
}

/**
 * AITable API configuration 
 */
export const AITABLE_CONFIG = {
  BASE_URL: 'https://aitable.ai',
  BASE_ID: process.env.AITABLE_BASE_ID,
  PROJECTS_TABLE_ID: process.env.AITABLE_PROJECTS_TABLE_ID,
  CLIENTS_TABLE_ID: process.env.AITABLE_CLIENTS_TABLE_ID,
  MEMBERS_TABLE_ID: process.env.AITABLE_MEMBERS_TABLE_ID,
  SUBSCRIPTIONS_TABLE_ID: process.env.AITABLE_SUBSCRIPTIONS_TABLE_ID,
  PAYMENTS_TABLE_ID: process.env.AITABLE_PAYMENTS_TABLE_ID,
}; 

// Function to validate configuration
function validateConfig() {
  if (!process.env.AITABLE_API_TOKEN) {
    throw new Error('Missing environment variable: AITABLE_API_TOKEN');
  }
  
  if (!AITABLE_CONFIG.BASE_ID) {
    throw new Error('Missing environment variable: AITABLE_BASE_ID');
  }
  
  if (!AITABLE_CONFIG.PROJECTS_TABLE_ID) {
    throw new Error('Missing environment variable: AITABLE_PROJECTS_TABLE_ID');
  }
}

/**
 * Fetch all records from a table with optional filter
 */
export async function fetchTableRecords(tableId: string, filter?: string): Promise<AITableProject[]> {
  // Validate configuration before making requests
  validateConfig();
  
  const API_TOKEN = process.env.AITABLE_API_TOKEN;
  const BASE_ID = AITABLE_CONFIG.BASE_ID;
  
  const filterParam = filter ? `?filterByFormula=${encodeURIComponent(filter)}` : '';
  const url = `${AITABLE_CONFIG.BASE_URL}/fusion/v1/datasheets/${tableId}/records${filterParam}`;
  
  console.log(`Fetching records from: ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`AITable API HTTP error (${response.status}):`, errorText);
    throw new Error(`AITable API error (${response.status}): ${errorText}`);
  }
  
  const result: AITableResponse = await response.json();
  
  // Check for API-level errors
  if (!result.success) {
    console.error('AITable API success=false response:', result);
    throw new Error(`AITable API error (${result.code}): ${result.message}`);
  }
  
  // Validate response data structure
  if (!result.data || !result.data.records || !Array.isArray(result.data.records)) {
    console.error('Invalid response format:', result);
    throw new Error('Invalid response format from AITable API');
  }
  
  return result.data.records;
}

/**
 * Fetch a single record by ID
 */
export async function fetchRecord(tableId: string, recordId: string): Promise<AITableRecord> {
  // Validate configuration
  validateConfig();
  
  const API_TOKEN = process.env.AITABLE_API_TOKEN;
  const BASE_ID = AITABLE_CONFIG.BASE_ID;
  
  const url = `${AITABLE_CONFIG.BASE_URL}/fusion/v1/datasheets/${tableId}/records/${recordId}`;
  
  console.log('Fetching record from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Record not found: ${recordId}`);
    }
    
    const errorText = await response.text();
    throw new Error(`AITable API error (${response.status}): ${errorText}`);
  }
  
  const result: AITableResponse = await response.json();
  
  // Check for API-level errors
  if (!result.success) {
    throw new Error(`AITable API error (${result.code}): ${result.message}`);
  }
  
  // Validate response data
  if (!result.data) {
    throw new Error('Invalid response format from AITable API');
  }
  
  return result.data as unknown as AITableRecord;
}

/**
 * Fetch space/base details
 */
export async function fetchSpaceDetails() {
  // Validate configuration
  validateConfig();
  
  const API_TOKEN = process.env.AITABLE_API_TOKEN;
  
  const url = `${AITABLE_CONFIG.BASE_URL}/fusion/v1/spaces/${AITABLE_CONFIG.BASE_ID}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AITable API error (${response.status}): ${errorText}`);
  }
  
  const result: AITableResponse = await response.json();
  
  // Check for API-level errors
  if (!result.success) {
    throw new Error(`AITable API error (${result.code}): ${result.message}`);
  }
  
  return result.data;
}

/**
 * Fetch tables in a space/base
 */
export async function fetchTables() {
  // Validate configuration
  validateConfig();
  
  const API_TOKEN = process.env.AITABLE_API_TOKEN;
  
  const url = `${AITABLE_CONFIG.BASE_URL}/fusion/v1/spaces/${AITABLE_CONFIG.BASE_ID}/datasheets`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AITable API error (${response.status}): ${errorText}`);
  }
  
  const result: AITableResponse = await response.json();
  
  // Check for API-level errors
  if (!result.success) {
    throw new Error(`AITable API error (${result.code}): ${result.message}`);
  }
  
  return result.data;
}

/**
 * Fetch a client record by ID
 */
export async function fetchClient(clientId: string): Promise<AITableClient | null> {
  if (!AITABLE_CONFIG.CLIENTS_TABLE_ID) {
    console.warn('Missing AITABLE_CLIENTS_TABLE_ID environment variable');
    return null;
  }
  
  try {
    const record = await fetchRecord(AITABLE_CONFIG.CLIENTS_TABLE_ID, clientId);
    return {
      recordId: clientId,
      fields: record.fields
    };
  } catch (error) {
    console.error(`Error fetching client with ID ${clientId}:`, error);
    return null;
  }
}

/**
 * Fetch multiple client records by their IDs
 */
export async function fetchClientsByIds(clientIds: string[]): Promise<Record<string, AITableClient>> {
  if (!AITABLE_CONFIG.CLIENTS_TABLE_ID || !clientIds.length) {
    return {};
  }
  
  // Create a filter formula to get only the clients with the specified IDs
  // Example: OR(RECORD_ID()='rec123',RECORD_ID()='rec456')
  const filter = clientIds.map(id => `RECORD_ID()='${id}'`).join(',');
  const filterFormula = `OR(${filter})`;
  
  try {
    const records = await fetchTableRecords(AITABLE_CONFIG.CLIENTS_TABLE_ID, filterFormula);
    
    // Create a map of client IDs to client records
    return records.reduce((map, client) => {
      map[client.recordId] = {
        recordId: client.recordId,
        fields: client.fields
      };
      return map;
    }, {} as Record<string, AITableClient>);
  } catch (error) {
    console.error('Error fetching clients by IDs:', error);
    return {};
  }
}

/**
 * Fetch multiple project records by their IDs
 */
export async function fetchProjectsByIds(projectIds: string[]): Promise<Record<string, AITableProject>> {
  if (!AITABLE_CONFIG.PROJECTS_TABLE_ID || !projectIds.length) {
    return {};
  }
  
  // Create a filter formula to get only the projects with the specified IDs
  // Example: OR(RECORD_ID()='rec123',RECORD_ID()='rec456')
  const filter = projectIds.map(id => `RECORD_ID()='${id}'`).join(',');
  const filterFormula = `OR(${filter})`;
  
  try {
    const records = await fetchTableRecords(AITABLE_CONFIG.PROJECTS_TABLE_ID, filterFormula);
    
    // Create a map of project IDs to project records
    return records.reduce((map, project) => {
      map[project.recordId] = {
        recordId: project.recordId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        fields: project.fields
      };
      return map;
    }, {} as Record<string, AITableProject>);
  } catch (error) {
    console.error('Error fetching projects by IDs:', error);
    return {};
  }
}

/**
 * Fetch member records by IDs
 */
export async function fetchMembersByIds(memberIds: string[]): Promise<Record<string, AITableMember>> {
  if (!AITABLE_CONFIG.MEMBERS_TABLE_ID) {
    console.warn('Missing AITABLE_MEMBERS_TABLE_ID environment variable');
    return {};
  }
  
  // If no IDs to fetch, return empty object
  if (memberIds.length === 0) {
    return {};
  }
  
  // Create a map to store the results
  const members: Record<string, AITableMember> = {};
  
  try {
    // Create filter formula to get all records in one request
    // We need to escape single quotes in our OR() function
    const filter = memberIds.length === 1 
      ? `RECORD_ID()='${memberIds[0]}'` 
      : `OR(${memberIds.map(id => `RECORD_ID()='${id}'`).join(',')})`;
      
    const membersTableId = AITABLE_CONFIG.MEMBERS_TABLE_ID;
    const records = await fetchTableRecords(membersTableId, filter);
    
    // Map records by ID
    records.forEach(record => {
      members[record.recordId] = {
        recordId: record.recordId,
        fields: record.fields
      };
    });
    
    return members;
  } catch (error) {
    console.error('Error fetching members by IDs:', error);
    return members; // Return what we have
  }
}

/**
 * Update a record by ID
 */
export async function updateRecord(tableId: string, recordId: string, data: { fields: Record<string, any> }): Promise<AITableRecord> {
  // Validate configuration
  validateConfig();
  
  const API_TOKEN = process.env.AITABLE_API_TOKEN;
  
  // Ensure we're working with the fields object
  const fields = data.fields;
  
  // Log the update for debugging
  console.log(`AITable Update: tableId=${tableId}, recordId=${recordId}`);
  console.log('Update fields:', fields);
  
  // Use the correct URL format for updates according to documentation
  const url = `${AITABLE_CONFIG.BASE_URL}/fusion/v1/datasheets/${tableId}/records`;
  
  console.log('Request URL:', url);
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      records: [
        {
          recordId: recordId,
          fields: fields
        }
      ]
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`AITable API error (${response.status}):`, errorText);
    throw new Error(`AITable API error (${response.status}): ${errorText}`);
  }
  
  const result: AITableResponse = await response.json();
  
  // Check for API-level errors
  if (!result.success) {
    console.error(`AITable API error (${result.code}):`, result.message);
    throw new Error(`AITable API error (${result.code}): ${result.message}`);
  }
  
  // Validate response data
  if (!result.data) {
    throw new Error('Invalid response format from AITable API');
  }
  
  // Access the first record in the records array since we're only updating one
  return result.data.records?.[0] || result.data as unknown as AITableRecord;
} 