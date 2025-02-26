import { AITableClient } from '../api/aitable-client';
import config from '../config';

/**
 * AITable Service
 * A service layer for interacting with AITable API
 */
export class AITableService {
  private client: AITableClient;
  private static instance: AITableService;
  
  /**
   * Constructor
   * @param apiToken - AITable API token
   */
  private constructor(apiToken: string) {
    this.client = new AITableClient(apiToken);
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): AITableService {
    if (!AITableService.instance) {
      AITableService.instance = new AITableService(config.aitable.apiToken);
    }
    return AITableService.instance;
  }
  
  /**
   * Get all spaces
   */
  async getAllSpaces() {
    return this.client.getSpaces();
  }
  
  /**
   * Get all nodes in a space
   * @param spaceId - Space ID (optional, uses default if not provided)
   */
  async getAllNodes(spaceId?: string) {
    const targetSpaceId = spaceId || config.aitable.defaultSpaceId;
    if (!targetSpaceId) {
      throw new Error('Space ID is required');
    }
    return this.client.getNodes(targetSpaceId);
  }
  
  /**
   * Get all datasheets in a space
   * @param spaceId - Space ID (optional, uses default if not provided)
   */
  async getAllDatasheets(spaceId?: string) {
    const nodes = await this.getAllNodes(spaceId);
    return nodes.filter(node => node.type === 'Datasheet');
  }
  
  /**
   * Search for nodes in a space
   * @param keyword - Search keyword
   * @param type - Node type filter (optional)
   * @param spaceId - Space ID (optional, uses default if not provided)
   */
  async searchNodes(keyword: string, type?: string, spaceId?: string) {
    const targetSpaceId = spaceId || config.aitable.defaultSpaceId;
    if (!targetSpaceId) {
      throw new Error('Space ID is required');
    }
    return this.client.searchNodes(targetSpaceId, keyword, type);
  }
  
  /**
   * Get records from a datasheet
   * @param datasheetId - Datasheet ID
   * @param options - Additional options
   */
  async getRecords(
    datasheetId: string, 
    options?: { 
      viewId?: string; 
      fieldKey?: 'name' | 'id'; 
      pageSize?: number; 
      pageToken?: string;
    }
  ) {
    return this.client.getRecords(datasheetId, options);
  }
  
  /**
   * Get all records from a datasheet (handles pagination)
   * @param datasheetId - Datasheet ID
   * @param options - Additional options
   */
  async getAllRecords(
    datasheetId: string, 
    options?: { 
      viewId?: string; 
      fieldKey?: 'name' | 'id'; 
    }
  ) {
    const allRecords = [];
    let pageToken: string | undefined;
    
    do {
      const response = await this.client.getRecords(datasheetId, {
        ...options,
        pageSize: 100,
        pageToken,
      });
      
      allRecords.push(...response.records);
      pageToken = response.pageToken;
    } while (pageToken);
    
    return allRecords;
  }
  
  /**
   * Create records in a datasheet
   * @param datasheetId - Datasheet ID
   * @param records - Records to create
   * @param fieldKey - Field key type (optional)
   */
  async createRecords(
    datasheetId: string, 
    records: { fields: { [key: string]: any } }[],
    fieldKey?: 'name' | 'id'
  ) {
    return this.client.createRecords(datasheetId, records, fieldKey);
  }
  
  /**
   * Update records in a datasheet
   * @param datasheetId - Datasheet ID
   * @param records - Records to update
   * @param fieldKey - Field key type (optional)
   */
  async updateRecords(
    datasheetId: string, 
    records: { recordId: string; fields: { [key: string]: any } }[],
    fieldKey?: 'name' | 'id'
  ) {
    return this.client.updateRecords(datasheetId, records, fieldKey);
  }
  
  /**
   * Delete records from a datasheet
   * @param datasheetId - Datasheet ID
   * @param recordIds - Record IDs to delete
   */
  async deleteRecords(datasheetId: string, recordIds: string[]) {
    return this.client.deleteRecords(datasheetId, recordIds);
  }
  
  /**
   * Get fields from a datasheet
   * @param datasheetId - Datasheet ID
   * @param viewId - View ID (optional)
   */
  async getFields(datasheetId: string, viewId?: string) {
    return this.client.getFields(datasheetId, viewId);
  }
  
  /**
   * Get views from a datasheet
   * @param datasheetId - Datasheet ID
   */
  async getViews(datasheetId: string) {
    return this.client.getViews(datasheetId);
  }
  
  /**
   * Create embedded links
   * @param nodeId - Node ID
   * @param embedLinks - Embedded links to create
   * @param spaceId - Space ID (optional, uses default if not provided)
   */
  async createEmbeddedLinks(
    nodeId: string, 
    embedLinks: { datasheetId: string; recordId: string }[],
    spaceId?: string
  ) {
    const targetSpaceId = spaceId || config.aitable.defaultSpaceId;
    if (!targetSpaceId) {
      throw new Error('Space ID is required');
    }
    return this.client.createEmbeddedLinks(targetSpaceId, nodeId, embedLinks);
  }
  
  /**
   * Get embedded links
   * @param nodeId - Node ID
   * @param spaceId - Space ID (optional, uses default if not provided)
   */
  async getEmbeddedLinks(nodeId: string, spaceId?: string) {
    const targetSpaceId = spaceId || config.aitable.defaultSpaceId;
    if (!targetSpaceId) {
      throw new Error('Space ID is required');
    }
    return this.client.getEmbeddedLinks(targetSpaceId, nodeId);
  }
  
  /**
   * Delete embedded links
   * @param nodeId - Node ID
   * @param embedLinkIds - Embedded link IDs to delete
   * @param spaceId - Space ID (optional, uses default if not provided)
   */
  async deleteEmbeddedLinks(nodeId: string, embedLinkIds: string[], spaceId?: string) {
    const targetSpaceId = spaceId || config.aitable.defaultSpaceId;
    if (!targetSpaceId) {
      throw new Error('Space ID is required');
    }
    return this.client.deleteEmbeddedLinks(targetSpaceId, nodeId, embedLinkIds);
  }
  
  /**
   * Get fields for a datasheet
   * @param datasheetId - Datasheet ID
   */
  async getDatasheetFields(datasheetId: string) {
    return this.client.getFields(datasheetId);
  }
} 