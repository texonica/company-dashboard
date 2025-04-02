# Technical Context

## Technologies Used
- **Frontend**: 
  - Next.js 15.x (App Router) for the application framework
  - React 18 for UI components
  - Tailwind CSS for styling
  - shadcn/ui and Radix UI for component primitives
  - Tremor for data visualization components
  - D3.js for advanced data visualization
  - SWR for data fetching and caching
  - React Hook Form with Zod validation
  - date-fns for date manipulation and calculations
- **Backend**:
  - Next.js API routes for backend functionality
  - Firebase for authentication
- **Data Storage**:
  - AITable.ai for primary data (accessed via API)
  - Environment variables for configuration (.env.local)
- **DevOps**:
  - Planned CI/CD pipeline
  - Deployment platform to be determined

## Development Environment
The development environment includes:
- Local development server with hot reloading (`npm run dev`)
- Environment variables in .env.local for configuration
- Integration with AITable.ai API using server-side API token
- Development authentication bypass option for testing
- ESLint for code quality

## Dependencies
Key dependencies include:
- AITable.ai API (custom implementation in src/lib/api/aitable.ts)
- Firebase for authentication
- Tremor and D3.js for data visualization
- shadcn/ui and Radix UI for component library
- SWR for data fetching with caching
- React Hook Form and Zod for form validation
- date-fns for date/time calculations (months active)

## Technical Constraints
- Must securely store and transmit sensitive financial and client data
- AITable.ai API rate limits must be managed
- Cross-browser compatibility is required
- Performance optimization for data fetching
- Authentication and authorization must be properly implemented
- Mobile responsiveness is essential
- Accessibility requirements must be met

## Build & Deployment
- **Development**: Local Next.js development server (`npm run dev`)
- **Building**: Next.js build process (`npm run build`)
- **Production**: Start Next.js server (`npm run start`)
- **Linting**: ESLint for code quality (`npm run lint`)

## AITable.ai Integration
The AITable.ai integration has been set up with:

1. Environment variables for secure access:
   - AITABLE_API_TOKEN for authentication
   - AITABLE_BASE_ID for the workspace
   - AITABLE_PROJECTS_TABLE_ID for projects data
   - AITABLE_CLIENTS_TABLE_ID for clients data
   - AITABLE_MEMBERS_TABLE_ID for team members data

2. Backend API implementation:
   - Custom API client in src/lib/api/aitable.ts
   - API routes in src/app/api/projects and src/app/api/clients
   - Secure proxy to protect API credentials

3. Data model access:
   - Projects data including title, team members, etc.
   - Client information
   - Team members data

4. Future implementation needs:
   - Calculate months active from start date
   - Format currency values appropriately
   - Handle relationships between tables
   - Implement caching for performance optimization 