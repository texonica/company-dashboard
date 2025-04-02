'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Settings, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useState } from 'react'

export function Navigation() {
    const pathname = usePathname()
    const { user, signOut, userRole } = useAuth()
    const [leadgenOpen, setLeadgenOpen] = useState(false)

    return (
        <nav className="fixed top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto px-4 h-16 flex items-center">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="flex items-center">
                            <span className="font-bold">
                                Texonica Dashboard
                            </span>
                        </Link>
                        <Link
                            href="/"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-foreground/80",
                                pathname === "/" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Projects
                        </Link>
                        <div className="relative">
                            <button 
                                onClick={() => setLeadgenOpen(!leadgenOpen)}
                                className={cn(
                                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                                    pathname.startsWith("/leadgen") && !pathname.includes("/leadgen/crm") ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                Leadgen
                                <ChevronDown size={16} className="ml-1" />
                            </button>
                            {leadgenOpen && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white shadow-md rounded-md py-1 z-10">
                                    <Link
                                        href="/leadgen/uw"
                                        className={cn(
                                            "block px-4 py-2 text-sm transition-colors hover:bg-gray-100",
                                            pathname === "/leadgen/uw" ? "text-foreground font-medium" : "text-foreground/60"
                                        )}
                                        onClick={() => setLeadgenOpen(false)}
                                    >
                                        UW Leadgen
                                    </Link>
                                    <Link
                                        href="/leadgen/fvr"
                                        className={cn(
                                            "block px-4 py-2 text-sm transition-colors hover:bg-gray-100",
                                            pathname === "/leadgen/fvr" ? "text-foreground font-medium" : "text-foreground/60"
                                        )}
                                        onClick={() => setLeadgenOpen(false)}
                                    >
                                        FVR Leadgen
                                    </Link>
                                </div>
                            )}
                        </div>
                        <Link
                            href="/leadgen/crm"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-foreground/80",
                                pathname === "/leadgen/crm" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            CRM
                        </Link>
                        <Link
                            href="/terms"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-foreground/80",
                                pathname === "/terms" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Search Terms
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center text-sm text-gray-600 mr-4">
                                <User size={16} className="mr-1" />
                                <span>{user.email}</span>
                                {userRole && (
                                    <span className="ml-2 px-2 py-1 rounded-full bg-gray-100 text-xs">
                                        {userRole}
                                    </span>
                                )}
                            </div>
                        )}
                        <Link
                            href="/settings"
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathname === "/settings" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            <Settings size={20} />
                        </Link>
                        {user && (
                            <button
                                onClick={() => signOut()}
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
} 