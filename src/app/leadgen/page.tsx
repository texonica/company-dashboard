'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserRole } from '@/lib/firebase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function LeadgenPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('uw')

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/leadgen/${value}`)
  }
  
  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leadgen</h1>
      </div>
      
      <Tabs defaultValue="uw" value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="uw">UW Leadgen</TabsTrigger>
          <TabsTrigger value="fvr">FVR Leadgen</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Select a Leadgen Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/leadgen/uw" 
              className="bg-blue-50 border border-blue-100 p-4 rounded-lg hover:bg-blue-100 transition-colors">
              <h3 className="text-lg font-medium text-blue-800 mb-2">UW Leadgen</h3>
              <p className="text-sm text-gray-600">
                View metrics and data for UW Leadgen campaigns including sent messages, view rates, 
                interview rates, calls, hires, and costs.
              </p>
            </Link>
            
            <Link href="/leadgen/fvr" 
              className="bg-purple-50 border border-purple-100 p-4 rounded-lg hover:bg-purple-100 transition-colors">
              <h3 className="text-lg font-medium text-purple-800 mb-2">FVR Leadgen</h3>
              <p className="text-sm text-gray-600">
                View metrics and data for FVR Leadgen campaigns including impressions, clicks, 
                orders, ad spend, and leads for GIG 1 and GIG 2.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LeadgenPageWithProtection() {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.PM, UserRole.VA]}>
      <LeadgenPage />
    </ProtectedRoute>
  )
} 