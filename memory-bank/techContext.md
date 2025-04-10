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
  - Custom ClickUp API client
  - Custom Google Gemini API client
  - Custom Chargebee API client
  - Firebase for authentication (planned implementation)
  - CSV parsing for financial data import (planned implementation)
  - AI/ML capabilities through Google Gemini API
- **Data Storage**:
  - AITable.ai for primary data (accessed via secure API)
  - ClickUp for task management data
  - Chargebee for subscription data
  - Environment variables for configuration (.env.local)
- **External Services Integration**:
  - AITable.ai for database functionality
  - ClickUp for task management
  - Google Gemini API for AI capabilities
  - Chargebee for subscription management
- **DevOps**:
  - To be determined for CI/CD pipeline
  - Planned deployment platform to be decided

## Development Environment
The development environment includes:
- Local development server with hot reloading (`npm run dev`)
- Environment variables in .env.local for configuration:
  - AITable.ai API token and table IDs
  - ClickUp API token and workspace configurations
  - Google Gemini API key
  - Chargebee site name and API key
- Development authentication bypass option for testing (to be implemented)
- Responsive design testing for multiple screen sizes

## Dependencies
Key dependencies include:
- **API Integration**:
  - Custom AITable.ai API client in src/lib/api/aitable.ts
  - Custom ClickUp API client in src/lib/clickup/api.ts
  - Custom Google Gemini API client in src/lib/api/gemini.ts
  - Custom Chargebee API client in src/lib/api/chargebee.ts
  - HTTP fetch for API requests with proper error handling
  - Comprehensive rate limiting implementation
- **Authentication**:
  - Firebase for authentication (to be implemented)
- **UI and Styling**:
  - Tailwind CSS for responsive styling
  - TypeScript for type-safe development
  - shadcn/ui components (Card, Button, Switch, Label, Popover, Input, Calendar)
- **Data Management**:
  - SWR for data fetching with caching (planned)
  - date-fns for date/time calculations and formatting
- **Data Visualization**:
  - Custom chart components (MetricsChart)
  - Configurable visualization settings
- **Financial Data Processing** (planned):
  - CSV parsing library for financial data imports
  - AI/ML capabilities through Google Gemini API for transaction categorization
  - Chargebee SDK for subscription management
- **Rate Limiting and Performance**:
  - Custom request throttling/queuing system
  - Retry logic with exponential backoff
  - Batch request processing
  - Comprehensive caching strategy
  - Request prioritization framework

## Technical Constraints
- Must securely store and transmit sensitive financial and client data
- AITable.ai API rate limits must be managed with proper caching
- ClickUp API rate limits (100 requests per minute per token) must be respected
- Google Gemini API quota limits must be managed
- Chargebee API must be properly proxied through backend to protect API keys
- Cross-browser compatibility is required
- Performance optimization for data fetching to minimize API calls
- Authentication and authorization must be properly implemented
- Mobile responsiveness is essential for all dashboard views
- Secure handling of API credentials using environment variables only
- Charts must be optimized for both weekly and monthly data aggregation
- Financial data imports must handle potential inconsistencies in CSV formats
- Transaction categorization must be accurate while maintaining privacy
- Many-to-many relationships between payments and projects require careful data modeling
- All external API requests must be proxied through backend endpoints

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
   - AITABLE_FVR_LEADGEN_TABLE_ID for FVR lead generation data

2. **Backend API implementation**:
   - Custom API client in src/lib/api/aitable.ts with comprehensive error handling
   - Type definitions for AITableProject, AITableClient, AITableMember
   - API routes in src/app/api/projects and src/app/api/clients
   - Secure proxy to protect API credentials
   - Validation of configuration before making requests
   - Error handling with specific status codes and messages
   - Rate limiting implementation to prevent API quota issues

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

6. **Status Management Components**:
   - StageDropdown component for managing project stages
   - CRMStageDropdown component for advanced CRM status management
   - Integration with backend API for status updates

