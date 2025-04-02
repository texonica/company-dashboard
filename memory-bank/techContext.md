# Technical Context

## Technologies Used
- **Frontend**: 
  - Next.js 15.x (App Router) for the application framework
  - React 18 for UI components
  - Tailwind CSS for styling
  - SWR for data fetching and caching (planned implementation)
  - TypeScript for type safety
  - date-fns for date manipulation and formatting
  - Customizable chart components for data visualization
- **Backend**:
  - Next.js API routes for backend functionality
  - Custom AITable API client
  - Firebase for authentication (planned implementation)
- **Data Storage**:
  - AITable.ai for primary data (accessed via secure API)
  - Environment variables for configuration (.env.local)
- **DevOps**:
  - To be determined for CI/CD pipeline
  - Planned deployment platform to be decided

## Development Environment
The development environment includes:
- Local development server with hot reloading (`npm run dev`)
- Environment variables in .env.local for configuration
- Integration with AITable.ai API using server-side API token
- Development authentication bypass option for testing (to be implemented)
- Responsive design testing for multiple screen sizes

## Dependencies
Key dependencies include:
- **API Integration**:
  - Custom AITable.ai API client in src/lib/api/aitable.ts
  - HTTP fetch for API requests with proper error handling
- **Authentication**:
  - Firebase for authentication (to be implemented)
- **UI and Styling**:
  - Tailwind CSS for responsive styling
  - TypeScript for type-safe development
  - shadcn/ui components (Card, Button, Switch, Label)
- **Data Management**:
  - SWR for data fetching with caching (planned)
  - date-fns for date/time calculations and formatting
- **Data Visualization**:
  - Custom chart components (MetricsChart)
  - Configurable visualization settings

## Technical Constraints
- Must securely store and transmit sensitive financial and client data
- AITable.ai API rate limits must be managed with proper caching
- Cross-browser compatibility is required
- Performance optimization for data fetching to minimize API calls
- Authentication and authorization must be properly implemented
- Mobile responsiveness is essential for all dashboard views
- Secure handling of API credentials using environment variables only
- Charts must be optimized for both weekly and monthly data aggregation

## Build & Deployment
- **Development**: Local Next.js development server (`npm run dev`)
- **Building**: Next.js build process (`npm run build`)
- **Production**: Start Next.js server (`npm run start`)
- **Linting**: ESLint for code quality (`npm run lint`)

## AITable.ai Integration
The AITable.ai integration has been implemented with:

1. **Environment variables for secure access**:
   - AITABLE_API_TOKEN for authentication
   - AITABLE_BASE_ID for the workspace
   - AITABLE_PROJECTS_TABLE_ID for projects data
   - AITABLE_CLIENTS_TABLE_ID for clients data
   - AITABLE_MEMBERS_TABLE_ID for team members data
   - AITABLE_UW_LEADGEN_TABLE_ID for UW lead generation data

2. **Backend API implementation**:
   - Custom API client in src/lib/api/aitable.ts with comprehensive error handling
   - Type definitions for AITableProject, AITableClient, AITableMember
   - API routes in src/app/api/projects and src/app/api/clients
   - Secure proxy to protect API credentials
   - Validation of configuration before making requests
   - Error handling with specific status codes and messages

3. **Data fetching functions**:
   - fetchTableRecords() for retrieving multiple records with filtering
   - fetchRecord() for retrieving a single record by ID
   - fetchClient() and fetchClientsByIds() for client data
   - fetchMembersByIds() for team member data
   - fetchSpaceDetails() and fetchTables() for metadata

4. **Relation field handling**:
   - Logic for resolving client names from client IDs
   - Logic for resolving media buyer names from member IDs
   - Helper functions for validating record IDs
   - Handling of both string and array relation fields

5. **API Route Implementation**:
   - Filtering for active projects (`OR(Stage="Launched",Stage="Onboarding")`)
   - Processing of fetched data for frontend consumption
   - Client and member ID extraction and resolution
   - Robust error handling with specific status codes and messages

## Data Visualization Components
The dashboard includes several data visualization components:

1. **UWLeadgenMetricsChart**:
   - Client component for visualizing UW lead generation metrics
   - Supports weekly and monthly view modes with toggle
   - Categorizes metrics into Funnel, Financial, and Conversion Rate groups
   - Configurable metric visibility with custom formatting
   - Interactive filtering by date range
   - Uses date-fns for date manipulation and parsing
   - Applies memoization for performance optimization
   - Color-coded metrics with consistent styling
   - Aggregates data using sum or average based on metric type

2. **MetricsChart**:
   - Reusable chart component for visualizing metric data
   - Supports line charts with configurable properties
   - Handles both weekly and monthly data visualization
   - Accepts data points with multiple metrics
   - Provides custom formatting options for different metric types

3. **DateRangeSelector**:
   - Reusable component for selecting date ranges
   - Integrated with UWLeadgenMetricsChart for filtering data
   - Emits range change events for parent components to react 