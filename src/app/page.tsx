// src/app/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useSettings } from '@/lib/contexts/SettingsContext'
import { fetchAllTabsData, getCampaigns } from '@/lib/sheetsData'
import type { AdMetric, DailyMetrics, TabData } from '@/lib/types'
import { calculateDailyMetrics } from '@/lib/metrics'
import { MetricCard } from '@/components/MetricCard'
import { MetricsChart } from '@/components/MetricsChart'
import { CampaignSelect } from '@/components/CampaignSelect'
import { formatCurrency, formatPercent, formatConversions } from '@/lib/utils'
import { COLORS } from '@/lib/config'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserRole } from '@/lib/firebase'
import DashboardContent from '@/components/DashboardContent'

type DisplayMetric = 'impr' | 'clicks' | 'CTR' | 'CPC' | 'cost' |
    'conv' | 'CvR' | 'CPA' | 'value' | 'ROAS'

const metricConfig = {
    impr: { label: 'Impressions', format: (v: number) => v.toLocaleString(), row: 1 },
    clicks: { label: 'Clicks', format: (v: number) => v.toLocaleString(), row: 1 },
    CTR: { label: 'CTR', format: formatPercent, row: 1 },
    CPC: { label: 'CPC', format: (v: number, currency: string) => formatCurrency(v, currency), row: 1 },
    cost: { label: 'Cost', format: (v: number, currency: string) => formatCurrency(v, currency), row: 1 },
    conv: { label: 'Conv', format: formatConversions, row: 2 },
    CvR: { label: 'Conv Rate', format: formatPercent, row: 2 },
    CPA: { label: 'CPA', format: (v: number, currency: string) => formatCurrency(v, currency), row: 2 },
    value: { label: 'Value', format: (v: number, currency: string) => formatCurrency(v, currency), row: 2 },
    ROAS: { label: 'ROAS', format: (v: number) => v.toFixed(2) + 'x', row: 2 }
} as const

export default function DashboardPage() {
    return <DashboardContent />;
}

function DashboardLayout({ children, error }: { children: React.ReactNode, error?: string }) {
    return (
        <div className="container mx-auto px-4 py-12 mt-16">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Build the Agent - Participant Starter Agent</h1>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {children}
        </div>
    )
}