7. **Data Input Components**:
   - DatePickerInput component for date field editing
   - URLInput component for URL field editing with nested field support
   - AITableViewButton component for direct AITable record access
   - Integration with backend API for field updates with proper loading state management

## ClickUp Integration
The ClickUp integration has been implemented with:

1. **Environment variables for secure access**:
   - CLICKUP_API_TOKEN for authentication
   - Additional configuration for workspaces and lists

2. **Backend API implementation**:
   - Custom API client in src/lib/clickup/api.ts with comprehensive error handling
   - Type definitions in src/lib/clickup/types.ts
   - API routes in src/app/api/clickup
   - Secure proxy to protect API credentials
   - Handling of ClickUp's rate limits (100 requests per minute)
   - Error handling with specific status codes and messages
   - Rate limiting implementation to prevent API quota issues

3. **Data fetching functions**:
   - getTasksByList() for retrieving tasks from a specific list
   - getTask() for retrieving a single task by ID
   - createTask() for creating new tasks
   - updateTask() for updating existing tasks
   - Additional utilities for managing task status and assignments

4. **Examples and References**:
   - Example implementations in src/lib/clickup/examples.js
   - Documentation of common patterns for ClickUp API usage
   - Reference code for integration with project management

## Gemini AI Integration
The Gemini AI integration has been implemented with:

1. **Environment variables for secure access**:
   - GEMINI_API_KEY for authentication
   - Additional configuration for model selection and parameters

2. **Backend API implementation**:
   - Custom API client in src/lib/api/gemini.ts with comprehensive error handling
   - API routes in src/app/api/gemini
   - Secure proxy to protect API credentials
   - Handling of API quota limits
   - Error handling with specific status codes and messages
   - Safety settings for content generation

3. **Model selection**:
   - Support for different Gemini models based on task requirements:
     - gemini-2.0-flash: General purpose, voice AI, multimodal capabilities
     - gemini-2.0-flash-lite: High-frequency, low-latency, cost-sensitive applications
     - gemini-2.5-pro-exp-03-25: Complex reasoning, advanced coding (experimental)
     - gemini-1.5-pro: Analyzing large documents, long conversations, multimodal input
   - Optimization for cost, performance, and capabilities

4. **Content generation functions**:
   - generateContent() for text generation based on prompts
   - chatConversation() for multi-turn conversations
   - analyzeImage() for multimodal inputs (text + image)
   - Configuration options for temperature, token limits, etc.

5. **Planned applications**:
   - Transaction categorization for financial data
   - Project summary generation for dashboards
   - Financial insights and recommendations
   - Data analysis assistance for reporting

## Chargebee Integration
The Chargebee integration has been implemented with:

1. **Environment variables for secure access**:
   - CHARGEBEE_SITE_NAME for identifying the Chargebee site
   - CHARGEBEE_API_KEY for authentication
   - CHARGEBEE_TEST_SITE_NAME and CHARGEBEE_TEST_API_KEY for testing

2. **Backend API implementation**:
   - Custom API client in src/lib/api/chargebee.ts with comprehensive error handling
   - API routes in src/app/api/chargebee
   - Secure proxy to protect API credentials
   - Error handling with specific status codes and messages
   - Webhook endpoint for handling Chargebee events

3. **Core functions**:
   - createSubscription() for creating new subscriptions
   - getCustomer() for retrieving customer information
   - listCustomerSubscriptions() for listing a customer's subscriptions
   - processWebhook() for handling Chargebee webhook events
   - getAllSubscriptions() for retrieving all subscriptions with pagination

4. **Pattern implementation**:
   - Idempotent requests using idempotency keys for critical operations
   - Standardized error handling with proper HTTP status codes
   - Pagination handling for list operations
   - Type-safe API interactions

5. **Cursor rules**:
   - Comprehensive documentation in .cursor/rules/chargebee-rules.mdc
   - Examples of common patterns and best practices
   - Type definitions for Chargebee entities
   - Integration guidelines for consistent implementation

