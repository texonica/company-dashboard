/**
 * AITable API Types
 */

// Base AITable resource interfaces
export interface AITableBase {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AITableSpace extends AITableBase {
  description?: string;
}

export interface AITableDatasheet extends AITableBase {
  spaceId: string;
  description?: string;
  revision: number;
}

export interface AITableView extends AITableBase {
  type: 'grid' | 'kanban' | 'gallery' | 'gantt' | 'calendar';
  filter?: AITableFilter;
  sort?: AITableSort[];
}

// Record and Field types
export interface AITableRecord {
  recordId: string;
  fields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type AITableFieldType = 
  | 'SingleText'
  | 'Text'
  | 'Number'
  | 'Currency'
  | 'Percent'
  | 'SingleSelect'
  | 'MultiSelect'
  | 'DateTime'
  | 'Attachment'
  | 'Link'
  | 'URL'
  | 'Email'
  | 'Phone'
  | 'Checkbox'
  | 'Rating'
  | 'Formula'
  | 'LookUp'
  | 'CreatedTime'
  | 'LastModifiedTime'
  | 'CreatedBy'
  | 'LastModifiedBy'
  | 'AutoNumber';

export interface AITableField {
  id: string;
  name: string;
  type: AITableFieldType;
  property?: any; // This can be different based on field type
}

// Filter and Sort types
export interface AITableFilter {
  conjunction: 'and' | 'or';
  conditions: AITableFilterCondition[];
}

export interface AITableFilterCondition {
  fieldId: string;
  operatorType: 
    | 'equal' 
    | 'notEqual'
    | 'contains'
    | 'doesNotContain'
    | 'isEmpty'
    | 'isNotEmpty'
    | 'greaterThan'
    | 'greaterThanOrEqual'
    | 'lessThan'
    | 'lessThanOrEqual'
    | 'isTrue'
    | 'isFalse';
  value?: any;
}

export interface AITableSort {
  fieldId: string;
  order: 'asc' | 'desc';
}

// API Response types
export interface AITableListResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    records: T[];
    pageNum: number;
    pageSize: number;
  };
}

export interface AITableSingleResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

// Query parameters for records
export interface GetRecordsParams {
  viewId?: string;
  pageNum?: number;
  pageSize?: number;
  sort?: AITableSort[];
  filterByFormula?: string;
  maxRecords?: number;
  fieldKey?: 'name' | 'id';
  fields?: string[];
}

// Create/Update operations
export interface CreateRecordRequest {
  fields: Record<string, any>;
}

export interface UpdateRecordRequest {
  fields: Record<string, any>;
}

// Core datasheet types - only include fields that are actually used in the application
export interface Project extends AITableRecord {
  fields: {
    Name?: string;
    Client?: string[]; // Link to Clients
    Status?: string;
    StartDate?: string;
    EndDate?: string;
    Subscriptions?: string[]; // Link to Subscriptions
    Payments?: string[]; // Link to Payments
    // Add other fields as needed for specific features
  };
}

export interface Client extends AITableRecord {
  fields: {
    Name?: string;
    Projects?: string[]; // Link to Projects
    Subscriptions?: string[]; // Link to Subscriptions
    Payments?: string[]; // Link to Payments
    // Add other fields as needed for specific features
  };
}

export interface Payment extends AITableRecord {
  fields: {
    Value?: number;
    Month?: string;
    Date?: string;
    Year?: string;
    Client?: string[];
    Project?: string[];
    // Add other fields as needed for specific features
  };
}

export interface Subscription extends AITableRecord {
  fields: {
    Client?: string[];
    Project?: string[];
    StartDate?: string;
    EndDate?: string;
    Value?: number;
    Currency?: string;
    Status?: string;
    // Add other fields as needed for specific features
  };
}

// Finance type used in dashboard summary (for backward compatibility)
export type Finance = Payment;

// User roles for the application
export type UserRole = 'CEO' | 'CFO' | 'SalesManager' | 'PM';

export interface User {
  username: string;
  role: UserRole;
} 