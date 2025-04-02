'use client'

import React, { useState } from 'react'
import { format, subDays, subMonths, subYears, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, addDays } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'

export interface DateRange {
  startDate: Date
  endDate: Date
}

interface DateRangeSelectorProps {
  onRangeChange: (range: DateRange) => void
  className?: string
}

export function DateRangeSelector({ onRangeChange, className = '' }: DateRangeSelectorProps) {
  const today = new Date()
  // Set default range to last 4 weeks
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: subDays(today, 28),
    endDate: today
  })
  const [isOpen, setIsOpen] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [showCustomRange, setShowCustomRange] = useState(false)

  const applyDateRange = (range: DateRange) => {
    setDateRange(range)
    onRangeChange(range)
    setIsOpen(false)
    // Reset expanded sections
    setShowPresets(false)
    setShowCustomRange(false)
  }

  const presetOptions = [
    {
      label: 'Last Month',
      range: {
        startDate: startOfMonth(subMonths(today, 1)),
        endDate: endOfMonth(subMonths(today, 1))
      }
    },
    {
      label: 'Last 2 Months',
      range: {
        startDate: startOfMonth(subMonths(today, 2)),
        endDate: today
      }
    },
    {
      label: 'Last Quarter',
      range: {
        startDate: startOfQuarter(subMonths(today, 3)),
        endDate: endOfQuarter(subMonths(today, 3))
      }
    },
    {
      label: 'Last 2 Quarters',
      range: {
        startDate: startOfQuarter(subMonths(today, 6)),
        endDate: today
      }
    },
    {
      label: 'Last 3 Quarters',
      range: {
        startDate: startOfQuarter(subMonths(today, 9)),
        endDate: today
      }
    },
    {
      label: 'Last Year',
      range: {
        startDate: subYears(today, 1),
        endDate: today
      }
    },
    {
      label: 'Last 2 Years',
      range: {
        startDate: subYears(today, 2),
        endDate: today
      }
    },
    {
      label: 'All Time',
      range: {
        startDate: new Date(2020, 0, 1), // Assuming data starts from 2020
        endDate: today
      }
    },
    // Add a 4 weeks preset
    {
      label: 'Last 4 Weeks',
      range: {
        startDate: subDays(today, 28),
        endDate: today
      }
    }
  ]

  const formattedRange = `${format(dateRange.startDate, 'MMM d, yyyy')} - ${format(dateRange.endDate, 'MMM d, yyyy')}`

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Popover>
        <PopoverTrigger>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            variant="outline"
          >
            {formattedRange}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <div className="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-[300px]">
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center mb-2 text-sm" 
              onClick={() => setShowPresets(!showPresets)}
            >
              <span>Presets</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showPresets ? 'transform rotate-180' : ''}`} />
            </Button>
            
            {showPresets && (
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {presetOptions.map((option) => (
                    <Button
                      key={option.label}
                      size="sm"
                      variant="outline"
                      className="text-xs h-8"
                      onClick={() => applyDateRange(option.range)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center mb-2 text-sm" 
              onClick={() => setShowCustomRange(!showCustomRange)}
            >
              <span>Custom Range</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showCustomRange ? 'transform rotate-180' : ''}`} />
            </Button>
            
            {showCustomRange && (
              <div className="space-y-2">
                <div className="flex flex-col space-y-2">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Start date</div>
                    <Calendar
                      mode="single"
                      selected={dateRange.startDate}
                      onSelect={(date) => 
                        date && date instanceof Date && setDateRange({ ...dateRange, startDate: date })
                      }
                      maxDate={dateRange.endDate}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">End date</div>
                    <Calendar
                      mode="single"
                      selected={dateRange.endDate}
                      onSelect={(date) => 
                        date && date instanceof Date && setDateRange({ ...dateRange, endDate: date })
                      }
                      minDate={dateRange.startDate}
                      maxDate={today}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    size="sm"
                    onClick={() => applyDateRange(dateRange)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 