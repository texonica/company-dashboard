# System Patterns

## Architecture Overview
The system follows a modern web application architecture with:
- Next.js 15 frontend application with App Router for routing and UI
- Next.js API routes for backend functionality
- Custom AITable.ai API client for data access
- Firebase for authentication
- Environment variables for secure configuration

This separation ensures private data is never directly accessed from the client, maintaining security while providing a responsive user experience.

## Design Patterns
- **Repository Pattern**: For data access abstraction through custom AITable API client
- **API Route Pattern**: For secure backend endpoints that proxy AITable requests
- **Component-Based Architecture**: For frontend organization with shadcn/ui and Radix
- **Server Components**: Next.js server components for data fetching
- **Client Components**: Interactive UI components with client-side state
- **SWR Pattern**: For data fetching, caching, and revalidation
- **Environment Variables**: For secure configuration management

## Component Relationships
- **Frontend Components**: Organized in src/components with UI primitives in src/components/ui
- **Backend API Routes**: Implemented in src/app/api for projects and clients
- **AITable API Client**: Custom implementation in src/lib/api/aitable.ts
- **Authentication**: Firebase authentication with optional development bypass
- **Configuration**: Maintained in environment variables and src/lib/config.ts
- **Types**: Defined in src/lib/types.ts for type safety
- **Metrics Processing**: Handled in src/lib/metrics.ts

## Data Flow
1. User requests data through frontend components
2. Frontend makes requests to Next.js API routes (not directly to AITable)
3. API routes authenticate the request
4. API routes use the AITable client to securely fetch data
5. Data is transformed and processed as needed
6. Processed data is returned to the frontend
7. Frontend renders the data with appropriate components

## Home Page Architecture
1. **Dashboard Content Component**: Overall dashboard layout and organization
2. **Active Projects Component**: Displays project information with:
   - Project titles
   - Team members (to be fully implemented)
   - Media buyer (to be fully implemented)
   - Retainer value
   - Start date
   - Months active calculation (to be implemented)
3. **Data Fetching**: Using SWR for caching and revalidation
4. **UI Components**: Using shadcn/ui and Radix for consistent design

## Key Technical Decisions
- Next.js API routes act as a proxy for AITable.ai to keep API keys secure
- Firebase authentication for user management
- Environment variables (.env.local) for sensitive configuration
- Custom AITable API client for standardized data access
- SWR for efficient data fetching with caching
- Responsive design with Tailwind CSS for all screen sizes
- shadcn/ui and Radix for accessible UI components
- Server-side calculation of derived metrics for consistency 