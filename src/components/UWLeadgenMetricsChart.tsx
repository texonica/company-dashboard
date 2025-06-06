'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { MetricsChart } from '@/components/MetricsChart'
import { DateRangeSelector, DateRange } from '@/components/DateRangeSelector'
import { subDays, format, startOfMonth, isSameMonth } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface UWLeadgenRecord {
  id: string
  fields: {
    Title?: string
    Year?: number
    Month?: number
    Week?: number
    Sent?: number
    Viewed?: number
    'Sent O%'?: number
    'Viewed O%'?: number
    'Sent -> Viewed'?: number
    Interviewed?: number
    'Interviewed O%'?: number
    'Viewed -> Interview'?: number
    Calls?: number
    Hires?: number
    'Connects Cost'?: number
    'Cost Per Proposal'?: number
    'Profile Views'?: number
    Date?: number
    'Interviewed -> Calls'?: number
  }
}

interface UWLeadgenMetricsChartProps {
  records: UWLeadgenRecord[]
}

type MetricKey = 
  | 'Sent' 
  | 'Viewed' 
  | 'Interviewed' 
  | 'Calls' 
  | 'Connects Cost' 
  | 'Cost Per Proposal' 
  | 'Sent -> Viewed'
  | 'Viewed -> Interview'
  | 'Interviewed -> Calls'

interface MetricConfig {
  key: MetricKey
  label: string
  color: string
  format: (value: number) => string
  checked: boolean
  aggregation: 'sum' | 'average'
}

type ViewMode = 'weekly' | 'monthly';

