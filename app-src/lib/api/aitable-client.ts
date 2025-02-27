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
export interface AITableNode {
  id: string;
  name: string;
  type: 'Folder' | 'Datasheet' | 'Form' | 'Dashboard';
  parentId?: string;
  icon?: string;
  permissions?: number[];
  children?: AITableNode[];
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
 * Create Datasheet request interface
 */
interface CreateDatasheetRequest {
  name: string;
  parentId?: string;
  description?: string;
  icon?: string;
}

/**
 * Create Datasheet response interface
 */
interface CreateDatasheetResponse {
  id: string;
  name: string;
  type: 'Datasheet';
  parentId?: string;
  icon?: string;
}

/**
 * Create Folder request interface
 */
interface CreateFolderRequest {
  name: string;
  parentId?: string;
  icon?: string;
}

/**
 * Create Folder response interface
 */
interface CreateFolderResponse {
  id: string;
  name: string;
  type: 'Folder';
  parentId?: string;
  icon?: string;
}

/**
 * Update Node request interface
 */
interface UpdateNodeRequest {
  name?: string;
  icon?: string;
  description?: string;
  parentId?: string;
}

/**
 * AITable API Client
 */
export class AITableClient {
  private client: AxiosInstance;
  private baseURL: string = 'https://aitable.ai/fusion/v1';
  private apiToken: string;
  
  /**
   * Constructor
   * @param apiToken - AITable API token
   */
  constructor(apiToken: string) {
    this.apiToken = apiToken;
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
   * Get list of nodes in a space or folder
   * @param spaceId - Space ID
   * @param folderId - Folder ID (optional)
   */
  async getNodes(spaceId: string, folderId?: string): Promise<AITableNode[]> {
    const endpoint = folderId 
      ? `/spaces/${spaceId}/folders/${folderId}/nodes`
      : `/spaces/${spaceId}/nodes`;
    
    const response = await this.client.get<AITableResponse<{ nodes: AITableNode[] }>>(endpoint);
    return response.data.data.nodes;
  }
  
  /**
   * Search nodes in a space
   * @param spaceId - Space ID
   * @param keyword - Search keyword
   * @param type - Node type filter (optional)
   */
  async searchNodes(spaceId: string, keyword: string, type?: string): Promise<AITableNode[]> {
    const params: any = { keyword };
    if (type) params.type = type;
    
    const response = await this.client.get<AITableResponse<{ nodes: AITableNode[] }>>(
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
   * @param viewId - View ID (optional)
   */
  async getFields(datasheetId: string, viewId?: string): Promise<Field[]> {
    const params: any = {};
    if (viewId) params.viewId = viewId;
    
    const response = await this.client.get<AITableResponse<{ fields: Field[] }>>(
      `/datasheets/${datasheetId}/fields`,
      { params }
    );
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
  
  /**
   * Get node details
   * @param params - Parameters for getting node details
   */
  async getNodeDetails(params: { spaceId: string; nodeId: string }): Promise<AITableNode> {
    const { spaceId, nodeId } = params;
    const response = await this.client.get<AITableResponse<{ node: AITableNode }>>(
      `/spaces/${spaceId}/nodes/${nodeId}`
    );
    return response.data.data.node;
  }
  
  /**
   * Create a new datasheet
   * @param spaceId - Space ID
   * @param data - Datasheet creation data
   */
  async createDatasheet(spaceId: string, data: CreateDatasheetRequest): Promise<CreateDatasheetResponse> {
    const response = await this.client.post<AITableResponse<{ node: CreateDatasheetResponse }>>(
      `/spaces/${spaceId}/datasheets`,
      data
    );
    return response.data.data.node;
  }
  
  /**
   * Get nodes with permissions
   * @param spaceId - Space ID
   * @param type - Node type filter (optional)
   * @param permissions - Permission levels to filter by (0 = readonly, 1 = edit, 2 = manage)
   */
  async getNodesWithPermissions(spaceId: string, type?: string, permissions: number[] = [0, 1, 2]): Promise<AITableNode[]> {
    const params: any = { permissions };
    if (type) params.type = type;
    
    const response = await this.client.get<AITableResponse<{ nodes: AITableNode[] }>>(
      `/spaces/${spaceId}/nodes`,
      { params }
    );
    return response.data.data.nodes;
  }

  /**
   * Create a new folder
   * @param spaceId - Space ID
   * @param data - Folder creation data
   */
  async createFolder(spaceId: string, data: CreateFolderRequest): Promise<CreateFolderResponse> {
    const response = await this.client.post<AITableResponse<{ node: CreateFolderResponse }>>(
      `/spaces/${spaceId}/folders`,
      data
    );
    return response.data.data.node;
  }

  /**
   * Update a node (folder or datasheet)
   * @param spaceId - Space ID
   * @param nodeId - Node ID
   * @param data - Update data
   */
  async updateNode(spaceId: string, nodeId: string, data: UpdateNodeRequest): Promise<AITableNode> {
    const response = await this.client.patch<AITableResponse<{ node: AITableNode }>>(
      `/spaces/${spaceId}/nodes/${nodeId}`,
      data
    );
    return response.data.data.node;
  }

  /**
   * Delete a node (folder or datasheet)
   * @param spaceId - Space ID
   * @param nodeId - Node ID
   */
  async deleteNode(spaceId: string, nodeId: string): Promise<void> {
    await this.client.delete<AITableResponse<{}>>(
      `/spaces/${spaceId}/nodes/${nodeId}`
    );
  }

  /**
   * Move a node to a different folder
   * @param spaceId - Space ID
   * @param nodeId - Node ID
   * @param targetFolderId - Target folder ID
   */
  async moveNode(spaceId: string, nodeId: string, targetFolderId: string): Promise<AITableNode> {
    return this.updateNode(spaceId, nodeId, { parentId: targetFolderId });
  }

  /**
   * Get children nodes of a folder
   * @param spaceId - Space ID
   * @param folderId - Folder ID
   * @param type - Node type filter (optional)
   */
  async getFolderChildren(spaceId: string, folderId: string, type?: string): Promise<AITableNode[]> {
    const params: any = { parentId: folderId };
    if (type) params.type = type;
    
    const response = await this.client.get<AITableResponse<{ nodes: AITableNode[] }>>(
      `/spaces/${spaceId}/nodes`,
      { params }
    );
    return response.data.data.nodes;
  }

  /**
   * Get root level nodes
   * @param spaceId - Space ID
   * @param type - Node type filter (optional)
   */
  async getRootNodes(spaceId: string, type?: string): Promise<AITableNode[]> {
    const params: any = { parentId: null };
    if (type) params.type = type;
    
    const response = await this.client.get<AITableResponse<{ nodes: AITableNode[] }>>(
      `/spaces/${spaceId}/nodes`,
      { params }
    );
    return response.data.data.nodes;
  }

  /**
   * Make a generic request to the AITable API
   * @param method - HTTP method
   * @param path - API path
   * @param options - Request options (params, data)
   */
  async makeRequest(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    options: { params?: any; data?: any } = {}
  ) {
    const response = await this.client.request({
      method,
      url: path,
      params: options.params,
      data: options.data
    });
    return response.data;
  }
} 