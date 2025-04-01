import { useEffect, useState } from 'react';

interface Project {
  id: string;
  title: string;
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
  }, []);

  if (isLoading) return <div className="p-4">Loading projects...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (projects.length === 0) return <div className="p-4">No active projects found</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 