/**
 * AITable API Service
 * Handles all interactions with the AITable API
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { createLogger } from '../logger';
import {
  AITableDatasheet,
  AITableField,
  AITableListResponse,
  AITableRecord,
  AITableSingleResponse,
  AITableSpace,
  AITableView,
  CreateRecordRequest,
  GetRecordsParams,
  UpdateRecordRequest,
} from '@/types/aitable';
import { TEXONICA_SPACE_ID } from '../constants';
import fs from 'fs';
import path from 'path';

const logger = createLogger('aitable-api');

// AITable API base URL
const API_BASE_URL = 'https://api.aitable.ai/fusion/v1';

// Default space ID from environment variables or constants
const DEFAULT_SPACE_ID = process.env.AITABLE_DEFAULT_SPACE_ID || TEXONICA_SPACE_ID;

// Check if mock data should be used
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

class AITableAPI {
  private client: AxiosInstance;
  private token: string;
  private spaceId: string;
  private useMockData: boolean;
  private mockDataPath: string;

  constructor(token = process.env.AITABLE_API_TOKEN, spaceId = DEFAULT_SPACE_ID) {
    this.token = token || '';
    this.spaceId = spaceId || '';
    this.useMockData = USE_MOCK_DATA;
    this.mockDataPath = path.join(process.cwd(), 'mock-data');

    if (!this.token && !this.useMockData) {
      logger.error('No AITable API token provided and mock data is not enabled');
      throw new Error('AITable API token is required when not using mock data');
    }

    if (!this.spaceId) {
      logger.warn('No default space ID provided');
    }

    if (this.useMockData) {
      logger.info('Using mock data instead of AITable API');
    }

    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('Request error', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Response: ${response.status} ${response.config.url}`, {
          data: response.data,
        });
        return response;
      },
      (error: AxiosError) => {
        logger.error(`API Error: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );

    logger.info('AITable API client initialized', { 
      spaceId: this.spaceId,
      useMockData: this.useMockData 
    });
  }

  // Helper method to get mock data for a datasheet
  private getMockData<T>(datasheetId: string): Promise<AITableListResponse<T>> {
    try {
      // Map datasheet ID to mock file name
      const datasheetMap: Record<string, string> = {
        'dstq4onAEtjMleaeCm': 'projects',
        'dstoHuLq5fWmzRZvna': 'clients',
        'dst6yHG1gcUHquvMD0': 'payments',
        'dst93iSE1ToDG39AUY': 'subscriptions'
      };
      
      const fileName = datasheetMap[datasheetId] || datasheetId;
      const filePath = path.join(this.mockDataPath, `${fileName}.json`);
      
      if (!fs.existsSync(filePath)) {
        logger.error(`Mock data file not found for datasheet: ${datasheetId}`, { filePath });
        throw new Error(`No mock data available for datasheet: ${datasheetId}`);
      }
      
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      logger.debug(`Loaded mock data for ${datasheetId}`, { recordCount: data.data.records.length });
      
      return Promise.resolve(data as AITableListResponse<T>);
    } catch (error) {
      logger.error(`Error loading mock data for datasheet: ${datasheetId}`, error);
      throw error;
    }
  }

  /**
   * Get a list of spaces
   */
  async getSpaces(): Promise<AITableSpace[]> {
    logger.info('Fetching spaces');
    logger.time('getSpaces');
    
    try {
      const response = await this.client.get<AITableSingleResponse<{ spaces: AITableSpace[] }>>('/spaces');
      logger.timeEnd('getSpaces');
      return response.data.data.spaces;
    } catch (error) {
      logger.error('Failed to fetch spaces', error);
      throw error;
    }
  }

  /**
   * Get all datasheets in a space
   */
  async getDatasheets(spaceId = this.spaceId): Promise<AITableDatasheet[]> {
    logger.info(`Fetching datasheets for space ${spaceId}`);
    logger.time('getDatasheets');
    
    try {
      const response = await this.client.get<AITableSingleResponse<{ datasheets: AITableDatasheet[] }>>(
        `/spaces/${spaceId}/datasheets`
      );
      logger.timeEnd('getDatasheets');
      return response.data.data.datasheets;
    } catch (error) {
      logger.error(`Failed to fetch datasheets for space ${spaceId}`, error);
      throw error;
    }
  }

  /**
   * Get a specific datasheet
   */
  async getDatasheet(datasheetId: string): Promise<AITableDatasheet> {
    logger.info(`Fetching datasheet ${datasheetId}`);
    logger.time(`getDatasheet-${datasheetId}`);
    
    try {
      const response = await this.client.get<AITableSingleResponse<AITableDatasheet>>(
        `/spaces/${this.spaceId}/nodes/${datasheetId}`
      );
      logger.timeEnd(`getDatasheet-${datasheetId}`);
      return response.data.data;
    } catch (error) {
      logger.error(`Failed to fetch datasheet ${datasheetId}`, error);
      throw error;
    }
  }

  /**
   * Get all views of a datasheet
   */
  async getViews(datasheetId: string): Promise<AITableView[]> {
    logger.info(`Fetching views for datasheet ${datasheetId}`);
    logger.time(`getViews-${datasheetId}`);
    
    try {
      const response = await this.client.get<AITableSingleResponse<{ views: AITableView[] }>>(
        `/spaces/${this.spaceId}/nodes/${datasheetId}/views`
      );
      logger.timeEnd(`getViews-${datasheetId}`);
      return response.data.data.views;
    } catch (error) {
      logger.error(`Failed to fetch views for datasheet ${datasheetId}`, error);
      throw error;
    }
  }

  /**
   * Get all fields of a datasheet
   */
  async getFields(datasheetId: string): Promise<AITableField[]> {
    logger.info(`Fetching fields for datasheet ${datasheetId}`);
    logger.time(`getFields-${datasheetId}`);
    
    try {
      const response = await this.client.get<AITableSingleResponse<{ fields: AITableField[] }>>(
        `/spaces/${this.spaceId}/nodes/${datasheetId}/fields`
      );
      logger.timeEnd(`getFields-${datasheetId}`);
      return response.data.data.fields;
    } catch (error) {
      logger.error(`Failed to fetch fields for datasheet ${datasheetId}`, error);
      throw error;
    }
  }

  /**
   * Get records from a datasheet with pagination and filtering options
   */
  async getRecords<T>(datasheetId: string, params: GetRecordsParams = {}): Promise<AITableListResponse<T>> {
    const label = `[aitable-api] getRecords-${datasheetId}`;
    console.time(label);
    
    try {
      // If using mock data, return from local files
      if (this.useMockData) {
        console.timeEnd(label);
        return await this.getMockData<T>(datasheetId);
      }
      
      const response = await this.client.get<AITableListResponse<T>>(
        `/spaces/${this.spaceId}/nodes/${datasheetId}/records`,
        { params }
      );
      console.timeEnd(label);
      return response.data;
    } catch (error) {
      console.timeEnd(label);
      logger.error(`Failed to fetch records for datasheet ${datasheetId}`, error);
      
      // If API request fails, try to use mock data as fallback
      if (!this.useMockData) {
        logger.warn(`Attempting to use mock data as fallback for datasheet ${datasheetId}`);
        try {
          return await this.getMockData<T>(datasheetId);
        } catch (mockError) {
          logger.error(`Failed to load mock data as fallback`, mockError);
          throw error; // Throw the original error if mock fallback fails
        }
      }
      
      throw error;
    }
  }

  /**
   * Create a new record in a datasheet
   */
  async createRecord<T extends AITableRecord = AITableRecord>(
    datasheetId: string,
    data: CreateRecordRequest
  ): Promise<T> {
    logger.info(`Creating record in datasheet ${datasheetId}`, data);
    logger.time(`createRecord-${datasheetId}`);
    
    try {
      const response = await this.client.post<AITableSingleResponse<T>>(
        `/spaces/${this.spaceId}/nodes/${datasheetId}/records`,
        data
      );
      logger.timeEnd(`createRecord-${datasheetId}`);
      return response.data.data;
    } catch (error) {
      logger.error(`Failed to create record in datasheet ${datasheetId}`, error);
      throw error;
    }
  }

  /**
   * Update an existing record in a datasheet
   */
  async updateRecord<T extends AITableRecord = AITableRecord>(
    datasheetId: string,
    recordId: string,
    data: UpdateRecordRequest
  ): Promise<T> {
    logger.info(`Updating record ${recordId} in datasheet ${datasheetId}`, data);
    logger.time(`updateRecord-${datasheetId}-${recordId}`);
    
    try {
      const response = await this.client.patch<AITableSingleResponse<T>>(
        `/spaces/${this.spaceId}/nodes/${datasheetId}/records/${recordId}`,
        data
      );
      logger.timeEnd(`updateRecord-${datasheetId}-${recordId}`);
      return response.data.data;
    } catch (error) {
      logger.error(`Failed to update record ${recordId} in datasheet ${datasheetId}`, error);
      throw error;
    }
  }

  /**
   * Delete a record from a datasheet
   */
  async deleteRecord(datasheetId: string, recordId: string): Promise<void> {
    logger.info(`Deleting record ${recordId} from datasheet ${datasheetId}`);
    logger.time(`deleteRecord-${datasheetId}-${recordId}`);
    
    try {
      await this.client.delete(`/spaces/${this.spaceId}/nodes/${datasheetId}/records/${recordId}`);
      logger.timeEnd(`deleteRecord-${datasheetId}-${recordId}`);
    } catch (error) {
      logger.error(`Failed to delete record ${recordId} from datasheet ${datasheetId}`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const aitable = new AITableAPI();

// Export the class for testing or custom instances
export default AITableAPI; 