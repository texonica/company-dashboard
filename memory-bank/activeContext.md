# Active Context

## Current Focus
We are currently implementing the home page with active projects display for the Texonica.com dashboard project. We have made progress on establishing secure connections to the AITable.ai API through backend routes to retrieve project and client data. The AITable API configuration has been set up with proper environment variables for accessing projects, clients, team members, and UW lead generation tables.

The backend API routes for projects have been implemented with comprehensive error handling, client name resolution, and media buyer resolution. The ActiveProjects component has been created and connected to the backend API, allowing for the display of sorted and grouped project information by team.

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

## Next Steps
- Enhance the active projects display with:
  - Months active calculation based on start date
  - Additional filtering options
  - Improved sorting capabilities
  - Better error state handling
- Implement authentication with Firebase
- Set up role-based access control
- Create financial reporting panels as the next major feature
- Add data visualizations for key metrics
- Optimize data fetching to minimize API calls
- Implement caching strategy for AITable data
- Develop detailed client views

*For detailed roadmap and implementation discussions, see [roadmap.md](roadmap.md)*

## Active Decisions
We need to determine the best approach for:
- Data fetching optimization to minimize API calls to AITable
- Caching strategy for AITable data (using SWR)
- User interface for financial reporting panels
- Dashboard layout for different user roles
- Authentication implementation with Firebase
- Data refresh strategy (manual vs. automatic)
- How to calculate and display project duration (months active)

## Open Questions
- What specific financial metrics should be prioritized for the first release?
- How should we handle potentially large datasets from AITable?
- What is the most efficient way to display team members within project cards?
- How often should data be refreshed from AITable.ai?
- What filtering capabilities are most important for users in the first release?
- How should we utilize the UW LeadGen table in the dashboard?
- What level of data aggregation should happen on the backend vs. frontend? 