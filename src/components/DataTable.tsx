/**
 * DataTable Component
 * Displays AITable records with filtering, pagination, and search functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { AITableField, AITableRecord, AITableSort } from '../types/aitable';
import { createLogger } from '../lib/logger';

const logger = createLogger('DataTable');

// Pagination options
const PAGE_SIZE_OPTIONS = [20, 50, 100];

// Date range options
export type DateRangeType = 'current-month' | 'past-month' | 'past-quarter' | 'current-year' | 'past-year' | 'custom';

export interface DateRange {
  type: DateRangeType;
  startDate?: Date;
  endDate?: Date;
}

export interface DataTableProps {
  records: AITableRecord[];
  fields: AITableField[];
  isLoading: boolean;
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  dateField?: string;
  dateRange: DateRange;
  searchField?: string;
  searchQuery?: string;
  sortBy?: AITableSort[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onDateRangeChange: (dateRange: DateRange) => void;
  onSearchFieldChange: (fieldId: string) => void;
  onSearchQueryChange: (query: string) => void;
  onSortChange: (sortBy: AITableSort[]) => void;
  onRowClick?: (record: AITableRecord) => void;
}

export default function DataTable({
  records,
  fields,
  isLoading,
  totalRecords,
  pageSize,
  currentPage,
  dateField,
  dateRange,
  searchField,
  searchQuery,
  sortBy = [],
  onPageChange,
  onPageSizeChange,
  onDateRangeChange,
  onSearchFieldChange,
  onSearchQueryChange,
  onSortChange,
  onRowClick,
}: DataTableProps) {
  // Display fields (filter out system fields if needed)
  const displayFields = fields.filter(field => 
    !['CreatedTime', 'LastModifiedTime', 'CreatedBy', 'LastModifiedBy'].includes(field.type)
  );

  // Date fields for filtering
  const dateFields = fields.filter(field => 
    ['DateTime', 'CreatedTime', 'LastModifiedTime'].includes(field.type)
  );

  // Searchable fields
  const searchableFields = fields.filter(field => 
    ['SingleText', 'Text', 'Email', 'URL', 'Phone', 'SingleSelect'].includes(field.type)
  );

  // Total pages calculation
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Custom date range state
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Initialize custom date range if selected
  useEffect(() => {
    if (dateRange.type === 'custom') {
      if (dateRange.startDate) {
        setCustomStartDate(dateRange.startDate.toISOString().split('T')[0]);
      }
      if (dateRange.endDate) {
        setCustomEndDate(dateRange.endDate.toISOString().split('T')[0]);
      }
    }
  }, [dateRange]);

  // Handle date range change
  const handleDateRangeChange = (type: DateRangeType) => {
    logger.debug(`Date range changed to ${type}`);
    
    let newDateRange: DateRange = { type };
    const now = new Date();
    
    if (type === 'current-month') {
      newDateRange.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      newDateRange.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (type === 'past-month') {
      newDateRange.startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      newDateRange.endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (type === 'past-quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      newDateRange.startDate = new Date(now.getFullYear(), currentQuarter * 3 - 3, 1);
      newDateRange.endDate = new Date(now.getFullYear(), currentQuarter * 3, 0);
    } else if (type === 'current-year') {
      newDateRange.startDate = new Date(now.getFullYear(), 0, 1);
      newDateRange.endDate = new Date(now.getFullYear(), 11, 31);
    } else if (type === 'past-year') {
      newDateRange.startDate = new Date(now.getFullYear() - 1, 0, 1);
      newDateRange.endDate = new Date(now.getFullYear() - 1, 11, 31);
    } else if (type === 'custom') {
      // Keep the existing date range for custom type
      if (dateRange.type === 'custom') {
        newDateRange.startDate = dateRange.startDate;
        newDateRange.endDate = dateRange.endDate;
      }
    }
    
    onDateRangeChange(newDateRange);
  };

  // Handle custom date range change
  const handleCustomDateRangeChange = () => {
    logger.debug('Custom date range changed', { start: customStartDate, end: customEndDate });
    
    const startDate = customStartDate ? new Date(customStartDate) : undefined;
    const endDate = customEndDate ? new Date(customEndDate) : undefined;
    
    onDateRangeChange({
      type: 'custom',
      startDate,
      endDate,
    });
  };

  // Handle sorting
  const handleSort = (fieldId: string) => {
    logger.debug(`Sorting by field ${fieldId}`);
    
    const existingSortIndex = sortBy.findIndex(sort => sort.fieldId === fieldId);
    const newSortBy = [...sortBy];
    
    if (existingSortIndex >= 0) {
      // Toggle sort order if already sorted by this field
      if (newSortBy[existingSortIndex].order === 'asc') {
        newSortBy[existingSortIndex] = { fieldId, order: 'desc' };
      } else {
        // Remove sort if already descending
        newSortBy.splice(existingSortIndex, 1);
      }
    } else {
      // Add new sort
      newSortBy.push({ fieldId, order: 'asc' });
    }
    
    onSortChange(newSortBy);
  };

  // Get sort direction for a field
  const getSortDirection = (fieldId: string): 'asc' | 'desc' | undefined => {
    const sort = sortBy.find(sort => sort.fieldId === fieldId);
    return sort?.order;
  };

  // Handle search field change
  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSearchFieldChange(e.target.value);
  };

  // Handle search query change
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchQueryChange(e.target.value);
  };

  // Format cell value based on field type
  const formatCellValue = (value: any, field: AITableField): string => {
    if (value === null || value === undefined) return '';
    
    switch (field.type) {
      case 'DateTime':
        return new Date(value).toLocaleString();
      case 'Link':
        return Array.isArray(value) ? `${value.length} items` : value?.toString() || '';
      case 'Attachment':
        return Array.isArray(value) ? `${value.length} files` : value?.toString() || '';
      case 'MultiSelect':
        return Array.isArray(value) ? value.join(', ') : value?.toString() || '';
      default:
        return value?.toString() || '';
    }
  };

  // Render
  return (
    <div className="card overflow-hidden">
      {/* Filters */}
      <div className="bg-gray-100 p-4 border-b flex flex-wrap gap-4 justify-between items-end">
        {/* Date Filter */}
        {dateFields.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Date Field:
              <select 
                className="ml-2 p-1 border rounded"
                value={dateField || ''}
                onChange={(e) => onSearchFieldChange(e.target.value)}
              >
                <option value="">None</option>
                {dateFields.map((field) => (
                  <option key={field.id} value={field.id}>{field.name}</option>
                ))}
              </select>
            </label>
            
            {dateField && (
              <div className="flex flex-wrap gap-2">
                <select 
                  className="p-1 border rounded"
                  value={dateRange.type}
                  onChange={(e) => handleDateRangeChange(e.target.value as DateRangeType)}
                >
                  <option value="current-month">Current Month</option>
                  <option value="past-month">Past Month</option>
                  <option value="past-quarter">Past Quarter</option>
                  <option value="current-year">Current Year</option>
                  <option value="past-year">Past Year</option>
                  <option value="custom">Custom Range</option>
                </select>
                
                {dateRange.type === 'custom' && (
                  <div className="flex gap-2 items-center">
                    <input
                      type="date"
                      className="p-1 border rounded"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="date"
                      className="p-1 border rounded"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                    <button
                      className="btn-secondary text-sm py-1"
                      onClick={handleCustomDateRangeChange}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Search */}
        <div className="flex gap-2">
          <select 
            className="p-1 border rounded"
            value={searchField || ''}
            onChange={handleSearchFieldChange}
          >
            <option value="">Search Field</option>
            {searchableFields.map((field) => (
              <option key={field.id} value={field.id}>{field.name}</option>
            ))}
          </select>
          
          <input 
            type="text"
            className="p-1 border rounded"
            placeholder="Search..."
            value={searchQuery || ''}
            onChange={handleSearchQueryChange}
            disabled={!searchField}
          />
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {displayFields.map((field) => (
                <th 
                  key={field.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(field.id)}
                >
                  <div className="flex items-center gap-1">
                    {field.name}
                    {getSortDirection(field.id) === 'asc' && <span>↑</span>}
                    {getSortDirection(field.id) === 'desc' && <span>↓</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={displayFields.length} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={displayFields.length} className="px-6 py-4 text-center">
                  No records found
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr 
                  key={record.recordId}
                  className={onRowClick ? "hover:bg-gray-100 cursor-pointer" : ""}
                  onClick={() => onRowClick?.(record)}
                >
                  {displayFields.map((field) => (
                    <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCellValue(record.fields[field.id], field)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-t">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Show
            <select
              className="mx-1 p-1 border rounded"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            records
          </span>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-4">
            Showing {records.length} of {totalRecords} results
          </span>
          
          <div className="flex gap-1">
            <button
              className="btn-secondary text-sm py-1"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
            
            <span className="px-3 py-1 bg-white border rounded">
              {currentPage} / {totalPages}
            </span>
            
            <button
              className="btn-secondary text-sm py-1"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 