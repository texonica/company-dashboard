'use client'

import React, { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserRole } from '@/lib/firebase'

interface CRMRecord {
  id: string
  fields: {
    RecordID?: string
    Title?: string
    Name?: string
    Email?: string
    Stage?: string
    Source?: string
    'Company Name'?: string
    Type?: string
    Notes?: string
    Year?: number
    Month?: number
    Week?: number
    FirstCall?: number
    Created?: number
    'Last Edit'?: number
    UW_M_B?: string
    UW_B_NM?: string
    URL?: { 
      title?: string
      text?: string
      favicon?: string
    }
  }
}

function CRMPage() {
  const [records, setRecords] = useState<CRMRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCRMData() {
      try {
        const response = await fetch('/api/leadgen/crm')
        
        if (!response.ok) {
          throw new Error('Failed to fetch CRM data')
        }
        
        const data = await response.json()
        
        // Debugging - check for invalid IDs
        const recordsWithoutIds = data.records.filter((record: any) => !record.id)
        if (recordsWithoutIds.length > 0) {
          console.error('Records without IDs:', recordsWithoutIds)
        }
        
        // Check for duplicate IDs
        const idMap = new Map()
        data.records.forEach((record: any) => {
          if (record.id) {
            if (idMap.has(record.id)) {
              console.error('Duplicate ID found:', record.id)
            } else {
              idMap.set(record.id, true)
            }
          }
        })
        
        // Add synthetic IDs to ensure every record has a unique ID
        const processedRecords = data.records.map((record: any, index: number) => {
          if (!record.id) {
            return {
              ...record,
              id: `synthetic-id-${index}`
            }
          }
          return record
        })
        
        setRecords(processedRecords)
      } catch (err) {
        console.error('Error fetching CRM data:', err)
        setError('Failed to load CRM data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCRMData()
  }, [])

  // Format date from timestamp
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Management</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading CRM data...</p>
        </div>
      ) : (
        <React.Fragment>
          {/* Data table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Call
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.Name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.Email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields['Company Name'] || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageClass(record.fields.Stage)}`}>
                          {record.fields.Stage || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.Source || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.fields.FirstCall)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.fields['Last Edit'])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

// Helper function to get stage class for styling
function getStageClass(stage: string | undefined): string {
  if (!stage) return 'bg-gray-100 text-gray-800'
  
  switch (stage) {
    case 'AskedTheTeamForAudit':
      return 'bg-blue-100 text-blue-800'
    case 'Unqualified':
      return 'bg-red-100 text-red-800'
    case 'No Show/No Message':
      return 'bg-yellow-100 text-yellow-800'
    case 'NonResponsive':
      return 'bg-orange-100 text-orange-800'
    case 'Qualified':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function CRMPageWithProtection() {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.PM, UserRole.VA]}>
      <CRMPage />
    </ProtectedRoute>
  )
} 