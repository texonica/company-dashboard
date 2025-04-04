'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

type AITableViewButtonProps = {
  recordId: string
  baseId?: string
  viewId?: string
  datasheetId?: string
  className?: string
}

export function AITableViewButton({ 
  recordId,
  baseId = 'dstDfpcYqF2nW6azmR',
  viewId = 'viwvOVJrXYsvy',
  datasheetId = 'dstDfpcYqF2nW6azmR',
  className
}: AITableViewButtonProps) {
  const aiTableUrl = `https://aitable.ai/workbench/${datasheetId}/${viewId}/${recordId}`
  
  const handleOpenAITable = () => {
    window.open(aiTableUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleOpenAITable}
      className={className}
    >
      <ExternalLink className="h-4 w-4 mr-1" />
      View in AITable
    </Button>
  )
} 