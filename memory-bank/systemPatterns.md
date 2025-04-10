# System Patterns

## Architecture Overview
The system follows a modern web application architecture with:
- Next.js 15 frontend application with App Router for routing and UI
- Next.js API routes for backend functionality and secure API proxying
- Custom AITable.ai API client for data access with error handling
- Custom ClickUp API client for task management
- Custom Google Gemini API client for AI capabilities
- Custom Chargebee API client for subscription management
- Firebase for authentication (not yet implemented)
- Environment variables for secure configuration of API keys and credentials

This separation ensures private data is never directly accessed from the client, maintaining security while providing a responsive user experience. All external API interactions are proxied through backend routes to protect credentials and implement rate limiting.

## Design Patterns
- **Repository Pattern**: Abstracted data access through custom API clients in src/lib/api/aitable.ts, src/lib/clickup/api.ts, src/lib/api/gemini.ts, and src/lib/api/chargebee.ts
- **API Route Pattern**: Secure backend endpoints that proxy API requests with error handling
- **Component-Based Architecture**: Frontend organization with shadcn/ui, Radix, and Tailwind CSS
- **Server Components**: Next.js server components for data fetching
- **Client Components**: Interactive UI components like ActiveProjects and leadgen metric charts for dynamic data display
- **SWR Pattern**: To be implemented for efficient data fetching, caching, and revalidation
- **Environment Variables**: Secure configuration management for all API keys and credentials
- **Error Boundary Pattern**: Comprehensive error handling with specific error messages and status codes
- **Rate Limiting Pattern**: Advanced request management with throttling, queuing, batching, and caching
- **Presentational Charts Pattern**: Configurable chart displays like UWLeadgenMetricsChart and FVRLeadgenMetricsChart with flexible rendering options
- **AI Integration Pattern**: Structured prompts and context management for Google Gemini API interactions
- **Financial Data Processing Pattern**: Planned implementation for handling CSV imports, transaction categorization, and payment-project mapping
- **Status Management Pattern**: Implemented through StageDropdown and CRMStageDropdown components for project status management
- **Field Editing Pattern**: Implemented through DatePickerInput, URLInput components for direct AITable field editing with loading state feedback
- **External Link Pattern**: Implemented through AITableViewButton for direct record access in AITable
- **Subscription Management Pattern**: Implemented through Chargebee API integration for handling subscription lifecycles
- **Webhook Handler Pattern**: Implemented for processing Chargebee events for subscription updates

## Component Relationships
- **Frontend Components**: Organized in src/components with UI primitives in src/components/ui
- **Backend API Routes**: 
  - Projects and clients in src/app/api/projects and src/app/api/clients
  - ClickUp task management in src/app/api/clickup
  - Gemini AI capabilities in src/app/api/gemini
  - Financial data in src/app/api/payments and src/app/api/subscriptions
  - Leadgen data in src/app/api/leadgen
  - Chargebee data in src/app/api/chargebee
- **API Clients**: 
  - AITable API client in src/lib/api/aitable.ts with comprehensive error handling
  - ClickUp API client in src/lib/clickup/api.ts for task management
  - Gemini API client in src/lib/api/gemini.ts for AI capabilities
  - Chargebee API client in src/lib/api/chargebee.ts for subscription management
- **Dashboard Layout**: DashboardContent component maintains the overall dashboard structure
- **Navigation**: Navigation component provides access to different sections
- **Active Projects Display**: ActiveProjects component for viewing current projects grouped by team
- **Status Management**: 
  - StageDropdown component for managing project stages
  - CRMStageDropdown component for advanced CRM stage management
- **Data Input Components**:
  - DatePickerInput component for date field editing with calendar interface
  - URLInput component for URL field editing with validation
  - AITableViewButton component for direct AITable record access
- **Lead Generation Metrics**: 
  - UWLeadgenMetricsChart component for UW leadgen metrics
  - FVRLeadgenMetricsChart component for FVR leadgen metrics
