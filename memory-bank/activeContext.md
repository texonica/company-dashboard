# Active Context

## Current Focus
We are implementing financial tracking features, enhancing the project management interface, and integrating external API services for the Texonica.com dashboard. We have established secure connections to AITable.ai API, ClickUp API, Google Gemini API, and Chargebee API through backend routes to retrieve and manage project, client, leadgen, task, and subscription data. All the backend API routes have been implemented with comprehensive error handling.

Recent logs indicate active development and usage of the leadgen API routes, particularly the `/api/leadgen/crm/future` and `/api/leadgen/uw` endpoints, which are retrieving data from AITable.ai. The API telemetry system is successfully tracking these requests.

We have several key components for improved data entry and interaction:
- DatePickerInput component for date field editing with calendar interface
- URLInput component for URL field editing with validation
- AITableViewButton component for direct AITable record access
- StageDropdown and CRMStageDropdown components for project status management
- UWLeadgenMetricsChart and FVRLeadgenMetricsChart for interactive lead generation metrics

Our current focus areas include:
1. Financial tracking features with API endpoints for payments and subscriptions
2. PnL tracking system with CSV import for Xolo financial data
3. AI capabilities using Google Gemini API integration
4. Implementing our comprehensive rate limiting strategy across all external APIs
5. Monitoring and observability tools for API usage tracking
6. Developing payment processing logic for handling different payment systems
7. Enhancing data visualization with customizable chart components
8. Optimizing leadgen API performance and data handling
9. Subscription management through Chargebee integration

## Recent Changes
- Expanded leadgen API endpoints with specialized routes for different data views (now, future, won)
- Implemented API telemetry system to track request patterns and performance
- Integrated Google Gemini API with secure backend proxying
- Implemented comprehensive rate limiting strategy design for all external APIs
- Added middleware-based telemetry with memory storage for API usage tracking
- Implemented LLM usage monitoring for Gemini API costs and performance
- Enhanced DatePickerInput component with improved loading state feedback
- Optimized URLInput component for better user experience with validation
- Added AITableViewButton component for direct AITable record access
- Enhanced CRMStageDropdown component for improved project management
- Updated StageDropdown component with better loading state feedback
- Improved ActiveProjects component with better error handling and performance
- Optimized leadgen metrics charts for better performance with large datasets
- Enhanced chart rendering capabilities for different data visualization needs
- Implemented backend proxy API routes for all external services (AITable, ClickUp, Gemini)
- Started implementation of payments and subscriptions API endpoints
- Designed financial data import workflow for Xolo CSV data
- Planned transaction categorization system with AI/ML capabilities
- Created structure for many-to-many payment-project relationship modeling
- Integrated Chargebee API for subscription management with secure backend proxying
- Implemented Chargebee client library with key subscription management functions
- Created comprehensive Chargebee rules documentation for consistent integration patterns
- Added webhook endpoint for Chargebee events to handle subscription lifecycle events

## Next Steps
- Complete the payments and subscriptions API endpoints integration with Chargebee
- Implement CSV import functionality for Xolo financial data with the new comprehensive plan:
  - Update Payment Schema with direction, source, and sender fields
  - Enhance CSV Parser to detect payment sources (Stripe, Wire, PayPal)
  - Implement client-only mapping logic with name normalization
  - Create source-specific handlers for Stripe/Chargebee, Wire, and PayPal
  - Add import UI improvements with client matching and confidence indicators
  - Update reconciliation dashboard for payment source filtering
  - Build client name mapping system with persistent storage
  - Develop payment analytics with source distribution tracking
- Create financial reporting panels with:
  - Gross margin calculation at project, team, and company levels
  - Project count visualization per team
  - PnL reporting with multi-level analysis
- Develop AI-powered features using Gemini API:
  - Transaction categorization
  - Project summary generation
  - Financial insights and recommendations
