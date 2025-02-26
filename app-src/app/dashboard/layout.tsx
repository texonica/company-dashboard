'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAITable } from '@/lib/contexts/aitable-context';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isLoading, spaces, datasheets, selectedSpaceId, setSelectedSpaceId } = useAITable();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">AITable Dashboard</h1>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard" 
                className={`block p-2 rounded ${
                  pathname === '/dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                Overview
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/datasheets" 
                className={`block p-2 rounded ${
                  pathname.startsWith('/dashboard/datasheets') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                Datasheets
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/search" 
                className={`block p-2 rounded ${
                  pathname.startsWith('/dashboard/search') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Spaces Dropdown */}
        <div className="p-4 border-t">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Spaces</h2>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading spaces...</p>
          ) : (
            <select
              className="w-full p-2 border rounded"
              value={selectedSpaceId || ''}
              onChange={(e) => setSelectedSpaceId(e.target.value)}
            >
              {spaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name}
                </option>
              ))}
            </select>
          )}
        </div>
        
        {/* Datasheets List */}
        {datasheets.length > 0 && (
          <div className="p-4 border-t">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Datasheets</h2>
            <ul className="space-y-1">
              {datasheets.map((datasheet) => (
                <li key={datasheet.id}>
                  <Link 
                    href={`/dashboard/datasheets/${datasheet.id}`}
                    className={`block p-2 text-sm rounded ${
                      pathname === `/dashboard/datasheets/${datasheet.id}` 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {datasheet.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {pathname === '/dashboard' && 'Overview'}
              {pathname === '/dashboard/datasheets' && 'Datasheets'}
              {pathname === '/dashboard/search' && 'Search'}
              {pathname.startsWith('/dashboard/datasheets/') && 'Datasheet Details'}
            </h2>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 