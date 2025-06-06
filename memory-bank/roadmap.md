# Project Roadmap

## Overview
This document tracks our implementation roadmap, decisions, and progress for the Texonica.com dashboard project. It serves as both a changelog and a discussion forum for implementation approaches.

## Roadmap Phases

### Phase 1: Core Infrastructure (Completed)
- [x] Explore AITable.ai API capabilities and limitations
  - Discussion: What specific bases and tables will we need? What are the authentication requirements?
  - Decision: Use AITable.ai API with custom client implementation
  - Implementation Notes: Created API client in src/lib/api/aitable.ts with proper error handling
- [x] Design backend architecture for AITable.ai integration
  - Discussion: How will we handle API keys securely? What caching strategy will we use?
  - Decision: Use Next.js API routes as a secure proxy for AITable.ai API calls; store API keys in environment variables
  - Implementation Notes: Implemented in src/app/api/projects and src/app/api/clients
- [ ] Create authentication system design
  - Discussion: What auth method best balances security with usability for Texonica staff?
  - Decision: Use Firebase for authentication with optional dev bypass
  - Implementation Notes: Initial Firebase setup in src/lib/firebase.ts
- [x] Set up development environment
  - Discussion: What local setup will best match production while maintaining developer productivity?
  - Decision: Next.js development server with environment variables
  - Implementation Notes: Created .env.local for configuration

### Phase 2: Basic Dashboard Framework (Completed)
- [ ] Implement user authentication
  - Discussion: How to balance security with ease of use?
  - Decision: Firebase authentication with development bypass for testing
  - Implementation Notes: Created AuthWrapper, ProtectedRoute, and RoleProtected components
- [x] Create dashboard layout and navigation
  - Discussion: What layout best organizes the various data panels?
  - Decision: Sidebar navigation with main content area
  - Implementation Notes: Created Navigation and DashboardContent components
- [x] Develop core UI components
  - Discussion: What component library provides the most flexibility?
  - Decision: Use shadcn/ui and Radix for accessible components with Tailwind styling
  - Implementation Notes: Set up component library and implemented basic UI
- [x] Implement secure API proxy for AITable.ai
  - Discussion: How to securely handle API credentials?
  - Decision: Environment variables for API keys; Next.js API routes for secure proxy
  - Implementation Notes: Created API routes for projects and clients
- [x] Add project display on home page
  - Discussion: How should projects be organized for easy viewing?
  - Decision: Group by team and sort by start date
  - Implementation Notes: Implemented ActiveProjects component with team grouping
- [x] Add leadgen metrics visualization
  - Discussion: What metrics are most important to display?
  - Decision: Organize metrics into functional categories with toggle visibility
  - Implementation Notes: Created UWLeadgenMetricsChart and FVRLeadgenMetricsChart components

### Phase 2.5: External API Integration (Current)
- [x] Implement ClickUp API integration
  - Discussion: How to securely integrate with ClickUp for task management?
  - Decision: Create custom ClickUp client with secure proxying
  - Implementation Notes: Implemented in src/lib/clickup with API routes in src/app/api/clickup
- [x] Implement Google Gemini API integration
  - Discussion: How to leverage AI capabilities securely?
  - Decision: Create custom Gemini client with secure proxying and model selection
  - Implementation Notes: Implemented in src/lib/api/gemini.ts with API routes in src/app/api/gemini
- [x] Design comprehensive rate limiting strategy
  - Discussion: How to handle rate limits across multiple external APIs?
  - Decision: Implement advanced request management with throttling, queuing, batching, and caching
  - Implementation Notes: Designed architecture with request throttling, retry logic, batch processing, and caching
- [ ] Implement SWR for data fetching and caching
  - Discussion: How to optimize data fetching while respecting API rate limits?
  - Decision: Use SWR pattern for efficient client-side caching with revalidation
  - Implementation Notes: Started implementation with stale-while-revalidate pattern

### Phase 3: Financial Reporting Panels (Current)
- [ ] Define key financial metrics and KPIs
  - Discussion: What metrics are most important for Texonica's financial tracking?
  - Decision: Focus on gross margin (profit minus real cost) at project, team, and company levels
  - Implementation Notes: Need to ensure data model supports multi-level financial analysis
- [ ] Design financial reporting UI
  - Discussion: How to present financial data clearly and intuitively?
  - Decision: Include dedicated views for gross margin analysis and team project counts
  - Implementation Notes: Create visualizations for profit/cost metrics and team distribution
