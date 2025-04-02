'use client'

import React, { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserRole } from '@/lib/firebase'
import { FVRLeadgenMetricsChart } from '@/components/FVRLeadgenMetricsChart'

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

function FVRLeadgenPage() {
  const [records, setRecords] = useState<FVRLeadgenRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchFVRLeadgenData() {
      try {
        const response = await fetch('/api/leadgen/fvr')
        
        if (!response.ok) {
          throw new Error('Failed to fetch FVR Leadgen data')
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
        console.error('Error fetching FVR Leadgen data:', err)
        setError('Failed to load FVR Leadgen data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchFVRLeadgenData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">FVR Leadgen</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading FVR Leadgen data...</p>
        </div>
      ) : (
        <React.Fragment>
          {/* Metrics chart */}
          <div className="mb-8">
            <FVRLeadgenMetricsChart records={records} />
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
                      GIG 1 Impressions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GIG 1 Clicks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GIG 1 Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GIG 1 Ad Spend
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GIG 2 Impressions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GIG 2 Clicks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GIG 2 Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GIG 2 Ad Spend
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leads
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
                        {record.fields['GIG 1 Impressions'] || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields['GIG 1 Clicks'] || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields['GIG 1 Orders'] || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${Number(record.fields['GIG 1 Ad Spend'] || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields['GIG 2 Impressions'] || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields['GIG 2 Clicks'] || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields['GIG 2 Orders'] || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${Number(record.fields['GIG 2 Ad Spend'] || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fields.LeadsAmount || 0}
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

// Helper function to format percentages
function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`
}

export default function FVRLeadgenPageWithProtection() {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.PM, UserRole.VA]}>
      <FVRLeadgenPage />
    </ProtectedRoute>
  )
} 