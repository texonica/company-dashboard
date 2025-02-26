/**
 * Application configuration
 */
const config = {
  /**
   * AITable API configuration
   */
  aitable: {
    /**
     * AITable API token
     * This should be set as an environment variable in production
     */
    apiToken: process.env.NEXT_PUBLIC_AITABLE_API_TOKEN || '',
    
    /**
     * Default space ID
     * This can be set as an environment variable or configured here
     */
    defaultSpaceId: 'spc12q5HY4ay5',
  },
  
  /**
   * Application configuration
   */
  app: {
    /**
     * Application name
     */
    name: 'AITable Dashboard',
    
    /**
     * Application description
     */
    description: 'A dashboard for managing AITable data',
  },
};

export default config; 