export function UWLeadgenMetricsChart({ records }: UWLeadgenMetricsChartProps) {
  // Add view mode state
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  
  // Define available metrics with their configuration
  const [metrics, setMetrics] = useState<MetricConfig[]>([
    { 
      key: 'Sent', 
      label: 'Sent', 
      color: '#3730a3', // Deeper indigo
      format: (value) => value.toString(),
      checked: true,
      aggregation: 'sum'
    },
    { 
      key: 'Viewed', 
      label: 'Viewed', 
      color: '#0891b2', // Deeper cyan
      format: (value) => value.toString(),
      checked: true,
      aggregation: 'sum'
    },
    { 
      key: 'Interviewed', 
      label: 'Interviewed', 
      color: '#047857', // Deeper emerald
      format: (value) => value.toString(),
      checked: true,
      aggregation: 'sum'
    },
    { 
      key: 'Calls', 
      label: 'Calls', 
      color: '#b45309', // Deeper amber
      format: (value) => value.toString(),
      checked: false,
      aggregation: 'sum'
    },
    { 
      key: 'Connects Cost', 
      label: 'Cost', 
      color: '#b91c1c', // Deeper red
      format: (value) => `$${value.toFixed(2)}`,
      checked: false,
      aggregation: 'sum'
    },
    { 
      key: 'Cost Per Proposal', 
      label: 'Cost/Proposal', 
      color: '#be185d', // Deeper pink
      format: (value) => `$${value.toFixed(2)}`,
      checked: true,
      aggregation: 'average'
    },
    { 
      key: 'Sent -> Viewed', 
      label: 'View Rate', 
      color: '#6d28d9', // Deeper purple
      format: (value) => `${(value * 100).toFixed(0)}%`,
      checked: false,
      aggregation: 'average'
    },
    { 
      key: 'Viewed -> Interview', 
      label: 'Interview Rate', 
      color: '#0f766e', // Deeper teal
      format: (value) => `${(value * 100).toFixed(0)}%`,
      checked: false,
      aggregation: 'average'
    },
    { 
      key: 'Interviewed -> Calls', 
      label: 'Call Rate', 
      color: '#c2410c', // Deeper orange
      format: (value) => `${(value * 100).toFixed(0)}%`,
      checked: true,
      aggregation: 'average'
    }
  ]);
  
  // Add date range state
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: subDays(new Date(), 28), // Default to last 4 weeks
    endDate: new Date()
  });
  
  // Add filtered records state
  const [filteredRecords, setFilteredRecords] = useState<UWLeadgenRecord[]>(records);
  
  // Filter records when date range changes
  useEffect(() => {
    const filtered = records.filter(record => {
      // Convert record date to Date object
      const recordDate = record.fields.Date 
        ? new Date(record.fields.Date) 
        : record.fields.Title 
          ? parseTitleToDate(record.fields.Title)
          : new Date(); // Fallback
          
      return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
    });
    
    setFilteredRecords(filtered);
  }, [records, dateRange]);
  
  // Helper function to parse Title in format YYYY:MM:WW to a Date
  const parseTitleToDate = (title: string): Date => {
    const parts = title.split(':').map(Number);
    // Create a date for the first day of the month
    const date = new Date(parts[0], parts[1] - 1, 1);
    // Add (week - 1) * 7 days to get to the start of the week
    date.setDate(date.getDate() + (parts[2] - 1) * 7);
    return date;
  };

  // Toggle metric visibility
  const toggleMetric = (index: number) => {
    setMetrics(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], checked: !updated[index].checked };
      return updated;
    });
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'weekly' ? 'monthly' : 'weekly');
  };

  // Calculate aggregated values for each metric
  const aggregatedValues = useMemo(() => {
    return metrics.map(metric => {
      const values = filteredRecords
        .map(record => record.fields[metric.key] || 0)
        .filter(value => typeof value === 'number' && !isNaN(value));
      
      if (values.length === 0) return 0;
      
      if (metric.aggregation === 'sum') {
        return values.reduce((sum, value) => sum + value, 0);
      } else {
        return values.reduce((sum, value) => sum + value, 0) / values.length;
      }
    });
  }, [filteredRecords, metrics]);

  // Format data for the chart - memoize this calculation to depend on filteredRecords, metrics, dateRange, and viewMode
  const chartData = useMemo(() => {
    // First get all data points with proper dates
    const initialDataPoints = filteredRecords.map((record, index) => {
      const { fields } = record;
      // Make sure we always have a valid date - either from the record or a fallback
      const dateObj = fields.Date 
        ? new Date(fields.Date) 
        : fields.Title 
          ? parseTitleToDate(fields.Title)
          : new Date(); // Fallback

      const date = dateObj.toISOString().split('T')[0];
      
      // Create a data point with all metrics
      const dataPoint: any = { 
        date, 
        dateObj, // Store the actual date object for grouping
        index,   // Add index to ensure uniqueness
        isMonthlyView: viewMode === 'monthly'
      };
      
      metrics.forEach(metric => {
        // Ensure all values are converted to numbers
        let value: number;
        
        // Calculate the Interviewed -> Calls conversion rate if needed
        if (metric.key === 'Interviewed -> Calls') {
          const interviewed = fields['Interviewed'] || 0;
          const calls = fields['Calls'] || 0;
          value = interviewed > 0 ? calls / interviewed : 0;
        } else {
          value = Number(fields[metric.key as keyof typeof fields] || 0);
        }
        
        dataPoint[metric.key] = value;
      });

      return dataPoint;
    });

    // If we're in weekly mode, just use the original data points
    if (viewMode === 'weekly') {
      // Sort by date
      const sortedData = initialDataPoints.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    
      // Ensure we have data points for the entire date range, even if some dates have no data
      const result = sortedData.length > 0 ? sortedData : [];
      
      // Add explicit start and end markers based on the date range if we have any data
      if (result.length > 0) {
        // Format dates to match the format used in dataPoints
        const startDateStr = dateRange.startDate.toISOString().split('T')[0];
        const endDateStr = dateRange.endDate.toISOString().split('T')[0];
        
        // Check if we need to add start boundary
        if (new Date(result[0].date).getTime() > dateRange.startDate.getTime()) {
          // Add a boundary point at the start date
          const startPoint: any = { 
            date: startDateStr, 
            index: -1,
            isBoundary: true
          };
          // Add null values for all metrics
          metrics.forEach(metric => {
            startPoint[metric.key] = null; // Use null to create discontinuity in the line chart
          });
          result.unshift(startPoint);
        }
        
        // Check if we need to add end boundary
        if (new Date(result[result.length - 1].date).getTime() < dateRange.endDate.getTime()) {
          // Add a boundary point at the end date
          const endPoint: any = { 
            date: endDateStr, 
            index: -2,
            isBoundary: true
          };
          // Add null values for all metrics
          metrics.forEach(metric => {
            endPoint[metric.key] = null; // Use null to create discontinuity in the line chart
          });
          result.push(endPoint);
        }
      }
      
      return result;
    } else {
      // For monthly view, group data points by month and aggregate

      // Group data points by month
      const monthlyData: { [key: string]: any[] } = {};
      
      initialDataPoints.forEach(dataPoint => {
        const date = new Date(dataPoint.date);
        const monthKey = format(date, 'yyyy-MM'); // Format as YYYY-MM
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = [];
        }
        
        monthlyData[monthKey].push(dataPoint);
      });
      
      // Aggregate metrics for each month
      const aggregatedMonthlyData = Object.keys(monthlyData).map(monthKey => {
        const monthDataPoints = monthlyData[monthKey];
        const firstDateInMonth = monthDataPoints[0].dateObj;
        
        // Create month data point
        const monthPoint: any = {
          date: `${monthKey}-01`, // Set to first day of month
          dateObj: startOfMonth(firstDateInMonth),
          index: monthKey,
          monthlyData: true
        };
        
        // Aggregate each metric
        metrics.forEach(metric => {
          const values = monthDataPoints.map(d => d[metric.key] || 0);
          
          if (metric.aggregation === 'sum') {
            monthPoint[metric.key] = values.reduce((sum, val) => sum + val, 0);
          } else {
            // For averages like rates, we need to compute the correct average
            monthPoint[metric.key] = values.reduce((sum, val) => sum + val, 0) / values.length;
          }
        });
        
        return monthPoint;
      });
      
      // Sort by date
      const sortedMonthlyData = aggregatedMonthlyData.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const result = sortedMonthlyData.length > 0 ? sortedMonthlyData : [];
      
      // Add boundaries if needed for monthly view
      if (result.length > 0) {
        const startMonthStr = format(dateRange.startDate, 'yyyy-MM-01');
        const endMonthStr = format(dateRange.endDate, 'yyyy-MM-01');
        
        // Check if we need to add start boundary for month
        if (new Date(result[0].date).getTime() > new Date(startMonthStr).getTime()) {
          const startPoint: any = { 
            date: startMonthStr, 
            index: 'start-boundary',
            isBoundary: true
          };
          
          metrics.forEach(metric => {
            startPoint[metric.key] = null;
          });
          
          result.unshift(startPoint);
        }
        
        // Check if we need to add end boundary for month
        if (new Date(result[result.length - 1].date).getTime() < new Date(endMonthStr).getTime()) {
          const endPoint: any = { 
            date: endMonthStr, 
            index: 'end-boundary',
            isBoundary: true
          };
          
          metrics.forEach(metric => {
            endPoint[metric.key] = null;
          });
          
          result.push(endPoint);
        }
      }
      
      return result;
    }
  }, [filteredRecords, metrics, dateRange, viewMode]);

  // Get selected metrics for the chart
  const selectedMetrics = useMemo(() => {
    return metrics.filter(m => m.checked);
  }, [metrics]);

  // Handle date range change
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">UW Leadgen Metrics Over Time</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="view-mode" 
              checked={viewMode === 'monthly'}
              onCheckedChange={toggleViewMode}
            />
            <Label htmlFor="view-mode" className="text-sm font-medium">
              {viewMode === 'weekly' ? 'Weekly View' : 'Monthly View'}
            </Label>
          </div>
          <DateRangeSelector onRangeChange={handleDateRangeChange} />
        </div>
      </div>
      
      <div className="mb-6">
        {/* Group metrics into categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Funnel Metrics Group */}
          <div className="border rounded-md p-3">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Funnel Metrics</h3>
            <div className="flex flex-wrap gap-2">
              {metrics.filter(m => ['Sent', 'Viewed', 'Interviewed', 'Calls'].includes(m.key)).map((metric, i) => {
                const index = metrics.findIndex(m => m.key === metric.key);
                const aggregatedValue = aggregatedValues[index];
                
                return (
                  <Button
                    key={`${metric.key}-${index}`}
                    variant={metric.checked ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMetric(index)}
                    className="flex flex-col items-center px-3 py-2 h-auto flex-1"
                    style={{ 
                      borderColor: metric.color,
                      backgroundColor: metric.checked ? metric.color : 'transparent',
                      color: metric.checked ? 'white' : metric.color 
                    }}
                  >
                    <span className="font-medium">{metric.label}</span>
                    <span className="text-xs mt-1">
                      Total: {metric.format(aggregatedValue)}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Financial Metrics Group */}
          <div className="border rounded-md p-3">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Financial Metrics</h3>
            <div className="flex flex-wrap gap-2">
              {metrics.filter(m => ['Connects Cost', 'Cost Per Proposal'].includes(m.key)).map((metric, i) => {
                const index = metrics.findIndex(m => m.key === metric.key);
                const aggregatedValue = aggregatedValues[index];
                
                return (
                  <Button
                    key={`${metric.key}-${index}`}
                    variant={metric.checked ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMetric(index)}
                    className="flex flex-col items-center px-3 py-2 h-auto flex-1"
                    style={{ 
                      borderColor: metric.color,
                      backgroundColor: metric.checked ? metric.color : 'transparent',
                      color: metric.checked ? 'white' : metric.color 
                    }}
                  >
                    <span className="font-medium">{metric.label}</span>
                    <span className="text-xs mt-1">
                      {metric.aggregation === 'sum' ? 'Total:' : 'Avg:'} {metric.format(aggregatedValue)}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Conversion Rate Metrics Group */}
          <div className="border rounded-md p-3">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Conversion Rates</h3>
            <div className="flex flex-wrap gap-2">
              {metrics.filter(m => ['Sent -> Viewed', 'Viewed -> Interview', 'Interviewed -> Calls'].includes(m.key)).map((metric, i) => {
                const index = metrics.findIndex(m => m.key === metric.key);
                const aggregatedValue = aggregatedValues[index];
                
                return (
                  <Button
                    key={`${metric.key}-${index}`}
                    variant={metric.checked ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMetric(index)}
                    className="flex flex-col items-center px-3 py-2 h-auto flex-1"
                    style={{ 
                      borderColor: metric.color,
                      backgroundColor: metric.checked ? metric.color : 'transparent',
                      color: metric.checked ? 'white' : metric.color 
                    }}
                  >
                    <span className="font-medium">{metric.label}</span>
                    <span className="text-xs mt-1">
                      Avg: {metric.format(aggregatedValue)}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {selectedMetrics.length > 0 && chartData.length > 0 ? (
        <>
          <MetricsChart
            key={`${selectedMetrics.map(m => m.key).join('-')}-${viewMode}`}
            data={chartData}
            metrics={selectedMetrics}
            chartType="line"
            lineThickness={viewMode === 'monthly' ? 3 : 2}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          {chartData.length === 0 ? "No data available for the selected date range" : "Please select at least one metric to display the chart"}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: {viewMode === 'weekly' ? 'Week format is YYYY:MM:WW (Year, Month, Week of Month)' : 'Data is aggregated by month'}</p>
      </div>
    </Card>
  );
} 