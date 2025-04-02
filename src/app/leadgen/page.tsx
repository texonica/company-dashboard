'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserRole } from '@/lib/firebase'

function LeadgenPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/leadgen/uw')
  }, [router])

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Redirecting to UW Leadgen...</p>
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