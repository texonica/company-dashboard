'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { signIn, isAuthenticated, isAuthorized, loading } = useAuth();

  // Only run client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && isAuthenticated && isAuthorized) {
      router.push('/');
    }
  }, [isAuthenticated, isAuthorized, loading, router, mounted]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // Don't render anything during initial SSR
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Texonica Dashboard</h1>
        
        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-4">
            Sign in with your Texonica Google account to access the dashboard.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Currently only authorized for kamil@texonica.com
          </p>
        </div>
        
        <Button 
          onClick={handleSignIn} 
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
} 