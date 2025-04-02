# Technical Context

## Technologies Used
- **Frontend**: 
  - React.js for UI components
  - Redux or Context API for state management
  - Chart.js or D3.js for data visualization
  - Material UI or Tailwind CSS for UI framework
  - React Table or similar for data tables on home page
- **Backend**:
  - Node.js with Express or NestJS
  - Authentication middleware (JWT, Auth0, etc.)
  - API integration libraries
  - Date-fns or Moment.js for date calculations (months active)
- **Data Storage**:
  - AITable.ai for primary data (accessed via API)
  - Potential local caching or intermediate database
- **DevOps**:
  - Docker for containerization
  - CI/CD pipeline (GitHub Actions, Jenkins, etc.)
  - Cloud hosting (AWS, Azure, etc.)

## Development Environment
The development environment should include:
- Local development server with hot reloading
- Environment variables for configuration
- Integration with AITable.ai API (dev instance if available)
- Mock data generation for development without API access
- Unit and integration testing setup
- Linting and code formatting tools

## Dependencies
- AITable.ai API Client
- Authentication service/library
- Data visualization libraries
- UI component framework
- HTTP client for API requests
- Form validation library
- Date/time manipulation libraries
- Data table components for projects display
- Testing frameworks
- Build tools and bundlers

## Technical Constraints
- Must securely store and transmit sensitive financial and client data
- AITable.ai API limitations and rate limits
- Cross-browser compatibility requirements
- Performance requirements for potentially large datasets
- Authentication and authorization implementation
- Mobile responsiveness requirements
- Accessibility compliance needs

## Build & Deployment
- **Development**: Local development server with hot reloading
- **Testing**: Automated tests run in CI pipeline before deployment
- **Staging**: Deployment to staging environment for QA
- **Production**: Deployment to production with proper security checks
- **Monitoring**: Application performance and error monitoring
- **Backup**: Data backup and recovery procedures

## AITable.ai Integration
For the home page projects display, we need to:
1. Create a backend API endpoint (`/api/projects/active`) that:
   - Connects to AITable.ai securely using server-side credentials
   - Retrieves active projects with all required fields
   - Transforms data for frontend consumption (formats, calculations)
   - Implements caching for performance optimization

2. Define the AITable.ai data model for projects:
   - Project title field (text)
   - Team members field (multiple select or linked records)
   - Media buyer field (single select or linked record)
   - Retainer value field (currency)
   - Start date field (date)
   - Status field for filtering active projects

3. Calculate derived data:
   - Calculate months active by comparing start date with current date
   - Format currency values appropriately
   - Handle potential missing or null values 