- [ ] Implement data visualization components
  - Discussion: What visualization types best represent financial data?
  - Decision: Use Tremor and D3.js for data visualization
  - Implementation Notes: Initial D3.js setup in package.json
- [ ] Create export functionality
  - Discussion: What export formats are most useful?
  - Decision: Support CSV export for data analysis in external tools
  - Implementation Notes: Planning export functionality with proper formatting
- [ ] Implement PnL reporting requirements
  - Discussion: What specific financial insights are needed for business decisions?
  - Decision: Key metrics must include:
    • Gross margin (profit minus real cost) per project, per team, and company-wide
    • Number of active projects per team for resource allocation analysis
  - Implementation Notes: Will require data aggregation capabilities across project hierarchies
- [ ] Implement Xolo CSV Import System
  - Discussion: How to efficiently import financial data without integrating multiple payment systems?
  - Decision: Use Xolo's CSV export as primary financial data source
  - Implementation Notes: Build secure upload interface, CSV parser, and data normalization pipeline
- [ ] Develop AI Categorization Engine
  - Discussion: How to automatically categorize and assign financial transactions?
  - Decision: Implement AI-powered categorization using Google Gemini API
  - Implementation Notes: Design prompt engineering for transaction categorization with Gemini models
- [ ] Create Client-Payment-Project Mapping
  - Discussion: How to handle payments that apply to multiple projects?
  - Decision: Implement many-to-many relationship model between payments and projects
  - Implementation Notes: Build allocation interface to distribute single payments across multiple projects
- [ ] Integrate Subscription Management
  - Discussion: How to track recurring payments and subscriptions?
  - Decision: Build Chargebee connector to identify subscription payments
  - Implementation Notes: Develop subscription registry tracking renewal frequency, client associations, and project allocations
- [ ] Build Financial Reconciliation Workflow
  - Discussion: How to handle unmatched or ambiguous transactions?
  - Decision: Create review interface with AI-powered suggestion logic using Gemini API
  - Implementation Notes: Implement batch processing for similar transactions and maintain audit trail

### Phase 3.5: Monitoring and Observability (New)
- [x] Design telemetry system for API usage tracking
  - Discussion: How to monitor API usage, performance, and costs?
  - Decision: Implement middleware-based telemetry with memory storage
  - Implementation Notes: Created src/middleware.ts with API request tracking and src/lib/api/telemetry.ts for data collection
- [x] Implement LLM usage monitoring
  - Discussion: How to track Gemini API costs and performance?
  - Decision: Create specialized monitoring for token usage and costs
  - Implementation Notes: Added LLM usage tracking in telemetry module
- [ ] Set up Grafana integration
  - Discussion: What metrics are most important to visualize?
  - Decision: Focus on API performance, cache effectiveness, rate limits, and LLM costs
  - Implementation Notes: Planning metrics export for Grafana dashboards
- [ ] Implement server-side caching metrics
  - Discussion: How to measure cache hit rates and performance impacts?
  - Decision: Add cache tracking to middleware telemetry
  - Implementation Notes: Design cache tracking with hit/miss counters and performance gains
- [ ] Create monitoring dashboards
  - Discussion: What specific views are needed for operations monitoring?
  - Decision: Create dedicated dashboards for:
    • API performance and rate limits
    • LLM usage and costs
    • Cache effectiveness
    • Error rates and types
  - Implementation Notes: Design Grafana dashboard templates

### Phase 3.6: Payment Processing (Current)
- [ ] Implement payment processing logic
  - Discussion: How to handle payment processing across different payment systems?
  - Decision: Implement payment processing logic in backend services
  - Implementation Notes: Planning implementation with payment gateway integration

### Phase 3.61: CSV Payment Import & Reconciliation System (New)
- [ ] Phase 1: Core CSV Import Foundation
  - [x] Update Payment Schema
    - Add `PaymentDirection` field (DBIT/CRDT)
    - Add `PaymentSource` enum (Stripe, Wire, PayPal)
    - Add `BankAccount` identifier field
    - Add `RawSender` field to preserve original name
  - [ ] Basic CSV Parser Enhancement
    - Update `parseCSVData()` to detect payment source based on description and bank account
    - Implement pattern detection for Stripe/Chargebee references
    - Extract transaction identifiers where available
  - [ ] Client-Only Mapping Logic
    - Create simple name-matching function for sender to client
    - Implement client name normalization for better matching
    - Store mapping preferences for repeat senders

