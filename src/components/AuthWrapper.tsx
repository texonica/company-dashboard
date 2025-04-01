'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { SettingsProvider } from '@/lib/contexts/SettingsContext';
import { Navigation } from '@/components/Navigation';

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Only run on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {!mounted ? (
        // Show a minimal wrapper during SSR and initial client render
        <div className="min-h-screen bg-gray-50">
          <div className="fixed top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto px-4 h-16 flex items-center">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-6">
                  <span className="font-bold">Texonica Dashboard</span>
                </div>
              </div>
            </div>
          </div>
          <main className="min-h-screen bg-gray-50 pt-16">
            {/* Show nothing else during SSR */}
          </main>
        </div>
      ) : (
        // After hydration, render the full UI with providers
        <AuthProvider>
          <SettingsProvider>
            <Navigation />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </SettingsProvider>
        </AuthProvider>
      )}
    </>
  );
} 