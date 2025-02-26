import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * AITable API response interface
 */
interface AITableResponse<T> {
  code: number;
  success: boolean;
  data: T;
  message: string;
}

/**
 * Space interface
 */
interface Space {
  id: string;
  name: string;
  role: string;
}

/**
 * Node interface
 */
interface Node {
  id: string;
  name: string;
  type: string;
  parentId: string;
  icon?: string;
}

/**
 * Record interface
 */
interface Record {
  recordId: string;
  fields: { [key: string]: any };
}

/**
 * Field interface
 */
interface Field {
  id: string;
  name: string;
  type: string;
  property: any;
}

/**
 * View interface
 */
interface View {
  id: string;
  name: string;
  type: string;
}

/**
 * Embedded Link interface
 */
interface EmbeddedLink {
  id: string;
  datasheetId: string;
  recordId: string;
}

/**
 * AITable API Client
 */
export class AITableClient {
  private client: AxiosInstance;
  private baseURL: string = 'https://aitable.ai/fusion/v1';
  
  /**
   * Constructor
   * @param apiToken - AITable API token
   */
  constructor(private apiToken: string) {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('AITable API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Get list of spaces
   */
  async getSpaces(): Promise<Space[]> {
    const response = await this.client.get<AITableResponse<{ spaces: Space[] }>>('/spaces');
    return response.data.data.spaces;
  }
  
  /**
   * Get list of nodes in a space
   * @param spaceId - Space ID
   */
  async getNodes(spaceId: string): Promise<Node[]> {
    const response = await this.client.get<AITableResponse<{ nodes: Node[] }>>(`/spaces/${spaceId}/nodes`);
    return response.data.data.nodes;
  }
  
  /**
   * Search nodes in a space
   * @param spaceId - Space ID
   * @param keyword - Search keyword
   * @param type - Node type filter (optional)
   */
  async searchNodes(spaceId: string, keyword: string, type?: string): Promise<Node[]> {
    const params: any = { keyword };
    if (type) params.type = type;
    
    const response = await this.client.get<AITableResponse<{ nodes: Node[] }>>(
      `/spaces/${spaceId}/nodes/search`,
      { params }
    );
    return response.data.data.nodes;
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
  ): Promise<{ records: Record[]; pageToken?: string; total?: number }> {
    const response = await this.client.get<AITableResponse<{ 
      records: Record[]; 
      pageToken?: string; 
      total?: number;
    }>>(
      `/datasheets/${datasheetId}/records`,
      { params: options }
    );
    return response.data.data;
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
  ): Promise<Record[]> {
    const params: any = {};
    if (fieldKey) params.fieldKey = fieldKey;
    
    const response = await this.client.post<AITableResponse<{ records: Record[] }>>(
      `/datasheets/${datasheetId}/records`,
      { records },
      { params }
    );
    return response.data.data.records;
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
  ): Promise<Record[]> {
    const params: any = {};
    if (fieldKey) params.fieldKey = fieldKey;
    
    const response = await this.client.patch<AITableResponse<{ records: Record[] }>>(
      `/datasheets/${datasheetId}/records`,
      { records },
      { params }
    );
    return response.data.data.records;
  }
  
  /**
   * Delete records from a datasheet
   * @param datasheetId - Datasheet ID
   * @param recordIds - Record IDs to delete
   */
  async deleteRecords(datasheetId: string, recordIds: string[]): Promise<void> {
    await this.client.delete<AITableResponse<{}>>(
      `/datasheets/${datasheetId}/records`,
      { data: { recordIds } }
    );
  }
  
  /**
   * Get fields for a datasheet
   * @param datasheetId - Datasheet ID
   */
  async getFields(datasheetId: string) {
    const response = await this.client.get<AITableResponse<{ fields: any[] }>>(`/datasheets/${datasheetId}/fields`);
    return response.data.data.fields;
  }
  
  /**
   * Get views from a datasheet
   * @param datasheetId - Datasheet ID
   */
  async getViews(datasheetId: string): Promise<View[]> {
    const response = await this.client.get<AITableResponse<{ views: View[] }>>(
      `/datasheets/${datasheetId}/views`
    );
    return response.data.data.views;
  }
  
  /**
   * Create embedded links
   * @param spaceId - Space ID
   * @param nodeId - Node ID
   * @param embedLinks - Embedded links to create
   */
  async createEmbeddedLinks(
    spaceId: string, 
    nodeId: string, 
    embedLinks: { datasheetId: string; recordId: string }[]
  ): Promise<EmbeddedLink[]> {
    const response = await this.client.post<AITableResponse<{ embedLinks: EmbeddedLink[] }>>(
      `/spaces/${spaceId}/nodes/${nodeId}/embedlinks`,
      { embedLinks }
    );
    return response.data.data.embedLinks;
  }
  
  /**
   * Get embedded links
   * @param spaceId - Space ID
   * @param nodeId - Node ID
   */
  async getEmbeddedLinks(spaceId: string, nodeId: string): Promise<EmbeddedLink[]> {
    const response = await this.client.get<AITableResponse<{ embedLinks: EmbeddedLink[] }>>(
      `/spaces/${spaceId}/nodes/${nodeId}/embedlinks`
    );
    return response.data.data.embedLinks;
  }
  
  /**
   * Delete embedded links
   * @param spaceId - Space ID
   * @param nodeId - Node ID
   * @param embedLinkIds - Embedded link IDs to delete
   */
  async deleteEmbeddedLinks(spaceId: string, nodeId: string, embedLinkIds: string[]): Promise<void> {
    await this.client.delete<AITableResponse<{}>>(
      `/spaces/${spaceId}/nodes/${nodeId}/embedlinks`,
      { data: { embedLinkIds } }
    );
  }
} 