'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

type URLInputProps = {
  recordId: string
  currentURL: string | undefined
  fieldName: string
  onSuccess?: (newURL: string) => void
  onError?: (error: string) => void
}

export function URLInput({ 
  recordId, 
  currentURL, 
  fieldName,
  onSuccess, 
  onError 
}: URLInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [url, setUrl] = useState<string>(currentURL || '')
  
  const handleURLChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Don't do anything if the URL hasn't changed
    if (url === currentURL) {
      setIsOpen(false)
      setIsEditing(false)
      return
    }
    
    setIsOpen(false) // Close the popover
    setIsEditing(false)
    setIsLoading(true)
    
    try {
      // Handle nested paths like "URL.text"
      const payload = fieldName.includes('.')
        ? createNestedFieldPayload(fieldName, url)
        : { [fieldName]: url };
        
      const response = await fetch(`/api/leadgen/crm/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: payload
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.message || `Failed to update ${fieldName}`)
      }

      // If we got here, the update was successful
      if (onSuccess) onSuccess(url)
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error)
      if (onError) onError(error instanceof Error ? error.message : 'Unknown error')
      
      // Revert to previous URL on error
      setUrl(currentURL || '')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Helper function to create a nested field structure
  const createNestedFieldPayload = (path: string, value: string) => {
    const parts = path.split('.');
    const fieldName = parts[0];
    
    if (parts.length === 1) {
      return { [fieldName]: value };
    }
    
    // Create a nested object structure
    // For example: URL.text => { URL: { text: value } }
    const nestedObj: any = {};
    let current = nestedObj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = {};
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = value;
    return nestedObj;
  }

  const handleOpenChange = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsEditing(true) // Enter editing mode when opening
    }
  }

  const displayURL = url || 'N/A'

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger onClick={handleOpenChange}>
          <div className={`flex items-center space-x-2 h-8 ${isEditing ? 'text-blue-600' : ''}`}>
            <Globe className={`h-5 w-5 ${isEditing ? 'text-blue-500' : 'text-gray-500'}`} />
            <span className={isEditing ? 'text-blue-700' : 'text-gray-900'}>{displayURL}</span>
          </div>
        </PopoverTrigger>
        
        {isOpen && (
          <PopoverContent className="w-72 p-4" align="start">
            <form onSubmit={handleURLChange}>
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  Company
                </label>
                <Input
                  id="url"
                  type="text"
                  placeholder="Enter company name"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                      setIsEditing(false)
                      setUrl(currentURL || '')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">Save</Button>
                </div>
              </div>
            </form>
          </PopoverContent>
        )}
      </Popover>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded">
          <div className="w-4 h-4 border-2 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
} 