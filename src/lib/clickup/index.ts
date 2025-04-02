/**
 * ClickUp API Integration Module
 * 
 * This module provides access to ClickUp API functionality via a type-safe wrapper.
 * It follows security best practices by proxying all API requests through backend routes.
 */

import clickUpApi from './api';

// Re-export the API client and types
export * from './types';
export { clickUpApi as default }; 