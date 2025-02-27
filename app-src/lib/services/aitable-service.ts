import axios, { AxiosInstance } from 'axios';
import config from '../config';

/**
 * AITable Service
 * A service layer for interacting with AITable API through our server-side endpoints
 */
export class AITableService {
  private static instance: AITableService;
  private client: AxiosInstance;
  
  /**
   * Constructor
   */
  private constructor() {
    this.client = axios.create({
      baseURL: '/api/aitable',
    });
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): AITableService {
    if (!AITableService.instance) {
      AITableService.instance = new AITableService();
    }
    return AITableService.instance;
  }

  /**
   * Make a request to our server-side AITable API endpoint
   */
  private async makeRequest(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, options: { params?: any; data?: any } = {}) {
    const response = await this.client.request({
      method,
      url: path,
      params: options.params,
      data: options.data
    });
    return response.data.data;
  }

  /**
   * Get all spaces
   */
  async getAllSpaces() {
    try {
      const response = await this.client.get('/spaces');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching spaces:', error);
      return [];
    }
  }

  /**
   * Get all nodes in a space
   */
  async getAllNodes(spaceId: string) {
    try {
      const response = await this.client.get(`/spaces/${spaceId}/nodes`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching nodes:', error);
      return [];
    }
  }

  /**
   * Get all datasheets in a space
   */
  async getAllDatasheets(spaceId: string) {
    try {
      const response = await this.client.get(`/spaces/${spaceId}/datasheets`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching datasheets:', error);
      return [];
    }
  }

  /**
   * Get fields for a datasheet
   */
  async getFields(datasheetId: string, viewId?: string) {
    try {
      const params: any = {};
      if (viewId) params.viewId = viewId;
      
      const response = await this.client.get(`/datasheets/${datasheetId}/fields`, { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching fields:', error);
      return [];
    }
  }

  /**
   * Get views from a datasheet
   */
  async getViews(datasheetId: string) {
    try {
      const response = await this.client.get(`/datasheets/${datasheetId}/views`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching views:', error);
      return [];
    }
  }

  /**
   * Get all records from a datasheet
   */
  async getAllRecords(datasheetId: string, options?: { 
    viewId?: string; 
    fieldKey?: 'name' | 'id'; 
    pageSize?: number;
  }) {
    try {
      const response = await this.client.get(`/datasheets/${datasheetId}/records`, { 
        params: options 
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching records:', error);
      return [];
    }
  }

  /**
   * Get records from a datasheet
   */
  async getRecords(datasheetId: string, options?: { 
    viewId?: string; 
    fieldKey?: 'name' | 'id'; 
    pageSize?: number; 
    pageToken?: string;
  }) {
    return this.makeRequest('GET', `/datasheets/${datasheetId}/records`, { params: options });
  }

  /**
   * Create a new datasheet
   */
  async createDatasheet(
    name: string,
    parentId?: string,
    options?: { description?: string; icon?: string },
    spaceId?: string
  ) {
    const targetSpaceId = spaceId || config.aitable.defaultSpaceId;
    if (!targetSpaceId) {
      throw new Error('Space ID is required');
    }
    return this.makeRequest('POST', `/spaces/${targetSpaceId}/datasheets`, {
      data: {
        name,
        parentId,
        ...options
      }
    });
  }

  /**
   * Get nodes with specific permissions
   */
  async getNodesWithPermissions(permissions: number[] = [0, 1, 2], type?: string, spaceId?: string) {
    const targetSpaceId = spaceId || config.aitable.defaultSpaceId;
    if (!targetSpaceId) {
      throw new Error('Space ID is required');
    }
    return this.makeRequest('GET', `/spaces/${targetSpaceId}/nodes`, {
      params: {
        permissions,
        type
      }
    });
  }

  // Add other methods as needed...
} 