- **Financial Tracking**: 
  - Payments API endpoints in src/app/api/payments
  - Subscriptions API endpoints in src/app/api/subscriptions
  - Operations section for financial management
  - Chargebee integration for subscription management
- **AI Capabilities**:
  - Gemini AI client in src/lib/api/gemini.ts
  - Proxy routes in src/app/api/gemini
  - Model selection based on task requirements
  - Prompt engineering for specific use cases
- **Authentication**: Firebase authentication with optional development bypass (to be implemented)
- **Configuration**: Maintained in environment variables and src/lib/config.ts
- **Types**: Defined in src/lib/types.ts and src/lib/clickup/types.ts for type safety
- **Metrics Processing**: Handled in src/lib/metrics.ts for calculations and data transformations
- **Data Visualization**: Implemented through MetricsChart with dedicated chart types (line charts)
- **Rate Limiting**: Comprehensive strategy implemented across all external API interactions

## Data Flow
1. User accesses the dashboard via the browser
2. ActiveProjects component initiates data fetching from the backend API
3. Next.js API route (/api/projects) receives the request
4. API route authenticates the request (to be implemented)
5. API route uses the AITable client to securely fetch project data
6. API route applies rate limiting strategies to prevent hitting API limits
7. API route fetches additional client and member data to resolve names
8. Response data is transformed and processed as needed
9. Processed data is returned to the frontend
10. ActiveProjects component renders the data with appropriate grouping and sorting
11. User interacts with the data display (filtering and sorting to be enhanced)
12. User can manage project status via the StageDropdown or CRMStageDropdown components
13. User can edit date fields via DatePickerInput component with immediate API updates
14. User can edit URL fields via URLInput component with immediate API updates
15. User can access records directly in AITable via AITableViewButton

Similar flow applies to ClickUp API requests, with API routes in /api/clickup acting as secure proxies and applying rate limiting strategies.

For Gemini AI capabilities, the flow is:
1. User interacts with an AI-powered feature
2. Frontend sends a request to the backend API
3. API route (/api/gemini) receives the request
4. API route authenticates the request (to be implemented)
5. API route constructs the appropriate prompt with context
6. API route selects the optimal Gemini model based on the task
7. API route sends the request to Gemini API with secure credentials
8. Response is processed and transformed as needed
9. Results are returned to the frontend
10. Frontend displays the AI-generated content to the user

For Chargebee subscription management, the flow is:
1. User interacts with subscription management feature
2. Frontend sends a request to the backend API
3. API route (/api/chargebee) receives the request
4. API route authenticates the request (to be implemented)
5. API route uses the Chargebee client to securely interact with Chargebee API
6. Request includes idempotency key for critical operations
7. API route handles rate limiting and error scenarios
8. Response is processed and returned to the frontend
9. Frontend displays the subscription information to the user
10. For webhook events, Chargebee sends events to /api/chargebee/webhook endpoint
11. Webhook handler processes events and updates internal state as needed

For financial data management, the planned flow is:
1. User uploads financial data via CSV import
2. Backend processes and categorizes transactions
3. System maps payments to projects (potentially many-to-many)
4. Financial data is aggregated for reporting
5. User can review and reconcile unmapped transactions
6. Subscription data is tracked and managed through Chargebee integration

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
     - **Leadgen CRM Routes**:
       - `/api/leadgen/crm/future`: Retrieves upcoming opportunities
       - `/api/leadgen/crm/now`: Retrieves current opportunities
       - `/api/leadgen/crm/won`: Retrieves completed deals
       - `/api/leadgen/crm/[id]`: Operations on specific CRM records
     - **Leadgen Metrics Routes**:
       - `/api/leadgen/uw`: Retrieves UW-specific leadgen metrics
       - `/api/leadgen/fvr`: Retrieves FVR-specific leadgen metrics
   - **Test Route** (`/api/aitable-test`): Verifies AITable API connectivity

