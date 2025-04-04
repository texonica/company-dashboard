# Active Context

## Current Focus
We are implementing financial tracking features and enhancing the project management interface for the Texonica.com dashboard. We have established secure connections to both the AITable.ai API and ClickUp API through backend routes to retrieve and manage project, client, leadgen, and task data. The backend API routes for projects, clients, and leadgen data have been implemented with comprehensive error handling. 

We have recently added several new components to improve data entry and interaction with AITable records:
- DatePickerInput component for date field editing
- URLInput component for URL field editing
- AITableViewButton component for direct AITable record access

The ActiveProjects component has been enhanced and connected to the backend API, displaying sorted and grouped project information by team. We have implemented UWLeadgenMetricsChart and FVRLeadgenMetricsChart for interactive visualization of lead generation metrics with flexible display options.

We're now focusing on financial tracking features, with API endpoints for payments and subscriptions being set up to support the PnL tracking system outlined in our roadmap. This includes developing interfaces for CSV import of Xolo financial data, implementing the financial reporting panels, and creating AI/ML capabilities for transaction categorization.

## Recent Changes
- Added DatePickerInput component for intuitive date selection with calendar interface
- Added URLInput component for URL field editing with nested field support and popover interface
- Added AITableViewButton component for direct access to AITable records in new browser tabs
- Enhanced CRMStageDropdown component for improved project management
- Updated StageDropdown component for better user interaction with loading state feedback
- Updated Navigation component with improved layout and functionality
- Implemented backend API routes for payments and subscriptions
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
- Created UWLeadgenMetricsChart and FVRLeadgenMetricsChart components with:
  - Weekly and monthly view modes with toggle switch
  - Categorized metrics display (Funnel, Financial, Conversion Rates)
  - Interactive metric toggles with color coding
  - Date range filtering with DateRangeSelector component
  - Dynamic data aggregation based on view mode
  - Responsive visualization with error handling
- Implemented ClickUp API integration with:
  - Secure backend proxying through API routes
  - Proper type definitions and error handling
  - Rate limit management (100 requests per minute)
  - Example code for common operations
- Started implementation of financial tracking features with:
  - New API endpoints for payments and subscriptions
  - Initial setup for the PnL tracking system
  - Created operations section in the application structure

## Next Steps
- Complete the payments and subscriptions API endpoints
- Implement CSV import functionality for financial data (Xolo format)
- Create the financial reporting panels with:
  - Gross margin calculation at project, team, and company levels
  - Project count visualization per team
  - PnL reporting with multi-level analysis
- Develop AI/ML models for transaction categorization
- Build subscription tracking interface with Chargebee integration
- Create financial reconciliation workflow
- Enhance the active projects display with:
  - Months active calculation based on start date
  - Additional filtering options
  - Improved sorting capabilities
  - Better error state handling
- Implement authentication with Firebase
- Set up role-based access control
- Optimize data fetching with SWR caching
- Add additional data visualizations for key metrics
- Implement testing infrastructure
- Create detailed client views
- Implement export functionality
- Integrate ClickUp tasks with project management views
- Set up proper caching to prevent API rate limiting (both AITable and ClickUp)

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
- Rate limiting strategy implementation for AITable and ClickUp APIs

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
- What's the best approach for implementing API rate limiting to avoid hitting AITable and ClickUp limits?
- How should we optimize the performance of chart components with large datasets? 