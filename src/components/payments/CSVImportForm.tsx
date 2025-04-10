'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImportResult } from '@/lib/types/payments';

export function CSVImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a CSV file to import');
      return;
    }
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a valid CSV file');
      return;
    }
    
    setIsUploading(true);
    setProgress(10);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      setProgress(30);
      
      const response = await fetch('/api/payments/import', {
        method: 'POST',
        body: formData
      });
      
      setProgress(90);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import CSV');
      }
      
      const data = await response.json();
      setResult(data);
      
      // Reset form on success
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
      
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'An error occurred during import');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Import Payments from CSV</CardTitle>
        <CardDescription>
          Upload a CSV file containing payment data to import into the system.
          The system will attempt to match payments to clients automatically.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="file">CSV File</Label>
              <Input
                id="file"
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {result && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Import Summary</h3>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between p-2 bg-gray-100 rounded">
                    <span>Total Records:</span>
                    <span className="font-mono">{result.total}</span>
                  </div>
                  
                  <div className="flex justify-between p-2 bg-green-100 rounded">
                    <span>Successfully Imported:</span>
                    <span className="font-mono">{result.imported}</span>
                  </div>
                  
                  <div className="flex justify-between p-2 bg-blue-100 rounded">
                    <span>Client Matched:</span>
                    <span className="font-mono">{result.matched}</span>
                  </div>
                  
                  <div className="flex justify-between p-2 bg-yellow-100 rounded">
                    <span>Client Unmatched:</span>
                    <span className="font-mono">{result.unmatched}</span>
                  </div>
                  
                  {result.failed > 0 && (
                    <div className="flex justify-between p-2 bg-red-100 rounded col-span-2">
                      <span>Failed:</span>
                      <span className="font-mono">{result.failed}</span>
                    </div>
                  )}
                </div>
                
                {result.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-red-600">Errors:</h4>
                    <ul className="list-disc list-inside mt-1 text-sm">
                      {result.errors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-red-600">{error}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>...and {result.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
                
                {result.unmatched > 0 && (
                  <div className="pt-2">
                    <Button variant="outline" onClick={() => window.location.href = '/payments/reconciliation'}>
                      View Unmatched Payments
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.href = '/payments'}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={!file || isUploading}
        >
          {isUploading ? 'Importing...' : 'Import CSV'}
        </Button>
      </CardFooter>
    </Card>
  );
} 