2. **ClickUp API Routes**:
   - **Tasks Route** (`/api/clickup/tasks`): 
     - Fetches tasks based on specified parameters
     - Handles pagination for large datasets
     - Implements rate limit handling (100 requests per minute)
   - **Task Detail Route** (`/api/clickup/tasks/[id]`): Fetches details for a specific task
   - **Create Task Route** (`/api/clickup/tasks`): Creates new tasks with POST method
   - **Update Task Route** (`/api/clickup/tasks/[id]`): Updates existing tasks with PATCH method

3. **Gemini API Routes**:
   - **Generate Content Route** (`/api/gemini/generate`): 
     - Generates content based on provided prompts
     - Selects appropriate model based on task requirements
     - Handles safety settings and parameter configuration
     - Returns AI-generated content with proper error handling
   - **Chat Route** (`/api/gemini/chat`): 
     - Maintains chat context for conversational interactions
     - Handles multi-turn conversations with context preservation
     - Returns chat responses with proper error handling
   - **Analyze Image Route** (`/api/gemini/image`): 
     - Processes multimodal inputs (text + image)
     - Returns analysis of image content with proper error handling

4. **Chargebee API Routes**:
   - **Subscription Management Route** (`/api/chargebee/subscription`):
     - Creates, retrieves, updates subscriptions
     - Handles customer-subscription relationships
     - Processes subscription lifecycle events
     - Returns subscription data with proper error handling
   - **Customer Management Route** (`/api/chargebee/customer`):
     - Creates, retrieves, updates customer information
     - Returns customer data with proper error handling
   - **Webhook Route** (`/api/chargebee/webhook`):
     - Receives and processes Chargebee webhook events
     - Handles subscription lifecycle events (creation, cancellation, etc.)
     - Updates internal state based on webhook events
     - Provides secure endpoint for Chargebee callbacks

5. **Financial Data Routes** (in development):
   - **Payments Route** (`/api/payments`): 
     - Will handle financial transaction data
     - Support CSV imports for Xolo financial data
     - Process transaction categorization
     - Map payments to projects (many-to-many relationships)
   - **Subscriptions Route** (`/api/subscriptions`):
     - Will manage recurring payment data
     - Track subscription status and renewal information
     - Integrate with Chargebee
     - Associate subscriptions with clients and projects

## Monitoring and Telemetry System
The system implements comprehensive monitoring and telemetry to track API usage, performance, and costs:

1. **Middleware-Based Telemetry**:
   - Implemented in src/middleware.ts
   - Intercepts all API requests for tracking
   - Records request metadata (path, method, timestamp)
   - Tracks response status and duration
   - Stores telemetry data in memory-based storage
   - Provides API for querying telemetry data
   - Authentication bypass detection for development mode

2. **API Telemetry Collection**:
   - Implemented in src/lib/api/telemetry.ts
   - Records API request patterns across all services
   - Tracks rate limit approaches and hits
   - Monitors cache effectiveness with hit/miss counters
   - Provides aggregated usage statistics
   - Support for custom telemetry events

3. **LLM Usage Monitoring**:
   - Specialized tracking for AI operations
   - Token usage counters (prompt and completion)
   - Cost estimation based on model and token usage
   - Performance metrics for AI operations
   - Usage pattern analysis for optimization

4. **Logging System**:
   - Structured logging for API operations
   - Error logging with contextual information
   - Debug mode toggling for development
   - Environment-specific log levels

5. **Planned Monitoring Dashboard**:
   - Grafana integration for visualization
   - API performance dashboards
   - Cache effectiveness metrics
   - Rate limit usage tracking
   - LLM cost management tools
   - Error rate and pattern analysis

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

## AITable Integration Components
The AITable integration components follow these patterns:

