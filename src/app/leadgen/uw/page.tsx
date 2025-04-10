'use client'

import React, { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserRole } from '@/lib/firebase'
import { UWLeadgenMetricsChart } from '@/components/UWLeadgenMetricsChart'

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
    'UW CRM'?: string[]
    Date?: number
    'B&M'?: number
    'M&B'?: number
    'B&NM'?: number
    Won?: number
    Invites?: number
  }
}

function UWLeadgenPage() {
  const [records, setRecords] = useState<UWLeadgenRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUWLeadgenData() {
      try {
        const response = await fetch('/api/leadgen/uw')
        
        if (!response.ok) {
          throw new Error('Failed to fetch UW Leadgen data')
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
        console.error('Error fetching UW Leadgen data:', err)
        setError('Failed to load UW Leadgen data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchUWLeadgenData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">UW Leadgen</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading UW Leadgen data...</p>
        </div>
      ) : (
        <React.Fragment>
          {/* Metrics chart */}
          <div className="mb-8">
            <UWLeadgenMetricsChart records={records} />
          </div>

          {/* Data table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Week
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Viewed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interviewed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calls
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hires
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost Per Proposal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record, index) => (
                    <tr key={record.id || `record-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.Title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.Sent || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.Viewed || 0} ({formatPercent(record.fields['Sent -> Viewed'] || 0)})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.Interviewed || 0} ({formatPercent(record.fields['Viewed -> Interview'] || 0)})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.Calls || 0} ({calculateCallRate(record.fields.Interviewed || 0, record.fields.Calls || 0)})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.Hires || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${record.fields['Connects Cost'] || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${typeof record.fields['Cost Per Proposal'] === 'number' 
                          ? record.fields['Cost Per Proposal'].toFixed(2) 
                          : Number(record.fields['Cost Per Proposal'] || 0).toFixed(2)}
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

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function calculateCallRate(interviewed: number, calls: number): string {
  if (interviewed === 0) return '0%';
  return `${Math.round((calls / interviewed) * 100)}%`;
}

export default function UWLeadgenPageWithProtection() {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.PM, UserRole.VA]}>
      <UWLeadgenPage />
    </ProtectedRoute>
  )
} 