- [ ] Phase 2: Source-Specific Processing
  - [ ] Stripe/Chargebee Integration
    - Extract Chargebee IDs from transaction descriptions
    - Match with existing subscriptions via ChargebeeId field
    - Update `chargebee-sync.ts` to handle payment matching
  - [ ] Wire Transfer Handler
    - Create bank account identification mapping
    - Build sender name normalization for wire transfers
    - Implement client matching based on previous transfers
  - [ ] PayPal Handler
    - Extract PayPal transaction IDs and emails
    - Match email addresses to client records
    - Handle PayPal fee identification in amounts

- [ ] Phase 3: User Interface & Reconciliation
  - [ ] Import UI Improvements
    - Add payment source detection display
    - Show client matches before final import
    - Add confidence indicators for matches
    - Allow manual client assignment for low-confidence matches
  - [ ] Reconciliation Dashboard
    - Update to include payment source filtering
    - Add bank account analysis view
    - Implement variance calculation by payment source
    - Create client statement view showing all payment sources

- [ ] Phase 4: Data Quality & Automation
  - [ ] Client Name Mapping System
    - Build persistent mapping database between sender names and clients
    - Create admin interface to review and approve mappings
    - Implement auto-learning from manual corrections
  - [ ] Reporting & Analytics
    - Add payment source distribution charts
    - Create monthly reconciliation reports
    - Build payment pattern detection for anomalies
    - Implement export functionality for accounting

### Phase 3.7: CRM Enhancements (New)
- [ ] Implement duplicate call detection for CRM
  - Discussion: How to identify and handle duplicate bookings from the same person?
  - Decision: Detect users who book multiple calls within 7 days and keep only one call record
  - Implementation Notes: Implement detection logic in API endpoint with configurable time window
- [ ] Create unified contact tracking system
  - Discussion: How to track unique contacts accurately across multiple interactions?
  - Decision: Use AI-powered contact matching to identify duplicates from UW/Underwriting
  - Implementation Notes: Plan implementation with AITable relation fields for consolidated tracking
- [ ] Implement CRM record metrics dashboard
  - Discussion: How to track the quality and completeness of our CRM data?
  - Decision: Create metrics showing total records, records with emails, and records with phone numbers
  - Implementation Notes: Add analytics component to CRM page with real-time data quality indicators
- [ ] Implement 4s task pacing tracker for UW
  - Discussion: How to track progress against the goal of 2 4s tasks per month for UW?
  - Decision: Create pacing tracker based on hire dates to monitor 4s task completion rate
  - Implementation Notes: Build visualization showing actual vs target 4s task completion with timing indicators

### Phase 4: Additional Department Panels (Planned)
- [ ] Marketing performance dashboard
  - Discussion: What metrics should be included for marketing insights?
  - Decision: Include campaign performance, conversion rates, and ROI analysis
  - Implementation Notes: Planning integration with marketing data sources
- [ ] Account management dashboard
  - Discussion: What client information is most critical for account managers?
  - Decision: Include client health metrics, project statuses, and communication logs
  - Implementation Notes: Planning relationship between client data and project metrics
- [ ] Operations dashboard
  - Discussion: What operational metrics are needed for resource planning?
  - Decision: Include team workload, project timelines, and resource allocation
  - Implementation Notes: Planning integration with ClickUp for task data

### Phase 5: Advanced Features (Planned)
- [ ] Custom reporting tools
  - Discussion: How to enable flexible report creation?
  - Decision: Create report builder with savable configurations
  - Implementation Notes: Planning data export and visualization tools
- [ ] Advanced analytics
  - Discussion: What deeper insights would benefit decision-making?
  - Decision: Implement AI-powered analytics using Google Gemini
  - Implementation Notes: Planning integration with financial and project data
- [ ] Alerts and notifications
  - Discussion: What events should trigger notifications?
  - Decision: Include payment events, deadline approaches, and anomaly detection
  - Implementation Notes: Planning notification system with customizable rules
- [ ] Mobile optimization
  - Discussion: What mobile use cases are most important?
  - Decision: Prioritize key dashboard views for mobile users
  - Implementation Notes: Planning responsive design enhancements