1. **DatePickerInput Component**:
   - **Data Editing**:
     - Provides a calendar interface for date selection
     - Handles AITable date field updates
     - Submits changes directly to the backend API
   - **Component State Management**:
     - Tracks loading state during API calls
     - Maintains original value for error recovery
     - Toggles editing mode with visual feedback
   - **User Interaction**:
     - Popover interface for calendar selection
     - Clear visual indication of editing state
     - Loading indicator during API operations
   - **Error Handling**:
     - Reverts to original value on API errors
     - Provides error callback for parent component notification
     - Maintains UI responsiveness during API operations

2. **URLInput Component**:
   - Similar architecture to DatePickerInput
   - Customized for URL field editing
   - Handles both simple and nested field structures
   - Provides popover interface for text entry
   - Implements cancel and save functionality

3. **AITableViewButton Component**:
   - Provides direct access to AITable records
   - Opens AITable record in a new browser tab
   - Configurable with view and datasheet IDs
   - Consistent styling with other action buttons

## Chargebee Integration Components
The Chargebee integration follows these patterns:

1. **API Client Implementation**:
   - Secure backend client in src/lib/api/chargebee.ts
   - Environment variable management for site and API keys
   - Core subscription management functions
   - Customer data retrieval and management
   - Webhook event processing
   - Comprehensive error handling

2. **Subscription Management**:
   - Creation of new subscriptions with customer/plan association
   - Retrieval of subscription information with pagination
   - Status tracking for subscription lifecycle (active, cancelled, etc.)
   - Customer-subscription relationship management

3. **Webhook Event Handling**:
   - Endpoint for receiving Chargebee events
   - Event type classification and processing
   - Subscription lifecycle event handling
   - Error handling and logging for webhook processing

4. **Error Handling**:
   - Standardized error codes and messages
   - API error classification and handling
   - Client response sanitization
   - Logging for debugging and monitoring

5. **Security Measures**:
   - Backend-only API credential access
   - All requests proxied through API routes
   - Environment variable storage for sensitive data
   - Request validation and sanitization

6. **Idempotent Operations**:
   - Idempotency key generation for critical operations
   - Replay detection for duplicate requests
   - Consistent state management across retries

## Gemini AI Integration
The Gemini AI integration follows these patterns:

1. **API Client Implementation**:
   - Secure backend client in src/lib/api/gemini.ts
   - Handles API key management and authentication
   - Supports different model selection
   - Configurable parameters for generation
   - Comprehensive error handling

2. **Model Selection Logic**:
   - Selects appropriate model based on task requirements
   - Supports various models (gemini-2.0-flash, gemini-2.0-flash-lite, etc.)
   - Optimizes for cost, performance, and capabilities
   - Configurable parameters for different use cases

3. **Content Generation**:
   - Structured prompts for different tasks
   - Context management for improved results
   - Parameter configuration (temperature, tokens, etc.)
   - Safety settings for appropriate content generation

4. **Chat Interface**:
   - Multi-turn conversation support
   - Context preservation between messages
   - History management for ongoing interactions
   - Error recovery for failed requests

5. **Image Analysis**:
   - Multimodal input processing (text + image)
   - Base64 encoding for image transfer
   - Secure file handling on the backend
   - Error handling for different input types

6. **Planned Applications**:
   - Transaction categorization for financial data
   - Project summary generation
   - Financial insights and recommendations
   - Data analysis and visualization assistance

## Rate Limiting Strategy
The system implements a comprehensive rate limiting strategy across all external API interactions:

1. **Request Throttling/Queuing System**:
   - Queue-based system to manage API request flow
   - Configurable concurrency limits for different endpoints
   - Priority system for critical vs. background operations
   - Implementation across all external APIs (AITable, ClickUp, Gemini, Chargebee)

2. **Retry Logic with Exponential Backoff**:
   - Detection of rate limit responses (429 errors)
   - Automatic retry with increasing delay between attempts
   - Configurable maximum retry attempts per endpoint
   - Error reporting for persistent failures

