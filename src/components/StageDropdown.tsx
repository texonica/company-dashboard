"use client"

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const stageOptions = [
  { id: "optmGFjTrT0cR", name: "Onboarding", color: "#EAF9F3" },
  { id: "optwMNgYEc8b7", name: "Launched", color: "#EEF3FF" },
  { id: "opt0b8au38D9r", name: "Paused", color: "#EEFAFF" },
  { id: "optYN7dTG8NZC", name: "Stopped Working", color: "#F2F0FD" }
]

type StageDropdownProps = {
  recordId: string
  currentStage: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function StageDropdown({ recordId, currentStage, onSuccess, onError }: StageDropdownProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [stage, setStage] = useState(currentStage)

  const handleStageChange = async (newStage: string) => {
    if (newStage === stage) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Stage: newStage
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update stage')
      }

      setStage(newStage)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error updating stage:', error)
      if (onError) onError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  // Get background color for the stage
  const getStageColor = (stageName: string) => {
    const option = stageOptions.find(opt => opt.name === stageName)
    return option?.color || "#F2F0FD"
  }

  return (
    <div className="relative">
      <Select
        disabled={isLoading}
        value={stage}
        onValueChange={handleStageChange}
      >
        <SelectTrigger 
          className="w-[180px]"
          style={{ backgroundColor: getStageColor(stage), opacity: isLoading ? 0.7 : 1 }}
        >
          <SelectValue placeholder="Select a stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {stageOptions.map((option) => (
              <SelectItem 
                key={option.id} 
                value={option.name}
                style={{ backgroundColor: option.color }}
                className="px-2 py-1 hover:bg-gray-50"
              >
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded">
          <div className="w-4 h-4 border-2 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
} 