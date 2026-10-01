'use client';

import { useState, useEffect } from 'react';
import { createLogger } from '@/lib/logger';

const logger = createLogger('dashboard-page');

interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  totalClients: number;
  monthlyRevenue: number;
  quarterSales: number;
  pendingTasks: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        logger.debug('Fetching dashboard summary data');
        const response = await fetch('/api/dashboard/summary');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }
        
        const data = await response.json();
        setSummary(data);
        logger.debug('Dashboard data loaded successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Error loading dashboard data', { error: errorMessage });
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback data for development/preview
  const dashboardData = summary || {
    totalProjects: 12,
    activeProjects: 8,
    totalClients: 24,
    monthlyRevenue: 128500,
    quarterSales: 385000,
    pendingTasks: 18
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Projects</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {dashboardData.activeProjects} Active
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-900">{dashboardData.totalProjects}</p>
            <p className="text-sm text-gray-500 mt-1">Total Projects</p>
          </div>
          <div className="mt-4">
            <a href="/dashboard/projects" className="text-sm text-blue-600 hover:text-blue-800">
              View all projects →
            </a>
          </div>
        </div>

        {/* Clients Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Clients</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-900">{dashboardData.totalClients}</p>
            <p className="text-sm text-gray-500 mt-1">Total Clients</p>
          </div>
          <div className="mt-4">
            <a href="/dashboard/clients" className="text-sm text-blue-600 hover:text-blue-800">
              View all clients →
            </a>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Monthly Revenue</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-900">
              ${dashboardData.monthlyRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ${dashboardData.quarterSales.toLocaleString()} this quarter
            </p>
          </div>
          <div className="mt-4">
            <a href="/dashboard/finance" className="text-sm text-blue-600 hover:text-blue-800">
              View financial details →
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">New client onboarded</p>
              <p className="text-sm text-gray-500">Acme Corporation - Enterprise plan</p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Project milestone completed</p>
              <p className="text-sm text-gray-500">Website redesign - Phase 1</p>
              <p className="text-xs text-gray-400 mt-1">Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Pending tasks reminder</p>
              <p className="text-sm text-gray-500">{dashboardData.pendingTasks} tasks require attention</p>
              <p className="text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-right">
          <a href="/dashboard/activity" className="text-sm text-blue-600 hover:text-blue-800">
            View all activity →
          </a>
        </div>
      </div>
    </div>
  );
} 