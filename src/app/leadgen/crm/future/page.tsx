'use client'

import React, { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserRole } from '@/lib/firebase'
import { CRMStageDropdown } from '@/components/CRMStageDropdown'

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
    NextAction?: number
    UW_M_B?: string
    UW_B_NM?: string
    URL?: { 
      title?: string
      text?: string
      favicon?: string
    }
  }
  shouldBeFiltered?: boolean
}

function FutureCRMPage() {
  const [records, setRecords] = useState<CRMRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Get end of current week - used for filtering records
  const getEndOfWeekTimestamp = (): number => {
    const now = new Date()
    const endOfWeek = new Date(now)
    const daysToSaturday = 6 - now.getDay() // 6 is Saturday
    endOfWeek.setDate(now.getDate() + daysToSaturday)
    endOfWeek.setHours(23, 59, 59, 999)
    return endOfWeek.getTime()
  }

  useEffect(() => {
    async function fetchFutureCRMData() {
      try {
        setLoading(true)
        const response = await fetch('/api/leadgen/crm/future')
        
        if (!response.ok) {
          throw new Error('Failed to fetch Future CRM data')
        }
        
        const data = await response.json()
        setRecords(data.records)
      } catch (err) {
        console.error('Error fetching Future CRM data:', err)
        setError('Failed to load Future CRM data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchFutureCRMData()
  }, [refreshTrigger])

  // Format date from timestamp
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Handle stage update success - update just the single record
  const handleStageSuccess = (recordId: string, newStage: string) => {
    setRecords(prevRecords => {
      // Check if record is excluded from this view based on certain conditions
      const updatedRecords = prevRecords.map(record => {
        if (record.id === recordId) {
          // Get current NextAction timestamp
          const nextActionTimestamp = record.fields.NextAction
          
          // Check if NextAction exists and is a valid timestamp
          if (nextActionTimestamp && typeof nextActionTimestamp === 'number') {
            // If NextAction is still after end of week, keep the record with updated stage
            if (nextActionTimestamp > getEndOfWeekTimestamp()) {
              return {
                ...record,
                fields: {
                  ...record.fields,
                  Stage: newStage
                }
              }
            }
            // Otherwise, this record no longer belongs in the "future" view
            return null
          }
          
          // If there's no NextAction, update the record but flag it for filtering
          return {
            ...record,
            fields: {
              ...record.fields,
              Stage: newStage
            },
            shouldBeFiltered: true
          }
        }
        return record
      })
      
      // Remove null/filtered records and cast the result to ensure type safety
      return updatedRecords
        .filter((record): record is CRMRecord => 
          record !== null && !record.shouldBeFiltered
        )
    })
  }

  // Handle stage update error
  const handleStageError = (errorMessage: string) => {
    setError(`Error updating stage: ${errorMessage}`)
    // Clear error after 5 seconds
    setTimeout(() => setError(''), 5000)
  }

  // Force refresh data functionality - useful as a fallback
  const forceRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Future CRM Records</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing records with next actions after the end of this week
          </div>
          <button 
            onClick={forceRefresh}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-2 rounded"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading Future CRM data...</p>
        </div>
      ) : (
        <React.Fragment>
          {records.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-4 mb-6">
              No records found with next actions after the end of this week.
            </div>
          ) : (
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
                        Next Action
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
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
                          <CRMStageDropdown 
                            recordId={record.id}
                            currentStage={record.fields.Stage || 'N/A'}
                            onSuccess={(newStage) => handleStageSuccess(record.id, newStage)}
                            onError={handleStageError}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.fields.NextAction)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.fields.Source || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  )
}

// Helper function to get stage class for styling (kept for reference)
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
    case 'Won':
      return 'bg-emerald-100 text-emerald-800'
    case 'SentAudit':
      return 'bg-indigo-100 text-indigo-800'
    case 'FirstCall':
      return 'bg-sky-100 text-sky-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function FutureCRMPageWithProtection() {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.PM, UserRole.VA]}>
      <FutureCRMPage />
    </ProtectedRoute>
  )
} 