6. **Security measures**:
   - All API credentials stored only in environment variables
   - Backend-only access to API credentials
   - API requests proxied through Next.js API routes
   - Error messages sanitized for client responses

## Rate Limiting Strategy
The rate limiting strategy has been designed to manage API usage across all external services:

1. **Request throttling/queuing system**:
   - Queue-based architecture to manage API request flow
   - Configurable concurrency limits for different endpoints
   - Priority system for user-facing vs. background operations
   - Implementation across all external APIs (AITable, ClickUp, Gemini, Chargebee)

2. **Retry logic with exponential backoff**:
   - Detection of rate limit responses (429 errors)
   - Automatic retry with increasing delay between attempts
   - Configurable maximum retry attempts
   - Error reporting for persistent failures

3. **Batch request processing**:
   - Combining related requests where API supports it
   - Custom batching for endpoints without native support
   - Optimization of batch size vs. request frequency
   - Error handling for partial batch failures

4. **Caching strategy**:
   - SWR for client-side caching with revalidation
   - Server-side caching for frequently accessed data
   - Configurable TTL based on data type and update frequency
   - Stale-while-revalidate pattern for improved user experience

5. **Backend proxy architecture**:
   - All API requests routed through Next.js API routes
   - Rate monitoring and throttling at the proxy level
   - Headers for request tracking and debugging
   - Consistent error handling across all APIs

6. **Request prioritization**:
   - Critical user-facing requests get priority queue placement
   - Background operations handled with lower priority
   - Emergency override capability for critical operations
   - Configurable priority levels per endpoint

7. **Performance monitoring**:
   - Tracking of API request volume, timing, and rate limit hits
   - Logging infrastructure for request pattern analysis
   - Planned monitoring dashboard integration
   - Alerts for approaching rate limits

## Financial Data Management (In Development)
The financial data management features are being implemented with:

1. **API Routes for Financial Data**:
   - Payments route in src/app/api/payments for handling financial transactions
   - Subscriptions route in src/app/api/subscriptions for managing recurring payments with Chargebee integration
   - Operations section in the application for financial management interfaces

2. **Planned Implementation Components**:
   - CSV import functionality for Xolo financial data
   - Parsing and normalization of financial transaction data
   - AI-powered transaction categorization using Gemini API
   - Many-to-many relationship management for payment-project mapping
   - Subscription tracking with Chargebee integration
   - Financial reconciliation workflow

3. **Technical Approach**:
   - Secure backend processing for all financial data
   - Database model for complex payment-project relationships
   - AI/ML pipeline using Gemini API for transaction categorization
   - Audit trail for all financial operations
   - Export capabilities for financial reports
   - Integration with Chargebee for subscription lifecycle management

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

2. **FVRLeadgenMetricsChart**:
   - Similar to UWLeadgenMetricsChart but for FVR-specific metrics
   - Shares core functionality with customizations for FVR data
   - Includes FVR-specific metric calculations and visualization

3. **MetricsChart**:
   - Reusable chart component for visualizing metric data
   - Supports line charts with configurable properties
   - Handles both weekly and monthly data visualization
   - Accepts data points with multiple metrics
   - Provides custom formatting options for different metric types
   - Optimized for performance with large datasets

4. **DateRangeSelector**:
   - Reusable component for selecting date ranges
   - Integrated with metrics charts for filtering data
   - Emits range change events for parent components to react

5. **Project Management Components**:
   - StageDropdown for managing project stages
   - CRMStageDropdown for advanced CRM integration
   - ActiveProjects for team-based project organization
   - Navigation for intuitive app sections access

6. **AITable Integration Components**:
   - DatePickerInput for date field editing with calendar interface
   - URLInput for URL field editing with validation
   - AITableViewButton for direct AITable record access

7. **Planned Financial Visualization**:
   - Gross margin charts at project, team, and company levels
   - Project count visualization per team
   - PnL reporting with multi-level analysis
   - Subscription tracking and renewal visualization with Chargebee data
   - Payment allocation visualization for project distribution 