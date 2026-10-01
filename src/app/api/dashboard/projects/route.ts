import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { aitable } from '@/lib/api/aitable';
import { Project, Client } from '@/types/aitable';
import { AITABLE_DATASHEETS } from '@/lib/constants';

const logger = createLogger('api-dashboard-projects');

interface ProjectWithDetails {
  recordId: string;
  name: string;
  status: string;
  startDate?: string;
  endDate?: string;
  client?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    logger.debug('Fetching projects data');
    
    // Get user from request (would be set by middleware)
    const userRole = request.headers.get('x-user-role') || 'CEO'; // Default for development
    
    // Get query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    // Fetch projects and clients from AITable using constants
    const [projectsResponse, clientsResponse] = await Promise.all([
      aitable.getRecords<Project>(AITABLE_DATASHEETS.PROJECTS),
      aitable.getRecords<Client>(AITABLE_DATASHEETS.CLIENTS)
    ]);
    
    const projects = projectsResponse.records;
    const clients = clientsResponse.records;
    
    logger.debug('Successfully fetched data from AITable', { 
      projectsCount: projects.length,
      clientsCount: clients.length
    });
    
    // Create a map of client IDs to names for easier lookup
    const clientMap = new Map<string, string>();
    clients.forEach(client => {
      clientMap.set(client.recordId, client.fields.Name || 'Unknown Client');
    });
    
    // Transform projects data
    const transformedProjects: ProjectWithDetails[] = projects
      .filter(project => !status || project.fields.Status === status)
      .map(project => {
        // Calculate progress based on status or other fields
        let progress = 0;
        if (project.fields.Status === 'completed') {
          progress = 100;
        } else if (project.fields.Status === 'active') {
          // If there's a specific progress field, use that
          // Otherwise, estimate based on dates
          if ((project.fields as any).Progress) {
            progress = (project.fields as any).Progress;
          } else if (project.fields.StartDate && project.fields.EndDate) {
            const start = new Date(project.fields.StartDate).getTime();
            const end = new Date(project.fields.EndDate).getTime();
            const now = Date.now();
            
            if (now >= end) {
              progress = 100;
            } else if (now <= start) {
              progress = 0;
            } else {
              progress = Math.round(((now - start) / (end - start)) * 100);
            }
          } else {
            // Default to 50% if we can't calculate
            progress = 50;
          }
        } else if (project.fields.Status === 'on-hold') {
          // For on-hold projects, use the same logic as active but cap at the current progress
          if ((project.fields as any).Progress) {
            progress = (project.fields as any).Progress;
          } else {
            progress = 25; // Default for on-hold
          }
        }
        
        // Get client name if available
        let clientName: string | undefined;
        if (project.fields.Client && project.fields.Client.length > 0) {
          clientName = clientMap.get(project.fields.Client[0]);
        }
        
        return {
          recordId: project.recordId,
          name: project.fields.Name || 'Unnamed Project',
          status: project.fields.Status || 'unknown',
          startDate: project.fields.StartDate,
          endDate: project.fields.EndDate,
          client: clientName,
          progress,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        };
      });
    
    // Sort projects by status (active first, then on-hold, then completed)
    // and then by start date (newest first)
    transformedProjects.sort((a, b) => {
      const statusOrder = { active: 0, 'on-hold': 1, completed: 2, unknown: 3 };
      const aStatus = statusOrder[a.status as keyof typeof statusOrder] || 3;
      const bStatus = statusOrder[b.status as keyof typeof statusOrder] || 3;
      
      if (aStatus !== bStatus) {
        return aStatus - bStatus;
      }
      
      // If same status, sort by start date (newest first)
      if (a.startDate && b.startDate) {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      
      // If no start dates, sort by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Filter projects based on user role if needed
    let filteredProjects = transformedProjects;
    if (userRole !== 'CEO') {
      if (userRole === 'PM') {
        // Project managers can see all projects
      } else if (userRole === 'SalesManager') {
        // Sales managers can only see active and completed projects
        filteredProjects = transformedProjects.filter(p => 
          p.status === 'active' || p.status === 'completed'
        );
      } else {
        // Other roles see limited projects
        filteredProjects = transformedProjects.slice(0, 5);
      }
    }
    
    logger.debug('Returning projects data', { 
      count: filteredProjects.length,
      userRole
    });
    
    return NextResponse.json({ projects: filteredProjects });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error generating projects data', { error: errorMessage });
    
    return NextResponse.json(
      { error: 'Failed to generate projects data' },
      { status: 500 }
    );
  }
} 