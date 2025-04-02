// src/lib/clickup/examples.js
const clickup = require('@api/clickup');

/**
 * This file provides examples of how to use the ClickUp API client directly
 * 
 * Before using this, make sure to:
 * 1. Create a .env.local file with your ClickUp API token:
 *    CLICKUP_API_TOKEN=your_api_token_here
 * 2. Get your workspace ID from ClickUp
 */

// Set up authentication
const setupClickUp = () => {
  // Get API token from environment variables
  const apiToken = process.env.CLICKUP_API_TOKEN;
  
  if (!apiToken) {
    console.error('CLICKUP_API_TOKEN is not set in environment variables');
    return false;
  }
  
  // Authenticate with the ClickUp API
  clickup.auth(apiToken);
  
  return true;
};

// Example: Get authorized user
const getAuthorizedUser = async () => {
  try {
    const { data } = await clickup.getAuthorizedUser();
    console.log('Authorized User:', data);
    return data;
  } catch (error) {
    console.error('Error getting authorized user:', error);
    throw error;
  }
};

// Example: Get workspaces (teams)
const getWorkspaces = async () => {
  try {
    const { data } = await clickup.getAuthorizedTeams();
    console.log('Workspaces:', data);
    return data;
  } catch (error) {
    console.error('Error getting workspaces:', error);
    throw error;
  }
};

// Example: Get spaces in a workspace
const getSpaces = async (workspaceId) => {
  try {
    const { data } = await clickup.getSpaces({
      team_id: workspaceId
    });
    console.log('Spaces:', data);
    return data;
  } catch (error) {
    console.error('Error getting spaces:', error);
    throw error;
  }
};

// Example: Get lists in a space
const getLists = async (spaceId) => {
  try {
    const { data } = await clickup.getLists({
      space_id: spaceId
    });
    console.log('Lists:', data);
    return data;
  } catch (error) {
    console.error('Error getting lists:', error);
    throw error;
  }
};

// Example: Get tasks in a list
const getTasks = async (listId) => {
  try {
    const { data } = await clickup.getTasks({
      list_id: listId
    });
    console.log('Tasks:', data);
    return data;
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

// Example: Create a task
const createTask = async (listId, taskName, description, assignees = []) => {
  try {
    const { data } = await clickup.createTask({
      list_id: listId,
      name: taskName,
      description: description,
      assignees: assignees
    });
    console.log('Created Task:', data);
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Example: Create workspace audit log (Enterprise only)
const createWorkspaceAuditLog = async (workspaceId, eventDescription) => {
  try {
    const { data } = await clickup.createWorkspaceAuditLog(
      {
        event_name: 'custom_event',
        event_description: eventDescription
      }, 
      {
        workspace_id: workspaceId
      }
    );
    console.log('Created Audit Log:', data);
    return data;
  } catch (error) {
    console.error('Error creating audit log:', error);
    throw error;
  }
};

// Export functions for use in other files
module.exports = {
  setupClickUp,
  getAuthorizedUser,
  getWorkspaces,
  getSpaces,
  getLists,
  getTasks,
  createTask,
  createWorkspaceAuditLog
}; 