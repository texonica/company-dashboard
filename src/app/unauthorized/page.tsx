'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function UnauthorizedPage() {
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Only run client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during initial SSR
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Unauthorized Access</h1>
        
        {user && (
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Signed in as: <span className="font-medium">{user.email}</span>
            </p>
            <p className="text-gray-600">
              You don't have permission to access this application. 
              Currently, only kamil@texonica.com is authorized to access the dashboard.
            </p>
          </div>
        )}
        
        {!user && (
          <p className="text-gray-600 mb-6">
            Please sign in with an authorized account to access the dashboard.
          </p>
        )}
        
        <div className="flex justify-center space-x-4">
          {user ? (
            <Button
              onClick={() => signOut()}
              className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = '/login'}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Go to Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 