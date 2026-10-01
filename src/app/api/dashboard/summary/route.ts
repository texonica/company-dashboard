import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { aitable } from '@/lib/api/aitable';
import { Project, Client, Payment } from '@/types/aitable';
import { AITABLE_DATASHEETS } from '@/lib/constants';

const logger = createLogger('api-dashboard-summary');

// Define Finance type for backward compatibility
type Finance = Payment;

export async function GET(request: NextRequest) {
  try {
    logger.debug('Generating dashboard summary data');
    
    // Get user from request (would be set by middleware)
    const userRole = request.headers.get('x-user-role') || 'CEO'; // Default for development
    
    // Fetch data from AITable using constants instead of hardcoded IDs
    const [projectsData, clientsData, financesData] = await Promise.all([
      aitable.getRecords<Project>(AITABLE_DATASHEETS.PROJECTS),
      aitable.getRecords<Client>(AITABLE_DATASHEETS.CLIENTS),
      aitable.getRecords<Payment>(AITABLE_DATASHEETS.PAYMENTS),
    ]);
    
    const projects = projectsData.records;
    const clients = clientsData.records;
    const finances = financesData.records;
    
    logger.debug('Successfully fetched data from AITable', { 
      projectsCount: projects.length,
      clientsCount: clients.length,
      financesCount: finances.length
    });
    
    // Calculate summary metrics
    const activeProjects = projects.filter(p => p.fields.Status === 'active').length;
    const totalProjects = projects.length;
    const totalClients = clients.length;
    
    // Calculate financial metrics
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentYear = new Date().getFullYear();
    
    // Monthly revenue (current month)
    const monthlyRevenue = finances
      .filter(f => {
        const paymentMonth = f.fields.Month ? parseInt(f.fields.Month) : 0;
        const paymentYear = f.fields.Year ? parseInt(f.fields.Year) : 0;
        return paymentMonth === currentMonth && paymentYear === currentYear;
      })
      .reduce((sum, f) => sum + (f.fields.Value || 0), 0);
    
    // Quarter sales (last 3 months)
    const quarterSales = finances
      .filter(f => {
        const paymentDate = f.fields.Date ? new Date(f.fields.Date) : null;
        if (!paymentDate) return false;
        
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        return paymentDate >= threeMonthsAgo;
      })
      .reduce((sum, f) => sum + (f.fields.Value || 0), 0);
    
    // Pending tasks (placeholder - would be calculated from a tasks table)
    const pendingTasks = 12; // Placeholder value
    
    // Prepare response based on user role
    const summary = {
      activeProjects,
      totalProjects,
      totalClients,
      pendingTasks,
    };
    
    // Add financial data only for CEO and CFO roles
    if (userRole === 'CEO' || userRole === 'CFO') {
      Object.assign(summary, {
        monthlyRevenue,
        quarterSales,
      });
    }
    
    logger.debug('Returning dashboard summary', { summary, userRole });
    
    return NextResponse.json({ summary });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error generating dashboard summary', { error: errorMessage });
    
    return NextResponse.json(
      { error: 'Failed to generate dashboard summary' },
      { status: 500 }
    );
  }
} 