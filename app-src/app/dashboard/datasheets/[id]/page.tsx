'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAITable } from '@/lib/contexts/aitable-context';

export default function DatasheetDetailPage() {
  const params = useParams();
  const datasheetId = params.id as string;
  
  const { service, isLoading: isContextLoading, error: contextError } = useAITable();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [views, setViews] = useState<any[]>([]);
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  
  // Fetch datasheet data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch fields
        const fieldsData = await service.getFields(datasheetId);
        setFields(fieldsData);
        
        // Fetch views
        const viewsData = await service.getViews(datasheetId);
        setViews(viewsData);
        
        // Set the first view as selected if none is selected
        if (viewsData.length > 0 && !selectedViewId) {
          setSelectedViewId(viewsData[0].id);
        }
        
        // Fetch records
        const recordsData = await service.getAllRecords(datasheetId, {
          viewId: selectedViewId || undefined,
        });
        setRecords(recordsData);
      } catch (error) {
        console.error('Error fetching datasheet data:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [datasheetId, selectedViewId, service]);
  
  // Handle view change
  const handleViewChange = (viewId: string) => {
    setSelectedViewId(viewId);
  };
  
  if (isContextLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading datasheet...</p>
        </div>
      </div>
    );
  }
  
  if (contextError || error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {(contextError || error)?.message}</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Datasheet: {datasheetId}</h1>
        
        {/* View Selector */}
        {views.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <select
              className="border rounded p-2"
              value={selectedViewId || ''}
              onChange={(e) => handleViewChange(e.target.value)}
            >
              {views.map((view) => (
                <option key={view.id} value={view.id}>
                  {view.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Fields */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Fields</h2>
        
        {fields.length === 0 ? (
          <p className="text-gray-500">No fields found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fields.map((field) => (
                  <tr key={field.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {field.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Records */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Records</h2>
        
        {records.length === 0 ? (
          <p className="text-gray-500">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record ID
                  </th>
                  {fields.map((field) => (
                    <th 
                      key={field.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {field.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.recordId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.recordId}
                    </td>
                    {fields.map((field) => (
                      <td 
                        key={`${record.recordId}-${field.id}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {renderFieldValue(record.fields[field.name], field.type)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to render field values based on type
function renderFieldValue(value: any, type: string): React.ReactNode {
  if (value === undefined || value === null) {
    return <span className="text-gray-400">-</span>;
  }
  
  switch (type) {
    case 'Text':
    case 'SingleText':
    case 'Number':
    case 'Currency':
    case 'Percent':
    case 'Phone':
    case 'Email':
    case 'URL':
      return String(value);
      
    case 'MultiSelect':
    case 'SingleSelect':
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value);
      
    case 'Checkbox':
      return value ? '✓' : '✗';
      
    case 'DateTime':
    case 'CreatedTime':
    case 'LastModifiedTime':
      return new Date(value).toLocaleString();
      
    case 'Attachment':
      if (Array.isArray(value)) {
        return `${value.length} attachment(s)`;
      }
      return '0 attachments';
      
    case 'User':
    case 'CreatedBy':
    case 'LastModifiedBy':
      if (typeof value === 'object' && value !== null) {
        return value.name || value.email || JSON.stringify(value);
      }
      return String(value);
      
    default:
      return JSON.stringify(value);
  }
} 