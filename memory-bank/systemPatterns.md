# System Patterns

## Architecture Overview
The system follows a modern web application architecture with:
- Next.js 15 frontend application with App Router for routing and UI
- Next.js API routes for backend functionality and secure AITable.ai proxying
- Custom AITable.ai API client for data access with error handling
- Firebase for authentication (not yet implemented)
- Environment variables for secure configuration of API keys and credentials

This separation ensures private data is never directly accessed from the client, maintaining security while providing a responsive user experience.

## Design Patterns
- **Repository Pattern**: Abstracted data access through custom AITable API client in src/lib/api/aitable.ts
- **API Route Pattern**: Secure backend endpoints that proxy AITable requests with error handling
- **Component-Based Architecture**: Frontend organization with shadcn/ui, Radix, and Tailwind CSS
- **Server Components**: Next.js server components for data fetching
- **Client Components**: Interactive UI components like ActiveProjects for dynamic data display
- **SWR Pattern**: To be implemented for efficient data fetching, caching, and revalidation
- **Environment Variables**: Secure configuration management for all API keys and credentials
- **Error Boundary Pattern**: Comprehensive error handling with specific error messages and status codes

## Component Relationships
- **Frontend Components**: Organized in src/components with UI primitives in src/components/ui
- **Backend API Routes**: Implemented in src/app/api/projects and src/app/api/clients
- **AITable API Client**: Custom implementation in src/lib/api/aitable.ts with comprehensive error handling
- **Dashboard Layout**: DashboardContent component maintains the overall dashboard structure
- **Active Projects Display**: ActiveProjects component for viewing current projects grouped by team
- **Authentication**: Firebase authentication with optional development bypass (to be implemented)
- **Configuration**: Maintained in environment variables and src/lib/config.ts
- **Types**: Defined in src/lib/types.ts for type safety
- **Metrics Processing**: Handled in src/lib/metrics.ts for calculations and data transformations

## Data Flow
1. User accesses the dashboard via the browser
2. ActiveProjects component initiates data fetching from the backend API
3. Next.js API route (/api/projects) receives the request
4. API route authenticates the request (to be implemented)
5. API route uses the AITable client to securely fetch project data
6. API route fetches additional client and member data to resolve names
7. Response data is transformed and processed as needed
8. Processed data is returned to the frontend
9. ActiveProjects component renders the data with appropriate grouping and sorting
10. User interacts with the data display (filtering and sorting to be enhanced)

## API Route Implementation
The system implements several API routes to securely interact with AITable:
1. **Projects Route** (`/api/projects`): 
   - Fetches active projects (launched and onboarding)
   - Resolves client names from client IDs
   - Resolves media buyer names from member IDs
   - Groups projects by team
   - Handles potential data type variations
   - Returns well-formatted project data with proper error handling
2. **Project Detail Route** (`/api/projects/[id]`): Fetches details for a specific project
3. **Clients Route** (`/api/clients`): Fetches client information
4. **Test Route** (`/api/aitable-test`): Verifies AITable API connectivity

## Home Page Architecture
The home page is built with these key components:
1. **Dashboard Content Component**: 
   - Overall dashboard layout and organization
   - Integration of ActiveProjects component
   - User role protection (to be fully implemented)
2. **Active Projects Component**: 
   - Fetches project data from backend API
   - Groups projects by team
   - Sorts projects by start date
   - Displays project information in a tabular format
   - Handles loading and error states
   - Color-codes project stages (Launched, Onboarding)
   - Displays client and media buyer information
3. **Data Fetching**: 
   - Client-side data fetching with error handling
   - Plans to implement SWR for caching and revalidation
4. **UI Components**: 
   - Using Tailwind CSS for styling
   - Clean tabular display with proper responsiveness
   - Color-coded status indicators
   - Team-based grouping of projects

## Error Handling Patterns
The system implements comprehensive error handling:
1. **API Error Categorization**: 
   - Different error types with specific status codes (401, 403, 404, 500)
   - Contextual error messages based on error type
   - Parsing of AITable API error responses
2. **Client-Side Error Handling**: 
   - Dedicated error states in components
   - User-friendly error messages
   - Content-type checking for error responses
   - Fallback UI when errors occur
3. **Fallbacks**: 
   - Conditional rendering based on data availability
   - "No projects found" message when no data is available
   - Fallback client and media buyer names when resolution fails
4. **Error Logging**: 
   - Detailed server-side error logging for debugging
   - Client-side error catching and reporting

## Key Technical Decisions
- Next.js API routes act as a secure proxy for AITable.ai
- Environment variables (.env.local) for sensitive configuration
- Custom AITable API client with robust error handling
- Relation field resolution (client and media buyer names)
- Team-based grouping of projects
- Sort projects by start date
- Tailwind CSS for styling with proper responsive design
- Record ID detection logic for AITable relation fields 