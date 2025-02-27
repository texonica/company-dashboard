/**
 * Application configuration
 */
const config = {
  /**
   * AITable API configuration
   */
  aitable: {
    /**
     * Default space ID
     * This can be set as an environment variable or configured here
     */
    defaultSpaceId: process.env.NEXT_PUBLIC_AITABLE_DEFAULT_SPACE_ID || 'spc12q5HY4ay5',
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