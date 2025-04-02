'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { MetricsChart } from '@/components/MetricsChart'
import { Checkbox } from '@/components/ui/checkbox'
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

interface MetricConfig {
  key: MetricKey
  label: string
  color: string
  format: (value: number) => string
  checked: boolean
}

export function UWLeadgenMetricsChart({ records }: UWLeadgenMetricsChartProps) {
  // Define available metrics with their configuration
  const [metrics, setMetrics] = useState<MetricConfig[]>([
    { 
      key: 'Sent', 
      label: 'Sent', 
      color: '#4f46e5', 
      format: (value) => value.toString(),
      checked: true
    },
    { 
      key: 'Viewed', 
      label: 'Viewed', 
      color: '#06b6d4', 
      format: (value) => value.toString(),
      checked: true
    },
    { 
      key: 'Interviewed', 
      label: 'Interviewed', 
      color: '#10b981', 
      format: (value) => value.toString(),
      checked: true
    },
    { 
      key: 'Calls', 
      label: 'Calls', 
      color: '#f59e0b', 
      format: (value) => value.toString(),
      checked: false
    },
    { 
      key: 'Connects Cost', 
      label: 'Cost', 
      color: '#ef4444', 
      format: (value) => `$${value.toFixed(2)}`,
      checked: false
    },
    { 
      key: 'Cost Per Proposal', 
      label: 'Cost/Proposal', 
      color: '#ec4899', 
      format: (value) => `$${value.toFixed(2)}`,
      checked: true
    },
    { 
      key: 'Sent -> Viewed', 
      label: 'View Rate', 
      color: '#8b5cf6', 
      format: (value) => `${(value * 100).toFixed(0)}%`,
      checked: false
    },
    { 
      key: 'Viewed -> Interview', 
      label: 'Interview Rate', 
      color: '#14b8a6', 
      format: (value) => `${(value * 100).toFixed(0)}%`,
      checked: false
    }
  ]);

  // Toggle metric visibility
  const toggleMetric = (index: number) => {
    setMetrics(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], checked: !updated[index].checked };
      return updated;
    });
  };

  // Format data for the chart
  const chartData = records.map((record, index) => {
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
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get selected metrics for the chart
  const selectedMetrics = metrics.filter(m => m.checked);

  // Only display two metrics at once to avoid clutter
  const displayMetrics = selectedMetrics.slice(0, 2);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">UW Leadgen Metrics Over Time</h2>
      
      <div className="mb-4 flex flex-wrap gap-4">
        {metrics.map((metric, index) => (
          <div key={`${metric.key}-${index}`} className="flex items-center space-x-2">
            <Checkbox 
              id={`metric-${index}`} 
              checked={metric.checked}
              onCheckedChange={() => toggleMetric(index)}
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
      
      {displayMetrics.length > 0 && chartData.length > 0 ? (
        <>
          <MetricsChart
            data={chartData}
            metric1={displayMetrics[0]}
            metric2={displayMetrics.length > 1 ? displayMetrics[1] : undefined}
            chartType="line"
          />
          {selectedMetrics.length > 2 && (
            <div className="mt-2 text-sm text-amber-600">
              Note: Only the first 2 selected metrics are displayed. Deselect some metrics to view others.
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Please select at least one metric to display the chart
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: Week format is YYYY:MM:WW (Year, Month, Week of Month)</p>
      </div>
    </Card>
  );
} 