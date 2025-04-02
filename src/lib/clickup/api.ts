import clickup from '@api/clickup';
import { ClickUpUser, ClickUpWorkspace, ClickUpSpace, ClickUpList, ClickUpTask } from './types';

/**
 * ClickUp API client with TypeScript typings
 */
export class ClickUpApi {
  private isInitialized = false;

  /**
   * Initialize the ClickUp API client with authentication
   * @param apiToken Your ClickUp API token
   */
  initialize(apiToken: string): boolean {
    if (!apiToken) {
      console.error('ClickUp API token is required');
      return false;
    }

    try {
      clickup.auth(apiToken);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize ClickUp API:', error);
      return false;
    }
  }

  /**
   * Ensure the API client is initialized before making any requests
   */
  private ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('ClickUp API client is not initialized. Call initialize() first.');
    }
  }

  /**
   * Get the authenticated user's information
   * @returns Promise with user data
   */
  async getAuthenticatedUser(): Promise<ClickUpUser> {
    this.ensureInitialized();
    
    try {
      const { data } = await clickup.getAuthorizedUser();
      return data.user;
    } catch (error) {
      console.error('Error getting authenticated user:', error);
      throw error;
    }
  }

  /**
   * Get all workspaces (teams) accessible to the authenticated user
   * @returns Promise with workspace data
   */
  async getWorkspaces(): Promise<ClickUpWorkspace[]> {
    this.ensureInitialized();
    
    try {
      const { data } = await clickup.getAuthorizedTeams();
      return data.teams;
    } catch (error) {
      console.error('Error getting workspaces:', error);
      throw error;
    }
  }

  /**
   * Get all spaces in a workspace
   * @param workspaceId The workspace ID
   * @returns Promise with spaces data
   */
  async getSpaces(workspaceId: string): Promise<ClickUpSpace[]> {
    this.ensureInitialized();
    
    try {
      const { data } = await clickup.getSpaces({
        team_id: workspaceId
      });
      return data.spaces;
    } catch (error) {
      console.error(`Error getting spaces for workspace ${workspaceId}:`, error);
      throw error;
    }
  }

  /**
   * Get all lists in a space
   * @param spaceId The space ID
   * @returns Promise with lists data
   */
  async getLists(spaceId: string): Promise<ClickUpList[]> {
    this.ensureInitialized();
    
    try {
      const { data } = await clickup.getLists({
        space_id: spaceId
      });
      return data.lists;
    } catch (error) {
      console.error(`Error getting lists for space ${spaceId}:`, error);
      throw error;
    }
  }

  /**
   * Get all tasks in a list
   * @param listId The list ID
   * @returns Promise with tasks data
   */
  async getTasks(listId: string): Promise<ClickUpTask[]> {
    this.ensureInitialized();
    
    try {
      const { data } = await clickup.getTasks({
        list_id: listId
      });
      return data.tasks;
    } catch (error) {
      console.error(`Error getting tasks for list ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new task in a list
   * @param listId The list ID
   * @param name Task name
   * @param description Task description
   * @param assignees Array of user IDs to assign to the task
   * @returns Promise with created task data
   */
  async createTask(
    listId: string, 
    name: string, 
    description: string, 
    assignees: number[] = []
  ): Promise<ClickUpTask> {
    this.ensureInitialized();
    
    try {
      const { data } = await clickup.createTask({
        list_id: listId,
        name,
        description,
        assignees
      });
      return data;
    } catch (error) {
      console.error(`Error creating task in list ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Create a workspace audit log (Enterprise only)
   * @param workspaceId The workspace ID
   * @param eventName Name of the event
   * @param eventDescription Description of the event
   * @returns Promise with created audit log data
   */
  async createAuditLog(
    workspaceId: string,
    eventName: string = 'custom_event',
    eventDescription: string
  ): Promise<any> {
    this.ensureInitialized();
    
    try {
      const { data } = await clickup.createWorkspaceAuditLog(
        {
          event_name: eventName,
          event_description: eventDescription
        }, 
        {
          workspace_id: workspaceId
        }
      );
      return data;
    } catch (error) {
      console.error(`Error creating audit log in workspace ${workspaceId}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const clickUpApi = new ClickUpApi();
export default clickUpApi; 