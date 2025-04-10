'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Check, X, Loader2, RefreshCw } from 'lucide-react';

export default function ChargebeeSyncButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setResult(null);
      
      const response = await fetch('/api/payments/sync', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync subscriptions');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleSync} 
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Syncing Chargebee Subscriptions
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Chargebee Subscriptions
          </>
        )}
      </Button>
      
      {error && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {result && (
        <Alert variant={result.failed > 0 ? 'warning' : 'success'}>
          <Check className="h-4 w-4" />
          <AlertTitle>Sync Complete</AlertTitle>
          <AlertDescription>
            Added: {result.added} | 
            Updated: {result.updated} | 
            Failed: {result.failed}
            {result.failed > 0 && ` (Check console for details)`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 