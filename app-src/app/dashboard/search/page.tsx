'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAITable } from '@/lib/contexts/aitable-context';

export default function SearchPage() {
  const { service, selectedSpaceId } = useAITable();
  
  const [keyword, setKeyword] = useState<string>('');
  const [nodeType, setNodeType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSpaceId) {
      setError(new Error('No space selected'));
      return;
    }
    
    if (!keyword.trim()) {
      setError(new Error('Please enter a search keyword'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const results = await service.searchNodes(
        keyword,
        nodeType || undefined,
        selectedSpaceId
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching nodes:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search</h1>
      
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Search Keyword
            </label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter search keyword"
            />
          </div>
          
          <div>
            <label htmlFor="nodeType" className="block text-sm font-medium text-gray-700 mb-1">
              Node Type (optional)
            </label>
            <select
              id="nodeType"
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Types</option>
              <option value="Datasheet">Datasheet</option>
              <option value="Form">Form</option>
              <option value="Dashboard">Dashboard</option>
              <option value="Folder">Folder</option>
            </select>
          </div>
          
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isLoading || !selectedSpaceId}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error.message}</span>
            </div>
          )}
          
          {!selectedSpaceId && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">No space selected!</strong>
              <span className="block sm:inline"> Please select a space from the sidebar.</span>
            </div>
          )}
        </form>
      </div>
      
      {/* Search Results */}
      {hasSearched && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Search Results</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <p className="text-gray-500">No results found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((node) => (
                    <tr key={node.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {node.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {node.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {node.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {node.type === 'Datasheet' && (
                          <Link 
                            href={`/dashboard/datasheets/${node.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 