'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createLogger } from '@/lib/logger';
import { User } from '@/types/aitable';

const logger = createLogger('dashboard-layout');

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          logger.debug('User data loaded', { username: data.user.username, role: data.user.role });
        } else {
          logger.warn('Failed to load user data');
        }
      } catch (error) {
        logger.error('Error loading user data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Navigation items based on user role
  const getNavItems = () => {
    const items = [
      { href: '/dashboard', label: 'Overview', roles: ['CEO', 'CFO', 'SalesManager', 'PM'] },
      { href: '/dashboard/projects', label: 'Projects', roles: ['CEO', 'PM'] },
      { href: '/dashboard/clients', label: 'Clients', roles: ['CEO', 'SalesManager', 'PM'] },
      { href: '/dashboard/finance', label: 'Finance', roles: ['CEO', 'CFO'] },
      { href: '/dashboard/sales', label: 'Sales', roles: ['CEO', 'SalesManager'] },
      { href: '/dashboard/reports', label: 'Reports', roles: ['CEO', 'CFO', 'SalesManager', 'PM'] },
    ];

    if (!user) return items;

    return items.filter(item => item.roles.includes(user.role));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      logger.error('Logout error', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-secondary text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Company Dashboard</h1>
        </div>
        
        {/* User info */}
        {user && (
          <div className="p-4 border-b border-gray-700">
            <p className="text-sm">{user.username}</p>
            <p className="text-xs text-gray-400">{user.role}</p>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {getNavItems().map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                    pathname === item.href ? 'bg-gray-700' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-4 mt-auto border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {pathname === '/dashboard' ? 'Overview' : 
               pathname.split('/').pop() ? 
                 pathname.split('/').pop()!.charAt(0).toUpperCase() + pathname.split('/').pop()!.slice(1) : 
                 'Dashboard'}
            </h2>
          </div>
        </header>
        
        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 