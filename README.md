# Mike Rhodes - Build the Agent - Quick Template v1

This is a template project for builders to create applications with AI.

## Getting started
Use cursor composer to create whatever you can think of!

## Technologies used
This doesn't really matter, but is useful for the AI to understand more about this project. We are using the following technologies
- React with Next.js 15 App Router
- TailwindCSS for design
- A google sheet deployed as a web app for the data storage
- A google script to power data fetching 

## AITable Integration

This project includes integration with AITable to display active projects on the dashboard. The implementation uses AITable's REST API to fetch and display data.

### Implementation Details

1. **API Routes**: Next.js API routes serve as a middleware to the AITable API
   - `/api/projects` - Lists all active projects
   - `/api/projects/[id]` - Gets details for a specific project

2. **AITable Client**: Configuration and types defined in `src/lib/aitable.ts`

3. **Frontend Component**: `ActiveProjects.tsx` displays the projects table on the dashboard

4. **Fallback Mechanism**: Mock data is used when the API token is missing or when API calls fail

### Authentication

The AITable API requires an authentication token which should be set in the environment variable:
```
AITABLE_API_TOKEN=your_aitable_api_token_here
```

### API Endpoints

#### GET /api/projects
Returns a list of active projects from AITable.

Response:
```json
[
  {
    "id": "rec123abc",
    "title": "Project Title"
  }
]
```

#### GET /api/projects/[id]
Returns details for a specific project.

Response:
```json
{
  "id": "rec123abc",
  "fields": {
    "Title": "Project Title",
    "Stage": "Launched",
    // Other fields...
  }
}
```

### Next Steps

To enhance the AITable integration:
1. Add pagination for larger datasets
2. Implement caching for better performance
3. Add mutation endpoints (create, update, delete)
4. Expand error handling and retry logic
5. Add more detailed project views

