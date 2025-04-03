# Project Roadmap

## Overview
This document tracks our implementation roadmap, decisions, and progress for the Texonica.com dashboard project. It serves as both a changelog and a discussion forum for implementation approaches.

## Roadmap Phases

### Phase 1: Core Infrastructure (Current)
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

### Phase 2: Basic Dashboard Framework (Current)
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

### Phase 3: Financial Reporting Panels (Next)
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
  - Decision:
  - Implementation Notes:
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
  - Decision: Implement ML-based classification system for expenses and income
  - Implementation Notes: Train models to categorize expenses and match incoming payments with projects/clients
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
  - Decision: Create review interface with suggestion logic for likely project/client matches
  - Implementation Notes: Implement batch processing for similar transactions and maintain audit trail

### Phase 4: Additional Department Panels
- [ ] Marketing performance dashboard
  - Discussion:
  - Decision:
  - Implementation Notes:
- [ ] Account management dashboard
  - Discussion:
  - Decision:
  - Implementation Notes:
- [ ] Operations dashboard
  - Discussion:
  - Decision:
  - Implementation Notes:

### Phase 5: Advanced Features
- [ ] Custom reporting tools
  - Discussion:
  - Decision:
  - Implementation Notes:
- [ ] Advanced analytics
  - Discussion:
  - Decision:
  - Implementation Notes:
- [ ] Alerts and notifications
  - Discussion:
  - Decision:
  - Implementation Notes:
- [ ] Mobile optimization
  - Discussion:
  - Decision:
  - Implementation Notes:

## Current Sprint Focus
We are currently focusing on completing the Active Projects display on the home page, including:
- Retrieving and displaying project data from AITable
- Showing team members associated with each project
- Calculating and displaying the months active for each project
- Implementing sorting and filtering functionality

## Implementation Discussions

### AITable.ai Integration Strategy
We are using a custom AITable API client implemented in src/lib/api/aitable.ts. This client handles authentication, error handling, and data retrieval. All AITable API calls are proxied through Next.js API routes to keep API keys secure. We've configured environment variables for the API token and table IDs (Projects, Clients, Members).

### Authentication Approach
We're using Firebase for authentication with components like AuthWrapper, ProtectedRoute, and RoleProtected to manage access. For development, we've implemented a bypass option to simplify testing.

### UI/UX Strategy
We're using Next.js with shadcn/ui, Radix UI, and Tailwind CSS for a modern, responsive interface. The dashboard uses a sidebar navigation with content panels for different data views.

## Changelog
| Date | Version | Changes |
|------|---------|---------|
| 4/1/2023 | 0.1 | Initial roadmap created |
| 4/2/2023 | 0.2 | Updated with AITable integration progress |

## Decisions Log
| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|-------------------------|
| 4/1/2023 | Use Next.js with API routes | Simplified architecture with unified frontend/backend | Separate backend service |
| 4/1/2023 | Use Firebase for auth | Easy integration, supports required auth features | Custom auth system, Auth0 |
| 4/2/2023 | Custom AITable client | More control over error handling and data transformation | Using third-party client | 