3. **Batch Request Processing**:
   - Combining multiple related requests where supported
   - Custom batching for endpoints without native support
   - Optimizing batch size vs. request frequency
   - Error handling for partial batch failures

4. **Caching Strategy**:
   - SWR implementation for client-side caching
   - Server-side caching for frequently accessed data
   - Configurable TTL based on data type and update frequency
   - Stale-while-revalidate pattern for improved UX

5. **Backend Proxy Architecture**:
   - All API requests routed through Next.js API routes
   - Rate monitoring and throttling at proxy level
   - Request tracking headers for debugging
   - Consistent error handling across all APIs

6. **Request Prioritization**:
   - Critical user-facing requests get priority queue placement
   - Background/admin operations handled with lower priority
   - Emergency override capability for critical operations
   - Configurable priority levels per endpoint and operation

7. **Performance Monitoring**:
   - Tracking of API request volume, timing, and rate limit hits
   - Logging infrastructure for request pattern analysis
   - Planned integration with monitoring dashboards
   - Alerts for rate limit approaches

## Financial Tracking Components (Planned)
The financial tracking components will follow these patterns:

1. **CSV Import Component**:
   - Secure file upload interface
   - Parsing logic for Xolo CSV format
   - Data normalization and validation
   - Error handling for invalid data

2. **Transaction Categorization**:
   - AI-powered classification using Gemini API
   - Training models for expense categorization
   - Matching incoming payments with projects/clients
   - Confidence scoring for categorization accuracy

3. **Payment-Project Mapping**:
   - Interface for allocating single payments across multiple projects
   - Many-to-many relationship management
   - Distribution percentage tracking
   - Audit trail of payment allocations

4. **Subscription Management**:
   - Chargebee integration for subscription data
   - Renewal tracking and alerting
   - Client and project association
   - Subscription lifecycle visualization
   - Webhook event processing for status updates

5. **Financial Reconciliation**:
   - Review interface for unmapped transactions
   - AI-powered suggestion logic for likely matches
   - Batch processing for similar transactions
   - Audit trail maintenance

## Error Handling Patterns
The system implements comprehensive error handling:
1. **API Error Categorization**: 
   - Different error types with specific status codes (401, 403, 404, 500)
   - Contextual error messages based on error type
   - Parsing of AITable API error responses
   - Handling of ClickUp API errors and rate limits
   - Processing of Gemini API errors and safety blocks
   - Handling of Chargebee API errors with proper status codes
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
5. **Data Editing Error Handling**:
   - Value reversion on API errors
   - Visual feedback during API operations
   - Error callbacks for parent component notification
6. **Rate Limit Error Recovery**:
   - Automatic retry with exponential backoff
   - Queue management for failed requests
   - Priority-based retry strategy
   - User feedback during delays
7. **Webhook Error Handling**:
   - Event validation and verification
   - Error logging for failed webhook processing
   - Graceful handling of unexpected event types
   - Retry logic for failed event processing

## Key Technical Decisions
- Next.js API routes act as a secure proxy for all external APIs (AITable, ClickUp, Gemini, Chargebee)
- Environment variables (.env.local) for all sensitive configuration
- Custom API clients with robust error handling for all external services
- Comprehensive rate limiting strategy across all external API interactions
- Relation field resolution (client and media buyer names) for AITable data
- Team-based grouping of projects with sorting by start date
- Tailwind CSS for styling with proper responsive design
- Record ID detection logic for AITable relation fields
- MetricsChart component for flexible data visualization
- Separate aggregation methods for different metric types (sum vs. average)
- Secure ClickUp integration for task management with rate limiting
- Gemini API integration for AI capabilities with model selection logic
- Direct AITable field editing with immediate API updates
- Popover interfaces for form inputs to maximize space efficiency
- Financial data management with CSV import and AI-powered categorization
- Planned SWR implementation for efficient data fetching and caching
- Comprehensive error handling with specific error types and messages
- Chargebee integration for subscription management with webhook handling
- Idempotent requests for critical operations using unique keys 