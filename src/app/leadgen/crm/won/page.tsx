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

function WonCRMPage() {
  const [records, setRecords] = useState<CRMRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchWonCRMData() {
      try {
        const response = await fetch('/api/leadgen/crm/won')
        
        if (!response.ok) {
          throw new Error('Failed to fetch Won CRM data')
        }
        
        const data = await response.json()
        setRecords(data.records)
      } catch (err) {
        console.error('Error fetching Won CRM data:', err)
        setError('Failed to load Won CRM data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchWonCRMData()
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
        <h1 className="text-3xl font-bold text-gray-900">Won CRM Records</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading Won CRM data...</p>
        </div>
      ) : (
        <React.Fragment>
          {records.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-4 mb-6">
              No Won CRM records found.
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
          )}
        </React.Fragment>
      )}
    </div>
  )
}

export default function WonCRMPageWithProtection() {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.PM, UserRole.VA]}>
      <WonCRMPage />
    </ProtectedRoute>
  )
} 