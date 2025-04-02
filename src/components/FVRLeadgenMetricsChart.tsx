'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { MetricsChart } from '@/components/MetricsChart'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { DateRangeSelector, DateRange } from '@/components/DateRangeSelector'
import { subDays } from 'date-fns'

interface FVRLeadgenRecord {
  id: string
  fields: {
    Title?: string
    Year?: number
    Month?: number
    Week?: number
    'GIG 1 Impressions'?: number
    'GIG 1 Clicks'?: number
    'GIG 1 Orders'?: number
    'GIG 1 Ad Spend'?: number
    'GIG 1 Paid Impressions'?: number
    'GIG 1 Paid Clicks'?: number
    'GIG 2 Impressions'?: number
    'GIG 2 Clicks'?: number
    'GIG 2 Orders'?: number
    'GIG 2 Ad Spend'?: number
    'GIG 2 Paid Impressions'?: number
    'GIG 2 Paid Clicks'?: number
    Date?: number
    LeadsAmount?: number
    Leads?: string[]
  }
}

interface FVRLeadgenMetricsChartProps {
  records: FVRLeadgenRecord[]
}

type MetricKey = 
  | 'GIG 1 Impressions' 
  | 'GIG 1 Clicks' 
  | 'GIG 1 Orders' 
  | 'GIG 1 Ad Spend'
  | 'GIG 2 Impressions'
  | 'GIG 2 Clicks'
  | 'GIG 2 Orders'
  | 'GIG 2 Ad Spend'
  | 'LeadsAmount'

interface MetricConfig {
  key: MetricKey
  label: string
  color: string
  format: (value: number) => string
  checked: boolean
}

export function FVRLeadgenMetricsChart({ records }: FVRLeadgenMetricsChartProps) {
  // Define available metrics with their configuration
  const [metrics, setMetrics] = useState<MetricConfig[]>([
    { 
      key: 'GIG 1 Impressions', 
      label: 'GIG 1 Impressions', 
      color: '#4f46e5', 
      format: (value) => value.toString(),
      checked: true
    },
    { 
      key: 'GIG 1 Clicks', 
      label: 'GIG 1 Clicks', 
      color: '#06b6d4', 
      format: (value) => value.toString(),
      checked: true
    },
    { 
      key: 'GIG 1 Orders', 
      label: 'GIG 1 Orders', 
      color: '#10b981', 
      format: (value) => value.toString(),
      checked: true
    },
    { 
      key: 'GIG 1 Ad Spend', 
      label: 'GIG 1 Ad Spend', 
      color: '#f59e0b', 
      format: (value) => `$${value.toFixed(2)}`,
      checked: false
    },
    { 
      key: 'GIG 2 Impressions', 
      label: 'GIG 2 Impressions', 
      color: '#ef4444', 
      format: (value) => value.toString(),
      checked: false
    },
    { 
      key: 'GIG 2 Clicks', 
      label: 'GIG 2 Clicks', 
      color: '#ec4899', 
      format: (value) => value.toString(),
      checked: false
    },
    { 
      key: 'GIG 2 Orders', 
      label: 'GIG 2 Orders', 
      color: '#8b5cf6', 
      format: (value) => value.toString(),
      checked: false
    },
    { 
      key: 'GIG 2 Ad Spend', 
      label: 'GIG 2 Ad Spend', 
      color: '#14b8a6', 
      format: (value) => `$${value.toFixed(2)}`,
      checked: false
    },
    { 
      key: 'LeadsAmount', 
      label: 'Leads', 
      color: '#a855f7', 
      format: (value) => value.toString(),
      checked: true
    }
  ]);
  
  // Add date range state
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: subDays(new Date(), 28), // Default to last 4 weeks
    endDate: new Date()
  });
  
  // Add filtered records state
  const [filteredRecords, setFilteredRecords] = useState<FVRLeadgenRecord[]>(records);
  
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

  // Format data for the chart - memoize this calculation to depend on filteredRecords AND metrics
  const chartData = useMemo(() => {
    const dataPoints = filteredRecords.map((record, index) => {
      const { fields } = record;
      // Make sure we always have a valid date - either from the record or a fallback
      const date = fields.Date ? new Date(fields.Date).toISOString().split('T')[0] : 
        // Fallback date using Title field in YYYY:MM:WW format
        fields.Title ? `${fields.Title.split(':')[0]}-${String(fields.Title.split(':')[1]).padStart(2, '0')}-01` : 
        // Last resort fallback - use current date
        new Date().toISOString().split('T')[0];
      
      // Create a data point with all metrics
      const dataPoint: any = { date, index }; // Add index to ensure uniqueness
      metrics.forEach(metric => {
        // Ensure all values are converted to numbers
        let value = fields[metric.key];
        dataPoint[metric.key] = typeof value === 'number' ? value : Number(value || 0);
      });

      return dataPoint;
    });

    // Sort by date
    const sortedData = dataPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Ensure we have data points for the entire date range, even if some dates have no data
    // This will force the chart to display the full selected date range
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
        // Copy metric values from the first real data point, or use zeros
        if (result.length > 0) {
          metrics.forEach(metric => {
            startPoint[metric.key] = null; // Use null to create discontinuity in the line chart
          });
        }
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
        // Copy metric values from the last real data point, or use zeros
        if (result.length > 0) {
          metrics.forEach(metric => {
            endPoint[metric.key] = null; // Use null to create discontinuity in the line chart
          });
        }
        result.push(endPoint);
      }
    }
    
    return result;
  }, [filteredRecords, metrics, dateRange]);

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
        <h2 className="text-lg font-semibold">FVR Leadgen Metrics Over Time</h2>
        <DateRangeSelector onRangeChange={handleDateRangeChange} />
      </div>
      
      <div className="mb-4 flex flex-wrap gap-4">
        {metrics.map((metric, index) => (
          <div key={`${metric.key}-${index}`} className="flex items-center space-x-2">
            <Checkbox 
              id={`metric-${index}`} 
              checked={metric.checked}
              onCheckedChange={() => {
                toggleMetric(index);
                // Force a re-render for the chart
                setTimeout(() => {}, 0);
              }}
              style={{ color: metric.color }}
            />
            <Label
              htmlFor={`metric-${index}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {metric.label}
            </Label>
          </div>
        ))}
      </div>
      
      {selectedMetrics.length > 0 && chartData.length > 0 ? (
        <>
          <MetricsChart
            key={selectedMetrics.map(m => m.key).join('-')}
            data={chartData}
            metrics={selectedMetrics}
            chartType="line"
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          {chartData.length === 0 ? "No data available for the selected date range" : "Please select at least one metric to display the chart"}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: Week format is YYYY:MM:WW (Year, Month, Week of Month)</p>
      </div>
    </Card>
  );
} 