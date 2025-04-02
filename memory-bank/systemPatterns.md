# System Patterns

## Architecture Overview
The system follows a modern web application architecture with:
- Frontend application for user interface
- Backend API service for secure data access and business logic
- Integration with AITable.ai API for data storage and retrieval
- Authentication service for user management

This separation ensures private data is never directly accessed from the client, maintaining security while providing a responsive user experience.

## Design Patterns
- **Repository Pattern**: For data access abstraction
- **Service Layer Pattern**: For business logic organization
- **Component-Based Architecture**: For frontend organization
- **MVC/MVVM Pattern**: For UI organization and state management
- **Adapter Pattern**: For AITable.ai API integration
- **Strategy Pattern**: For different report generation approaches
- **Data Table Pattern**: For displaying project information on the home page

## Component Relationships
- **Frontend Components**: Connect to backend services via API calls
- **Backend Services**: Authenticate users, validate requests, and proxy AITable.ai API calls
- **Data Services**: Handle communication with AITable.ai and transform data for the application
- **Authentication Service**: Manages user sessions and permissions
- **Reporting Engine**: Compiles data from various sources for presentation
- **Projects Service**: Retrieves and processes active project data for the home page

## Data Flow
1. User authenticates through the frontend
2. Frontend requests active projects data from backend API
3. Backend validates request and user permissions
4. Backend requests project data from AITable.ai API with appropriate filters
5. Data is transformed and processed, calculating metrics like months active
6. Processed data is returned to frontend
7. Frontend renders active projects in a data table on the home page

## Home Page Architecture
1. **Projects Table Component**: Displays active projects with columns for:
   - Project title
   - Team members
   - Media buyer
   - Retainer value (USD)
   - Start date
   - Months active
2. **Data Fetching Layer**: Manages API requests and caching
3. **Transformation Layer**: Processes raw data into display format
4. **Filtering/Sorting Controls**: Allows users to customize the projects view

## Key Technical Decisions
- Backend acts as a proxy for AITable.ai to keep API keys and private data secure
- Role-based access control for different dashboard panels
- Caching strategy for frequently accessed but infrequently changed data
- Responsive design approach for multi-device support
- API versioning strategy for future updates
- Error handling and monitoring approach
- Calculate "months active" on the backend to standardize calculations 