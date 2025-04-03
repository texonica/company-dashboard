# System Patterns

## Architecture Overview
The system follows a modern web application architecture with:
- Next.js 15 frontend application with App Router for routing and UI
- Next.js API routes for backend functionality and secure API proxying
- Custom AITable.ai API client for data access with error handling
- Custom ClickUp API client for task management
- Firebase for authentication (not yet implemented)
- Environment variables for secure configuration of API keys and credentials

This separation ensures private data is never directly accessed from the client, maintaining security while providing a responsive user experience.

## Design Patterns
- **Repository Pattern**: Abstracted data access through custom API clients in src/lib/api/aitable.ts and src/lib/clickup/api.ts
- **API Route Pattern**: Secure backend endpoints that proxy API requests with error handling
- **Component-Based Architecture**: Frontend organization with shadcn/ui, Radix, and Tailwind CSS
- **Server Components**: Next.js server components for data fetching
- **Client Components**: Interactive UI components like ActiveProjects and leadgen metric charts for dynamic data display
- **SWR Pattern**: To be implemented for efficient data fetching, caching, and revalidation
- **Environment Variables**: Secure configuration management for all API keys and credentials
- **Error Boundary Pattern**: Comprehensive error handling with specific error messages and status codes
- **Presentational Charts Pattern**: Configurable chart displays like UWLeadgenMetricsChart and FVRLeadgenMetricsChart with flexible rendering options
- **Financial Data Processing Pattern**: Planned implementation for handling CSV imports, transaction categorization, and payment-project mapping
- **Status Management Pattern**: Implemented through StageDropdown and CRMStageDropdown components for project status management

## Component Relationships
- **Frontend Components**: Organized in src/components with UI primitives in src/components/ui
- **Backend API Routes**: 
  - Projects and clients in src/app/api/projects and src/app/api/clients
  - ClickUp task management in src/app/api/clickup
  - Financial data in src/app/api/payments and src/app/api/subscriptions
  - Leadgen data in src/app/api/leadgen
- **API Clients**: 
  - AITable API client in src/lib/api/aitable.ts with comprehensive error handling
  - ClickUp API client in src/lib/clickup/api.ts for task management
- **Dashboard Layout**: DashboardContent component maintains the overall dashboard structure
- **Navigation**: Navigation component provides access to different sections
- **Active Projects Display**: ActiveProjects component for viewing current projects grouped by team
- **Status Management**: 
  - StageDropdown component for managing project stages
  - CRMStageDropdown component for advanced CRM stage management
- **Lead Generation Metrics**: 
  - UWLeadgenMetricsChart component for UW leadgen metrics
  - FVRLeadgenMetricsChart component for FVR leadgen metrics
- **Financial Tracking**: 
  - Payments API endpoints in src/app/api/payments
  - Subscriptions API endpoints in src/app/api/subscriptions
  - Operations section for financial management
- **Authentication**: Firebase authentication with optional development bypass (to be implemented)
- **Configuration**: Maintained in environment variables and src/lib/config.ts
- **Types**: Defined in src/lib/types.ts and src/lib/clickup/types.ts for type safety
- **Metrics Processing**: Handled in src/lib/metrics.ts for calculations and data transformations
- **Data Visualization**: Implemented through MetricsChart with dedicated chart types (line charts)

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
11. User can manage project status via the StageDropdown or CRMStageDropdown components

Similar flow applies to ClickUp API requests, with API routes in /api/clickup acting as secure proxies.

For financial data management, the planned flow is:
1. User uploads financial data via CSV import
2. Backend processes and categorizes transactions
3. System maps payments to projects (potentially many-to-many)
4. Financial data is aggregated for reporting
5. User can review and reconcile unmapped transactions
6. Subscription data is tracked and managed

## API Route Implementation
The system implements several API routes to securely interact with external services:

1. **AITable API Routes**:
   - **Projects Route** (`/api/projects`): 
     - Fetches active projects (launched and onboarding)
     - Resolves client names from client IDs
     - Resolves media buyer names from member IDs
     - Groups projects by team
     - Handles potential data type variations
     - Returns well-formatted project data with proper error handling
   - **Project Detail Route** (`/api/projects/[id]`): Fetches details for a specific project
   - **Clients Route** (`/api/clients`): Fetches client information
   - **Leadgen Route** (`/api/leadgen`): Fetches lead generation metrics data
   - **Test Route** (`/api/aitable-test`): Verifies AITable API connectivity

2. **ClickUp API Routes**:
   - **Tasks Route** (`/api/clickup/tasks`): 
     - Fetches tasks based on specified parameters
     - Handles pagination for large datasets
     - Implements rate limit handling (100 requests per minute)
   - **Task Detail Route** (`/api/clickup/tasks/[id]`): Fetches details for a specific task
   - **Create Task Route** (`/api/clickup/tasks`): Creates new tasks with POST method
   - **Update Task Route** (`/api/clickup/tasks/[id]`): Updates existing tasks with PATCH method

