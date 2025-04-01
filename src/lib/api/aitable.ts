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

/**
 * AITable API configuration 
 */
export const AITABLE_CONFIG = {
  BASE_URL: 'https://aitable.ai',
  BASE_ID: process.env.AITABLE_BASE_ID,
  PROJECTS_TABLE_ID: process.env.AITABLE_PROJECTS_TABLE_ID,
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
  
  const url = `${AITABLE_CONFIG.BASE_URL}/fusion/v1/datasheets/${tableId}/records/${recordId}`;
  
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