## Current Sprint Focus
We are currently focusing on:
1. Implementing financial tracking features with API endpoints for payments and subscriptions
2. Developing the rate limiting strategy implementation across all external APIs
3. Creating the Google Gemini integration for AI-powered features
4. Designing the CSV import functionality for Xolo financial data
5. Enhancing the project display with improved data visualization
6. Implementing duplicate call detection in the CRM to track unique contacts from UW/Underwriting
7. Adding CRM metrics dashboard to track total records, records with emails, and phone numbers
8. Creating 4s task pacing tracker for UW (2 tasks per month, based on hire dates)

## Implementation Discussions

### AITable.ai Integration Strategy
We are using a custom AITable API client implemented in src/lib/api/aitable.ts. This client handles authentication, error handling, and data retrieval. All AITable API calls are proxied through Next.js API routes to keep API keys secure. We've configured environment variables for the API token and table IDs (Projects, Clients, Members, UW Leadgen, FVR Leadgen).

### ClickUp Integration Strategy
We've implemented a custom ClickUp API client in src/lib/clickup/api.ts with proper error handling and type definitions. All ClickUp API calls are proxied through Next.js API routes in src/app/api/clickup to protect API credentials. We're handling rate limits (100 requests per minute) with proper request management and implementing our comprehensive rate limiting strategy.

### Google Gemini Integration Strategy
We've implemented a custom Google Gemini API client in src/lib/api/gemini.ts with model selection logic and proper error handling. All Gemini API calls are proxied through Next.js API routes in src/app/api/gemini to protect API credentials. We're using different models for different tasks based on their requirements, optimizing for cost, performance, and capabilities.

### Rate Limiting Strategy
We've designed a comprehensive rate limiting strategy to optimize API usage across all external services (AITable, ClickUp, Gemini). This includes request throttling/queuing, retry logic with exponential backoff, batch request processing, extensive caching, request prioritization, and performance monitoring. Implementation is proceeding with a focus on critical user-facing operations first.

### Authentication Approach
We're using Firebase for authentication with components like AuthWrapper, ProtectedRoute, and RoleProtected to manage access. For development, we've implemented a bypass option to simplify testing.

### UI/UX Strategy
We're using Next.js with shadcn/ui, Radix UI, and Tailwind CSS for a modern, responsive interface. The dashboard uses a sidebar navigation with content panels for different data views. We've implemented several specialized components for data interaction and visualization.

### Financial Data Strategy
We're developing API endpoints for payments and subscriptions, with plans to implement CSV import for Xolo financial data. We'll use Google Gemini API for transaction categorization and implement a many-to-many relationship model for payment-project mapping. We'll create a financial reconciliation workflow with AI-powered suggestions for transaction matching.

## Changelog
| Date | Version | Changes |
|------|---------|---------|
| 4/1/2023 | 0.1 | Initial roadmap created |
| 4/2/2023 | 0.2 | Updated with AITable integration progress |
| 4/3/2023 | 0.3 | Added ClickUp integration details |
| 4/4/2023 | 0.4 | Added Google Gemini integration and rate limiting strategy |
| 4/5/2023 | 0.5 | Added CRM duplicate call detection feature requirement |

## Decisions Log
| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|-------------------------|
| 4/1/2023 | Use Next.js with API routes | Simplified architecture with unified frontend/backend | Separate backend service |
| 4/1/2023 | Use Firebase for auth | Easy integration, supports required auth features | Custom auth system, Auth0 |
| 4/2/2023 | Custom AITable client | More control over error handling and data transformation | Using third-party client |
| 4/3/2023 | Custom ClickUp client | Better handling of rate limits and error responses | Using third-party client |
| 4/4/2023 | Custom Gemini client | Model selection flexibility and secure credential handling | Using third-party client |
| 4/4/2023 | Comprehensive rate limiting | Prevent API quota issues across all external services | Independent rate limiting per API |
| 4/4/2023 | AI-powered transaction categorization | Automate financial data processing with high accuracy | Manual categorization, rule-based system |
| 4/5/2023 | CRM duplicate call detection | Accurately track unique contacts by eliminating duplicates within 7 days | Manual review, maintaining all duplicate records |

TEMPORARY_API_KEY=your_secure_random_string
NEXT_PUBLIC_TEMPORARY_API_KEY=your_secure_random_string 

import { recordLLMUsage } from '@/lib/api/telemetry';

// After a successful Gemini API call
recordLLMUsage('/api/gemini/completion', 'gemini-1.5-pro', promptTokens, completionTokens, estimatedCost); 