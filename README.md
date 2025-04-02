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

## AITable Integration Setup

This dashboard integrates with AITable.ai to fetch project and client data. Follow these steps to set up the integration:

### 1. Get AITable API Credentials

1. Log in to your AITable.ai account
2. Go to User Center > Developer Configuration
3. Create a new API token or use an existing one
4. Copy the token for use in your environment variables

### 2. Find Your AITable IDs

**Base ID:**
- Go to your AITable workspace
- The Base ID is visible in the URL after `/space/` (e.g., `spc12q5HY4ay5`)

**Projects Table ID:**
- Open your projects datasheet
- The Table ID is visible in the URL after `/dst/` (e.g., `dstq4onAEtjMleaeCm`)

**Clients Table ID:**
- Open your clients datasheet
- The Table ID is visible in the URL after `/dst/` (e.g., `dstKLMnOpQrsSt`)

### 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`
2. Update these variables:
```
AITABLE_API_TOKEN=your_api_token_here
AITABLE_BASE_ID=your_base_id_here
AITABLE_PROJECTS_TABLE_ID=your_projects_table_id_here
AITABLE_CLIENTS_TABLE_ID=your_clients_table_id_here
```

### 4. Client ID Resolution

For the client lookup feature to work correctly:

1. The Projects table must have a "Client" field that contains AITable record IDs (recXXXXXXX) pointing to client records
2. The Clients table must exist and have a "Name" field containing the client names
3. Both the project and client tables must be in the same AITable base
4. Your API token must have access to both tables

If clients appear as IDs (orange/amber text) instead of names, check that:
- The AITABLE_CLIENTS_TABLE_ID is set correctly
- The Client field in the Projects table contains valid client record IDs
- The Clients table has a Name field for each client

