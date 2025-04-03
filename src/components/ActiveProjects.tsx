import { useEffect, useState } from 'react';
import { StageDropdown } from './StageDropdown';

interface Project {
  id: string;
  title: string;
  stage: string;
  client: string;
  clientId: string | null;
  budget: string;
  startDate: string;
  mediaBuyer: string;
  team: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// This is a client component that uses the MCP functions indirectly via our utility
export function ActiveProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        
        // Call our API endpoint
        const response = await fetch('/api/projects');
        
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        if (!response.ok) {
          let errorMessage = `Error: ${response.status} ${response.statusText}`;
          
          if (isJson) {
            const errorData: ErrorResponse = await response.json();
            errorMessage = errorData.error;
            if (errorData.details) {
              errorMessage += `: ${errorData.details}`;
            }
          } else {
            const errorText = await response.text();
            errorMessage += `: ${errorText}`;
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        // Validate that data is an array
        if (!Array.isArray(data)) {
          console.error('Unexpected response format:', data);
          throw new Error('Received invalid data format from server');
        }
        
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [refreshTrigger]);

  // Helper function to handle successful stage update
  const handleStageSuccess = () => {
    // Refresh the data after a short delay to allow the backend to update
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 500);
  };

  // Helper function to handle stage update error
  const handleStageError = (errorMessage: string) => {
    setError(`Error updating stage: ${errorMessage}`);
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  // Helper function to determine if a string is a record ID
  const isRecordId = (str: string): boolean => {
    return /^rec[a-zA-Z0-9]{8,}$/.test(str);
  };

  if (isLoading) return <div className="p-4">Loading projects...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (projects.length === 0) return <div className="p-4">No active projects found</div>;

  // Sort projects by StartDate
  const sortedProjects = [...projects].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  // Group projects by team
  const groupedByTeam: Record<string, Project[]> = {};
  sortedProjects.forEach(project => {
    const team = project.team || 'Unassigned';
    if (!groupedByTeam[team]) {
      groupedByTeam[team] = [];
    }
    groupedByTeam[team].push(project);
  });

  // Get unique teams sorted alphabetically
  const teams = Object.keys(groupedByTeam).sort();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
      <div className="overflow-x-auto">
        {teams.map(team => (
          <div key={team} className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2 px-6">{team}</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupedByTeam[team].map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <StageDropdown 
                        recordId={project.id}
                        currentStage={project.stage}
                        onSuccess={handleStageSuccess}
                        onError={handleStageError}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.client === 'No Client' ? (
                        <span className="text-gray-400">No Client</span>
                      ) : isRecordId(project.client) ? (
                        <span className="text-amber-600 italic" title="Client ID needs resolution">
                          {project.client}
                        </span>
                      ) : (
                        <span title={project.clientId || undefined}>
                          {project.client}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.budget}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.mediaBuyer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
} 