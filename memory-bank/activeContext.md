# Active Context

## Current Focus
We are currently implementing the home page with active projects display for the Texonica.com dashboard project. We have made progress on establishing secure connections to the AITable.ai API through backend routes to retrieve project and client data. The AITable API configuration has been set up with proper environment variables for accessing projects, clients, and team members tables.

## Recent Changes
- Implemented backend API routes for projects and clients
- Set up AITable.ai API integration with secure token handling
- Added environment variables for AITable API configuration
- Configured the Projects table ID, Clients table ID, and Members table ID
- Created ActiveProjects component for displaying project information
- Implemented DashboardContent component for the main dashboard

## Next Steps
- Complete the active projects display with:
  - Team members information retrieval from AITable
  - Media buyer display
  - Retainer value in USD
  - Start date calculation
  - Number of months project has been active
- Implement sorting and filtering for the projects table
- Add data visualizations for key metrics
- Set up authentication with Firebase
- Add role-based access control
- Implement financial reporting panels
- Create detailed client views

*For detailed roadmap and implementation discussions, see [roadmap.md](roadmap.md)*

## Active Decisions
We need to determine the best approach for:
- Data fetching optimization to minimize API calls to AITable
- Caching strategy for AITable data
- User interface for financial reporting
- Dashboard layout for different user roles
- Error handling for API failures
- Data refresh strategy (manual vs. automatic)
- How to display team members efficiently within project cards

## Open Questions
- What specific financial metrics should be prioritized for the first release?
- What are the performance implications of frequent AITable.ai API calls?
- How should we display complex data relationships (e.g., team members to projects)?
- What level of data aggregation should happen on the backend vs. frontend?
- How often should data be refreshed from AITable.ai?
- What filtering capabilities are most important for users in the first release? 