3. **Financial Data Routes** (in development):
   - **Payments Route** (`/api/payments`): 
     - Will handle financial transaction data
     - Support CSV imports for Xolo financial data
     - Process transaction categorization
     - Map payments to projects (many-to-many relationships)
   - **Subscriptions Route** (`/api/subscriptions`):
     - Will manage recurring payment data
     - Track subscription status and renewal information
     - Integrate with Chargebee (planned)
     - Associate subscriptions with clients and projects

## Home Page Architecture
The home page is built with these key components:
1. **Dashboard Content Component**: 
   - Overall dashboard layout and organization
   - Integration of ActiveProjects component
   - User role protection (to be fully implemented)
2. **Navigation Component**:
   - Provides access to different sections of the application
   - Responsive design with mobile support
3. **Active Projects Component**: 
   - Fetches project data from backend API
   - Groups projects by team
   - Sorts projects by start date
   - Displays project information in a tabular format
   - Handles loading and error states
   - Color-codes project stages (Launched, Onboarding)
   - Displays client and media buyer information
4. **Status Management Components**:
   - StageDropdown for managing project stages
   - CRMStageDropdown for advanced CRM stage management
5. **Data Fetching**: 
   - Client-side data fetching with error handling
   - Plans to implement SWR for caching and revalidation
6. **UI Components**: 
   - Using Tailwind CSS for styling
   - Clean tabular display with proper responsiveness
   - Color-coded status indicators
   - Team-based grouping of projects

## Leadgen Metrics Components
The leadgen metrics components follow these patterns:

1. **UWLeadgenMetricsChart Component**:
   - **Data Visualization**: 
     - Flexible chart display for UW lead generation metrics
     - Provides weekly and monthly view modes with toggle
     - Groups metrics into categories (Funnel, Financial, Conversion Rates)
     - Configurable metrics with color coding and formatting
     - Uses MetricsChart for rendering line charts
   - **Component State Management**:
     - Uses useState for local state management
     - Tracks selected metrics, date range, and view mode
     - Implements useMemo for performance optimization of calculations
   - **User Interaction**:
     - Date range selection with DateRangeSelector component
     - Toggle buttons for metric visibility
     - View mode switching between weekly and monthly
     - Visual feedback for selected metrics
   - **Data Processing**:
     - Filters records based on date range
     - Aggregates data by week or month based on view mode
     - Calculates sums and averages for different metric types
     - Formats data appropriately for visualization

2. **FVRLeadgenMetricsChart Component**:
   - Similar architecture to UWLeadgenMetricsChart
   - Customized for FVR-specific metrics and data structure
   - Shares common UI patterns and interaction models
   - Implements specific calculations for FVR metrics
   - Maintains consistent visualization approach with UW component

3. **Shared Patterns Between Leadgen Components**:
   - Common date range selection mechanism
   - Consistent UI patterns for metric selection
   - Shared MetricsChart component for rendering
   - Similar data aggregation methods
   - Common error handling patterns
   - Performance optimization techniques

## Financial Tracking Components (Planned)
The financial tracking components will follow these patterns:

1. **CSV Import Component**:
   - Secure file upload interface
   - Parsing logic for Xolo CSV format
   - Data normalization and validation
   - Error handling for invalid data

2. **Transaction Categorization**:
   - AI/ML-based classification system
   - Training models for expense categorization
   - Matching incoming payments with projects/clients
   - Confidence scoring for categorization accuracy

3. **Payment-Project Mapping**:
   - Interface for allocating single payments across multiple projects
   - Many-to-many relationship management
   - Distribution percentage tracking
   - Audit trail of payment allocations

4. **Subscription Management**:
   - Chargebee connector for subscription data
   - Renewal tracking and alerting
   - Client and project association
   - Subscription lifecycle visualization

5. **Financial Reconciliation**:
   - Review interface for unmapped transactions
   - Suggestion logic for likely matches
   - Batch processing for similar transactions
   - Audit trail maintenance

## Error Handling Patterns
The system implements comprehensive error handling:
1. **API Error Categorization**: 
   - Different error types with specific status codes (401, 403, 404, 500)
   - Contextual error messages based on error type
   - Parsing of AITable API error responses
   - Handling of ClickUp API errors and rate limits
2. **Client-Side Error Handling**: 
   - Dedicated error states in components
   - User-friendly error messages
   - Content-type checking for error responses
   - Fallback UI when errors occur
3. **Fallbacks**: 
   - Conditional rendering based on data availability
   - "No projects found" message when no data is available
   - "No data available" message in charts when date range has no data
   - Fallback client and media buyer names when resolution fails
4. **Error Logging**: 
   - Detailed server-side error logging for debugging
   - Client-side error catching and reporting

## Key Technical Decisions
- Next.js API routes act as a secure proxy for external APIs
- Environment variables (.env.local) for sensitive configuration
- Custom API clients with robust error handling
- Relation field resolution (client and media buyer names)
- Team-based grouping of projects
- Sort projects by start date
- Tailwind CSS for styling with proper responsive design
- Record ID detection logic for AITable relation fields
- MetricsChart component for flexible data visualization
- Separate aggregation methods for different metric types (sum vs. average)
- Secure ClickUp integration for task management
- Shared component patterns between similar visualization components
- Financial data processing will use a secure backend approach
- CSV import for financial data with AI-powered categorization
- Many-to-many relationships for payment-project mapping 