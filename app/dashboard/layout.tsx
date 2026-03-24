"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { AuthCheck } from "@/components/auth-check"
import { MobileNav } from "@/components/mobile-nav"
import { PenIcon } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <AuthCheck>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <DashboardNav />
        </div>

        {/* Mobile header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <MobileNav user={user} />
              <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <PenIcon className="h-6 w-6 text-teal-500" />
                <span className="text-xl font-bold">MindJournal</span>
              </Link>
            </div>
            <ModeToggle />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto md:pt-0 pt-14">{children}</div>
      </div>
    </AuthCheck>
  )
}
