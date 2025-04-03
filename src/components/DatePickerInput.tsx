'use client'

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

type DatePickerInputProps = {
  recordId: string
  currentTimestamp: number | undefined
  fieldName: string
  onSuccess?: (newTimestamp: number) => void
  onError?: (error: string) => void
}

export function DatePickerInput({ 
  recordId, 
  currentTimestamp, 
  fieldName,
  onSuccess, 
  onError 
}: DatePickerInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [date, setDate] = useState<Date | undefined>(
    currentTimestamp ? new Date(currentTimestamp) : undefined
  )
  
  const handleDateChange = async (newDate: Date | [Date, Date] | null) => {
    if (!newDate || Array.isArray(newDate)) return
    
    // Don't do anything if the date hasn't changed
    if (date && newDate.getTime() === date.getTime()) {
      setIsOpen(false)
      return
    }
    
    setDate(newDate)
    setIsOpen(false) // Close the calendar on selection
    setIsEditing(false)
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/leadgen/crm/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            [fieldName]: newDate.getTime() // Convert to timestamp
          }
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.message || `Failed to update ${fieldName}`)
      }

      // If we got here, the update was successful
      if (onSuccess) onSuccess(newDate.getTime())
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error)
      if (onError) onError(error instanceof Error ? error.message : 'Unknown error')
      
      // Revert to previous date on error
      setDate(currentTimestamp ? new Date(currentTimestamp) : undefined)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsEditing(true) // Enter editing mode when opening
    }
  }

  const formattedDate = date 
    ? format(date, 'MMM d, yyyy') // Keep original format to match design
    : 'Select date'

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger onClick={handleOpenChange}>
          <div className={`flex items-center space-x-2 h-8 ${isEditing ? 'text-blue-600' : ''}`}>
            <CalendarIcon className={`h-5 w-5 ${isEditing ? 'text-blue-500' : 'text-gray-500'}`} />
            <span className={isEditing ? 'text-blue-700' : 'text-gray-900'}>{formattedDate}</span>
          </div>
        </PopoverTrigger>
        
        {isOpen && (
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
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