/**
 * API client for making authenticated requests to backend endpoints
 */

export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  // Add the API key to every request
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_TEMPORARY_API_KEY || '',
    ...options.headers,
  };

  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non-200 responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }

  // Parse JSON or return empty object if no content
  return response.json().catch(() => ({})) as Promise<T>;
}

// Helper methods for common HTTP methods
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { method: 'GET', ...options }),
  
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
  
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
}; 