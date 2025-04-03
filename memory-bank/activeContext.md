# Active Context

## Current Focus
We are implementing financial tracking features and enhancing the project management interface for the Texonica.com dashboard. We have established secure connections to both the AITable.ai API and ClickUp API through backend routes to retrieve and manage project, client, leadgen, and task data. The backend API routes for projects, clients, and leadgen data have been implemented with comprehensive error handling. We have added StageDropdown and CRMStageDropdown components to improve project management functionality.

The ActiveProjects component has been enhanced and connected to the backend API, displaying sorted and grouped project information by team. We have implemented UWLeadgenMetricsChart and FVRLeadgenMetricsChart for interactive visualization of lead generation metrics with flexible display options.

We're now focusing on financial tracking features, with new API endpoints for payments and subscriptions being set up to support the PnL tracking system outlined in our roadmap.

## Recent Changes
- Added CRMStageDropdown component for improved project management
- Enhanced StageDropdown component for better user interaction
- Updated Navigation component with improved layout and functionality
- Implemented backend API routes for projects and clients with detailed error handling
- Set up AITable.ai API integration with secure token handling via environment variables
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
- Created UWLeadgenMetricsChart and FVRLeadgenMetricsChart components with:
  - Weekly and monthly view modes
  - Categorized metrics display (Funnel, Financial, Conversion Rates)
  - Interactive metric toggles with color coding
  - Date range filtering
  - Dynamic data aggregation
  - Responsive visualization
- Implemented ClickUp API integration with:
  - Secure backend proxying through API routes
  - Proper type definitions
  - Example code for common operations
  - API client with comprehensive error handling
- Started implementation of financial tracking features with:
  - New API endpoints for payments and subscriptions
  - Initial setup for the PnL tracking system
  - Created operations section in the application structure

## Next Steps
- Complete the payments and subscriptions API endpoints
- Implement CSV import functionality for financial data (Xolo)
- Create the financial reporting panels with:
  - Gross margin calculation at project, team, and company levels
  - Project count visualization per team
  - PnL reporting with multi-level analysis
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
- Add additional data visualizations for key metrics
- Optimize data fetching to minimize API calls
- Implement caching strategy for AITable and ClickUp data
- Develop detailed client views
- Integrate ClickUp task data with project management views

*For detailed roadmap and implementation discussions, see [roadmap.md](roadmap.md)*

## Active Decisions
We need to determine the best approach for:
- CSV import and parsing strategy for financial data (Xolo format)
- Data model for many-to-many payment-project relationships
- AI/ML approach for transaction categorization
- Subscription tracking model and integration with Chargebee
- Financial reconciliation workflow UI and logic
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

## Open Questions
- What is the most efficient way to import and parse Xolo CSV data?
- How should we structure the data model for handling payments that apply to multiple projects?
- What ML approach is best for automatically categorizing financial transactions?
- How should we handle subscription tracking and integrate with Chargebee?
- What UI approach will work best for the financial reconciliation workflow?
- What specific financial metrics should be prioritized for the first release?
- How should we handle potentially large datasets from AITable and ClickUp?
- What is the most efficient way to display team members within project cards?
- How often should data be refreshed from external APIs?
- What filtering capabilities are most important for users in the first release?
- What additional leadgen metrics would be valuable to display?
- What level of data aggregation should happen on the backend vs. frontend?
- Should we add drill-down capabilities to charts for more detailed analysis?
- How should we integrate ClickUp tasks with project views? 