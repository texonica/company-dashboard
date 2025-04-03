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
  { id: "opt8", name: "FirstCall", color: "#DBEAFE", bgColor: "bg-sky-100", textColor: "text-sky-800" },
  { id: "opt3", name: "No Show/No Message", color: "#FEF3C7", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
  { id: "opt9", name: "RequestedAccessRights", color: "#E0E7FF", bgColor: "bg-indigo-100", textColor: "text-indigo-800" },
  { id: "opt10", name: "GotAccessRights", color: "#DBEAFE", bgColor: "bg-sky-100", textColor: "text-sky-800" },
  { id: "opt1", name: "AskedTheTeamForAudit", color: "#EEF3FF", bgColor: "bg-blue-100", textColor: "text-blue-800" },
  { id: "opt11", name: "GotAudit", color: "#DCFCE7", bgColor: "bg-green-100", textColor: "text-green-800" },
  { id: "opt7", name: "SentAudit", color: "#E0E7FF", bgColor: "bg-indigo-100", textColor: "text-indigo-800" },
  { id: "opt12", name: "ClientCall", color: "#FEF3C7", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
  { id: "opt13", name: "ReachOutLater", color: "#DBEAFE", bgColor: "bg-sky-100", textColor: "text-sky-800" },
  { id: "opt6", name: "Won", color: "#D1FAE5", bgColor: "bg-emerald-100", textColor: "text-emerald-800" },
  { id: "opt14", name: "Lost", color: "#FEE2E2", bgColor: "bg-red-100", textColor: "text-red-800" },
  { id: "opt2", name: "Unqualified", color: "#FEE2E2", bgColor: "bg-red-100", textColor: "text-red-800" },
  { id: "opt4", name: "NonResponsive", color: "#FFEDD5", bgColor: "bg-orange-100", textColor: "text-orange-800" },
  { id: "opt15", name: "https://calendly.com/texonica/f", color: "#DCFCE7", bgColor: "bg-green-100", textColor: "text-green-800" },
  { id: "opt16", name: "4s", color: "#DCFCE7", bgColor: "bg-green-100", textColor: "text-green-800" },
  { id: "opt5", name: "Qualified", color: "#DCFCE7", bgColor: "bg-green-100", textColor: "text-green-800" }
]

type CRMStageDropdownProps = {
  recordId: string
  currentStage: string
  onSuccess?: (newStage: string) => void
  onError?: (error: string) => void
}

export function CRMStageDropdown({ recordId, currentStage, onSuccess, onError }: CRMStageDropdownProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [stage, setStage] = useState(currentStage)

  const handleStageChange = async (newStage: string) => {
    if (newStage === stage) return

    setIsLoading(true)
    try {
      console.log(`Updating CRM record ${recordId} stage to ${newStage}`)
      
      const response = await fetch(`/api/leadgen/crm/${recordId}`, {
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
        const data = await response.json()
        throw new Error(data.error || data.message || 'Failed to update stage')
      }

      // If we got here, the update was successful
      setStage(newStage)
      if (onSuccess) onSuccess(newStage)
    } catch (error) {
      console.error('Error updating CRM stage:', error)
      if (onError) onError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  // Get background and text colors for the stage
  const getStageStyle = (stageName: string) => {
    const option = stageOptions.find(opt => opt.name === stageName)
    return {
      bgColor: option?.bgColor || "bg-gray-100",
      textColor: option?.textColor || "text-gray-800"
    }
  }

  const { bgColor, textColor } = getStageStyle(stage)

  return (
    <div className="relative">
      <Select
        disabled={isLoading}
        value={stage}
        onValueChange={handleStageChange}
      >
        <SelectTrigger 
          className={`w-[180px] ${bgColor} ${textColor}`}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          <SelectValue placeholder="Select a stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {stageOptions.map((option) => (
              <SelectItem 
                key={option.id} 
                value={option.name}
                className={`px-2 py-1 hover:bg-gray-50 ${option.bgColor} ${option.textColor}`}
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