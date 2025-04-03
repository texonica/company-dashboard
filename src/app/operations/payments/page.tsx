'use client'

import { useState, useEffect } from 'react'
import { AITablePayment } from '@/lib/api/aitable'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true)
        const response = await fetch('/api/payments')
        
        if (!response.ok) {
          throw new Error(`Error fetching payments: ${response.status}`)
        }
        
        const data = await response.json()
        setPayments(data)
      } catch (err) {
        console.error('Failed to fetch payments:', err)
        setError(err instanceof Error ? err.message : 'Failed to load payments')
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  // Helper function to format currency
  const formatCurrency = (amount: number | undefined, currency: string = 'USD') => {
    if (amount === undefined) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  // Helper function to format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      
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
      
      {!loading && !error && payments.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No payments found.</p>
        </div>
      )}
      
      {!loading && !error && payments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4 border-b text-left">Title</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Client</th>
                <th className="py-2 px-4 border-b text-left">Project</th>
                <th className="py-2 px-4 border-b text-left">Subscription</th>
                <th className="py-2 px-4 border-b text-left">Value</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Payment Method</th>
                <th className="py-2 px-4 border-b text-left">Invoice</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 max-w-xs truncate" title={payment.fields?.Title || payment.name}>
                    {payment.fields?.Title || payment.name || '[No Name]'}
                  </td>
                  <td className="py-2 px-4">{formatDate(payment.fields?.Date)}</td>
                  <td className="py-2 px-4">
                    {payment.client && typeof payment.client === 'object' 
                      ? payment.client.name
                      : Array.isArray(payment.fields?.Client) 
                        ? payment.fields.Client.join(', ')
                        : payment.fields?.Client || '-'}
                  </td>
                  <td className="py-2 px-4">
                    {payment.project && typeof payment.project === 'object' && payment.project.title 
                      ? payment.project.title
                      : Array.isArray(payment.fields?.Project) && payment.fields.Project.length > 0
                        ? payment.fields.Project[0].toString().replace(/^rec/, '')
                        : payment.fields?.Project 
                          ? payment.fields.Project.toString().replace(/^rec/, '')
                          : '-'}
                  </td>
                  <td className="py-2 px-4">
                    {payment.subscription && typeof payment.subscription === 'object'
                      ? payment.subscription.name
                      : payment.fields?.Subscription 
                        ? (typeof payment.fields.Subscription === 'string'
                           ? payment.fields.Subscription.replace(/^rec/, '')
                           : Array.isArray(payment.fields.Subscription)
                             ? payment.fields.Subscription.map((s: string) => s.toString().replace(/^rec/, '')).join(', ')
                             : payment.fields.Subscription.toString())
                        : '-'}
                  </td>
                  <td className="py-2 px-4">
                    {payment.fields?.Value_USD 
                      ? formatCurrency(payment.fields.Value_USD, 'USD')
                      : payment.fields?.Value
                        ? formatCurrency(payment.fields.Value, payment.fields.Currency || 'USD')
                        : '-'}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      payment.fields?.isPaid === 'Yes' ? 'bg-green-100 text-green-800' :
                      payment.fields?.isPaid?.toLowerCase().includes('refund') ? 'bg-red-100 text-red-800' :
                      payment.fields?.isPaid === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.fields?.isPaid || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-2 px-4">{payment.fields?.Payment_method || '-'}</td>
                  <td className="py-2 px-4">
                    {payment.fields?.manual_invoice === 'Yes' ? (
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {payment.fields.manual_invoice_name || 'Manual Invoice'}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-2 px-4">
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                      onClick={() => window.location.href = `/operations/payments/${payment.id}`}
                    >
                      View Details
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