- Implement the complete rate limiting strategy with:
  - Request throttling/queuing
  - Retry logic with exponential backoff
  - Batch request processing
  - Comprehensive caching
  - Request prioritization
- Create LLM provider middleware for abstracting multiple AI services:
  - Implement Claude and OpenAI providers
  - Design unified interface for all LLM interactions
  - Build provider factory pattern for easy switching
- Set up Grafana integration for monitoring API performance, cache effectiveness, and LLM costs
- Implement server-side caching metrics for tracking hit rates and performance impacts
- Create monitoring dashboards for operations management
- Enhance the active projects display with:
  - Months active calculation based on start date
  - Additional filtering options
  - Improved sorting capabilities
- Create subscription management interface using Chargebee integration
- Implement subscription analytics and visualization
- Implement authentication with Firebase
- Set up role-based access control
- Optimize data fetching with SWR caching
- Add additional data visualizations for key metrics
- Implement testing infrastructure
- Create detailed client views
- Implement export functionality for reports and visualizations
- Integrate ClickUp tasks with project management views

## Active Decisions
We need to determine the best approach for:
- CSV import and parsing strategy for Xolo financial data, specifically:
  - Design of enhanced payment schema with directional and source tracking
  - Pattern recognition rules for identifying payment sources
  - Client name normalization algorithms for better matching
  - Confidence scoring system for client matches
  - UI workflow for reviewing and confirming matches
  - Persistent mapping storage structure
- Data model for many-to-many payment-project relationships
- AI integration strategy using Gemini API for various features
- LLM provider abstraction middleware design (after implementing Claude and OpenAI)
- Subscription tracking model and integration with Chargebee
- Chargebee webhook handling and event processing
- Financial reconciliation workflow UI and logic
- Implementation of the comprehensive rate limiting strategy
- Caching strategy optimization using SWR
- User interface design for financial reporting panels
- Dashboard layout customization for different user roles
- Authentication implementation with Firebase
- Data refresh strategy (manual vs. automatic)
- Calculation and display of project duration (months active)
- Integration of ClickUp tasks with project management workflow
- Performance optimization for chart components with large datasets
- Testing strategy for ensuring reliability and security
- Metrics to include in monitoring dashboards
- API usage tracking and visualization approach
- LLM cost management and optimization strategy
- Leadgen data aggregation approach for different time-based views
- Subscription management workflow and UI design
- Synchronization between Chargebee subscription data and AITable records

## Open Questions
- What patterns in CSV transaction descriptions can reliably identify payment sources?
- What client name normalization techniques will yield the highest match accuracy?
- How can we design an intuitive UI for confirming client matches during import?
- What confidence threshold should trigger manual review of client matches?
- How should we store and manage the growing database of sender-to-client mappings?
- What is the most efficient way to import and parse Xolo CSV data?
- How should we structure the data model for handling payments that apply to multiple projects?
- What prompts and parameters will work best for Gemini API integration?
- How should we implement the transaction categorization system using AI?
- What is the optimal implementation of our rate limiting strategy?
- How should we handle subscription tracking and integrate with Chargebee?
- What webhook events should we prioritize for Chargebee integration?
- How should we handle idempotency for critical Chargebee operations?
- What UI approach will work best for the financial reconciliation workflow?
- What specific financial metrics should be prioritized for the first release?
- How should we optimize the performance of chart components with large datasets?
- What's the best approach for implementing SWR caching for all API data?
- How should we design the user experience for financial data import and categorization?
- What level of automation is appropriate for transaction categorization?
- How should we structure the testing infrastructure to ensure reliability?
- What authentication roles and permissions are needed for different user types?
- How should we design the export functionality for reports and visualizations?
- What metrics are most important to track in our monitoring dashboards?
- How can we optimize LLM usage costs while maintaining functionality?
- What approach should we take for implementing payment processing logic?
- How can we improve leadgen data retrieval performance for different time-based views?
- How should we display subscription information and integrate it with client records?
- What is the optimal way to synchronize Chargebee data with our internal data model? 