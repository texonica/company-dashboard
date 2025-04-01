/**
 * AITable API client
 */

// Types for AITable data
export interface AITableProject {
  id: string;
  fields: {
    Title: string;
    RecordID?: string;
    Stage?: string;
    [key: string]: any;
  };
}

export interface AITableResponse {
  records: AITableProject[];
}

/**
 * AITable API configuration 
 * In a production app, these would be environment variables
 */
export const AITABLE_CONFIG = {
  // Using the correct AITable API URL structure from documentation
  BASE_URL: 'https://aitable.ai',
  BASE_ID: 'spc12q5HY4ay5', // Texonica base
  PROJECTS_TABLE_ID: 'dstq4onAEtjMleaeCm', // Projects table
}; 