// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import AuthWrapper from '@/components/AuthWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Texonica Dashboard',
  description: 'Company dashboard for Texonica',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
} 