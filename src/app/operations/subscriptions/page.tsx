'use client'

import { useState, useEffect } from 'react'
import { AITableSubscription } from '@/lib/api/aitable'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        setLoading(true)
        const response = await fetch('/api/subscriptions')
        
        if (!response.ok) {
          throw new Error(`Error fetching subscriptions: ${response.status}`)
        }
        
        const data = await response.json()
        setSubscriptions(data)
      } catch (err) {
        console.error('Failed to fetch subscriptions:', err)
        setError(err instanceof Error ? err.message : 'Failed to load subscriptions')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  // Helper function to format currency
  const formatCurrency = (amount: number | undefined, currency: string = 'USD') => {
    if (amount === undefined) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
      
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && subscriptions.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No subscriptions found.</p>
        </div>
      )}
      
      {!loading && !error && subscriptions.length > 0 && (
        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-3 border-b text-left w-[20%] max-w-[250px]">Title</th>
                <th className="py-2 px-3 border-b text-left w-[15%]">Client</th>
                <th className="py-2 px-3 border-b text-left w-[20%]">Projects</th>
                <th className="py-2 px-3 border-b text-left w-[8%]">Type</th>
                <th className="py-2 px-3 border-b text-left w-[8%]">Value</th>
                <th className="py-2 px-3 border-b text-left w-[8%]">Gateway</th>
                <th className="py-2 px-3 border-b text-left w-[7%]">Status</th>
                <th className="py-2 px-3 border-b text-left w-[8%]">Create Date</th>
                <th className="py-2 px-3 border-b text-left w-[6%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 max-w-[250px] truncate" title={subscription.fields?.Title || subscription.name}>
                    {subscription.fields?.Title || subscription.name || '[No Name]'}
                  </td>
                  <td className="py-2 px-3">
                    {subscription.client && typeof subscription.client === 'object'
                      ? subscription.client.name
                      : Array.isArray(subscription.fields?.Client)
                        ? subscription.fields.Client.join(', ')
                        : subscription.fields?.Client || '-'}
                  </td>
                  <td className="py-2 px-3">
                    {subscription.projects && typeof subscription.projects === 'object'
                      ? (
                          subscription.projects.names && subscription.projects.names.length > 0 
                          ? (
                              <div className="flex flex-wrap gap-1" title={subscription.projects.names.join(', ')}>
                                {subscription.projects.names.map((name: string, idx: number) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {name}
                                  </span>
                                ))}
                                {subscription.projects.count > subscription.projects.names.length && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{subscription.projects.count - subscription.projects.names.length} more
                                  </span>
                                )}
                              </div>
                            )
                          : subscription.projects.display
                        )
                      : Array.isArray(subscription.fields?.Projects)
                        ? (
                          <div className="flex flex-wrap gap-1">
                            {subscription.fields.Projects.map((project: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {project}
                              </span>
                            ))}
                          </div>
                        )
                        : subscription.fields?.Projects || '-'}
                  </td>
                  <td className="py-2 px-3">{subscription.fields?.SubscriptionType || '-'}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {subscription.fields?.Value_USD 
                      ? formatCurrency(subscription.fields.Value_USD, 'USD')
                      : subscription.fields?.Value
                        ? formatCurrency(subscription.fields.Value, subscription.fields.Currency || 'USD')
                        : '-'}
                  </td>
                  <td className="py-2 px-3">{subscription.fields?.Gateway || '-'}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      subscription.fields?.Status === 'active' ? 'bg-green-100 text-green-800' :
                      subscription.fields?.Status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      subscription.fields?.Status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {subscription.fields?.Status || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {subscription.fields?.CreateDate 
                      ? new Date(subscription.fields.CreateDate).toLocaleDateString() 
                      : '-'}
                  </td>
                  <td className="py-2 px-3">
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
                      onClick={() => window.location.href = `/operations/subscriptions/${subscription.id}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 