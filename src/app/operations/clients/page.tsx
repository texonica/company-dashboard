'use client'

import { useState, useEffect } from 'react'
import { AITableClient } from '@/lib/api/aitable'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true)
        const response = await fetch('/api/clients')
        
        if (!response.ok) {
          throw new Error(`Error fetching clients: ${response.status}`)
        }
        
        const data = await response.json()
        setClients(data)
      } catch (err) {
        console.error('Failed to fetch clients:', err)
        setError(err instanceof Error ? err.message : 'Failed to load clients')
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>
      
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
      
      {!loading && !error && clients.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No clients found.</p>
        </div>
      )}
      
      {!loading && !error && clients.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Website</th>
                <th className="py-2 px-4 border-b text-left">Project Type</th>
                <th className="py-2 px-4 border-b text-left">Created</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{client.name || '[No Name]'}</td>
                  <td className="py-2 px-4">{client.fields?.Email || '-'}</td>
                  <td className="py-2 px-4">
                    {client.fields?.Website?.text ? (
                      <a 
                        href={client.fields.Website.text.startsWith('http') ? client.fields.Website.text : `https://${client.fields.Website.text}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {client.fields.Website.text}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="py-2 px-4">{client.fields?.ProjectType || '-'}</td>
                  <td className="py-2 px-4">
                    {client.fields?.CreateDate ? new Date(client.fields.CreateDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      client.fields?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.fields?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                      onClick={() => window.location.href = `/operations/clients/${client.id}`}
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