# Active Context

## Current Focus
We are currently defining the home page requirements for the Texonica.com dashboard project. The main focus is on displaying active projects with key information after a user logs in. We are establishing how to securely connect to the AITable.ai API to retrieve project data while ensuring data privacy and security.

## Recent Changes
- Initialized Memory Bank documentation structure
- Defined high-level project goals and requirements
- Established the need for secure AITable.ai integration
- Identified financial reporting as a key component
- Defined home page requirements for displaying active projects
- Created detailed roadmap.md file for tracking progress and implementation discussions

## Next Steps
- Implement home page with active projects display showing:
  - Project titles
  - Team members
  - Media buyer
  - Retainer value in USD
  - Start date
  - Number of months project has been active
- Explore AITable.ai API capabilities and limitations
- Define specific data models needed for the dashboard
- Create technical specifications for the backend API
- Design initial wireframes for key dashboard panels
- Establish authentication requirements and approach
- Finalize technology stack decisions
- Create development roadmap with milestones

*For detailed roadmap and implementation discussions, see [roadmap.md](roadmap.md)*

## Active Decisions
We need to determine the best approach for:
- Home page layout and design for displaying active projects
- Data fetching strategy for active projects from AITable.ai
- Frontend framework and UI component library selection
- Backend architecture and API design
- Authentication mechanism (JWT, OAuth, etc.)
- Deployment strategy and hosting environment
- Testing strategy and quality assurance processes
- Specific panels and reports to include in initial release

## Open Questions
- What specific AITable.ai bases will we need to access for project data?
- What are the performance characteristics of the AITable.ai API?
- What are the specific financial metrics that need to be displayed?
- What level of user role granularity is required?
- What are the data refresh requirements (real-time vs. periodic)?
- Are there any regulatory compliance requirements to consider?
- What are the expected user volumes and usage patterns?
- How should we sort or filter the active projects on the home page? 