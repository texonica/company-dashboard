# Active Context

## Current Focus
We are implementing data visualization components for the Texonica.com dashboard project. We have made progress on establishing secure connections to the AITable.ai API through backend routes to retrieve project, client, and UW leadgen data. The AITable API configuration has been set up with proper environment variables for accessing projects, clients, team members, and UW lead generation tables.

The backend API routes for projects have been implemented with comprehensive error handling, client name resolution, and media buyer resolution. The ActiveProjects component has been created and connected to the backend API, allowing for the display of sorted and grouped project information by team.

We have implemented two leadgen metrics visualization components: UWLeadgenMetricsChart and FVRLeadgenMetricsChart. Both provide interactive visualization of lead generation metrics with flexible display options, including weekly and monthly views, metric toggles, and date range selection.

Additionally, we've integrated ClickUp API functionality to enable task management capabilities, with proper API client implementation, type definitions, and backend proxying to protect credentials.

## Recent Changes
- Implemented backend API routes for projects and clients with detailed error handling
- Set up AITable.ai API integration with secure token handling via environment variables
- Added comprehensive error handling in API routes with specific status codes
- Created ActiveProjects component for displaying project information with:
  - Project titles and IDs
  - Team grouping functionality
  - Client name resolution from client IDs
  - Media buyer resolution from member IDs
  - Budget formatting
  - Stage visualization with color coding
  - Sorting by start date
- Implemented DashboardContent component for the main dashboard layout
- Integrated ActiveProjects into the main dashboard
- Created UWLeadgenMetricsChart component with:
  - Weekly and monthly view modes
  - Categorized metrics display (Funnel, Financial, Conversion Rates)
  - Interactive metric toggles with color coding
  - Date range filtering
  - Dynamic data aggregation
  - Responsive visualization
  - Performance optimization via memoization
- Added FVRLeadgenMetricsChart component with similar capabilities for FVR-specific metrics
- Implemented ClickUp API integration with:
  - Secure backend proxying through API routes
  - Proper type definitions
  - Example code for common operations
  - API client with comprehensive error handling

## Next Steps
- Enhance the active projects display with:
  - Months active calculation based on start date
  - Additional filtering options
  - Improved sorting capabilities
  - Better error state handling
- Improve the leadgen metrics visualizations with:
  - Additional export capabilities
  - More comprehensive analytics
  - Enhanced data processing
- Implement authentication with Firebase
- Set up role-based access control
- Create financial reporting panels as the next major feature
- Add additional data visualizations for key metrics
- Optimize data fetching to minimize API calls
- Implement caching strategy for AITable and ClickUp data
- Develop detailed client views
- Integrate ClickUp task data with project management views
- Plan for comprehensive PnL tracking system including:
  - Xolo CSV import and processing pipeline
  - AI-powered transaction categorization
  - Client-Payment-Project mapping for complex financial relationships
  - Subscription tracking with Chargebee integration
  - Financial reconciliation workflow

*For detailed roadmap and implementation discussions, see [roadmap.md](roadmap.md)*

## Active Decisions
We need to determine the best approach for:
- Data fetching optimization to minimize API calls to AITable and ClickUp
- Caching strategy for API data (using SWR)
- User interface for financial reporting panels
- Dashboard layout for different user roles
- Authentication implementation with Firebase
- Data refresh strategy (manual vs. automatic)
- How to calculate and display project duration (months active)
- Additional metrics to include in the leadgen visualizations
- Best approach for data aggregation in monthly view mode
- Integrating ClickUp tasks with project management workflow
- PnL tracking system architecture:
  - CSV import and parsing strategy
  - AI model selection for transaction categorization
  - Database schema for many-to-many payment-project relationships
  - Subscription tracking integration approach
  - User interface for financial reconciliation workflows

## Open Questions
- What specific financial metrics should be prioritized for the first release?
- How should we handle potentially large datasets from AITable and ClickUp?
- What is the most efficient way to display team members within project cards?
- How often should data be refreshed from external APIs?
- What filtering capabilities are most important for users in the first release?
- What additional leadgen metrics would be valuable to display?
- What level of data aggregation should happen on the backend vs. frontend?
- Should we add drill-down capabilities to charts for more detailed analysis?
- How should we integrate ClickUp tasks with project views? 