"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart3Icon,
  CalendarIcon,
  CogIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PenIcon,
  PlusIcon,
  SearchIcon,
  DownloadIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { useEffect, useState } from "react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function DashboardNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Check if mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboardIcon className="h-5 w-5" />,
    },
    {
      title: "Journal",
      href: "/journal",
      icon: <PenIcon className="h-5 w-5" />,
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart3Icon className="h-5 w-5" />,
    },
    {
      title: "Search",
      href: "/search",
      icon: <SearchIcon className="h-5 w-5" />,
    },
    {
      title: "Wellness",
      href: "/wellness",
      icon: <HeartIcon className="h-5 w-5" />,
    },
    {
      title: "Export Data",
      href: "/export",
      icon: <DownloadIcon className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <CogIcon className="h-5 w-5" />,
    },
  ]

  // Add admin link if user is superadmin
  if (user && user.role === "superadmin") {
    navItems.push({
      title: "Admin Panel",
      href: "/admin",
      icon: <CogIcon className="h-5 w-5" />,
    })
  }

  return (
    <div className="flex h-screen flex-col border-r border-border bg-card text-card-foreground transition-colors duration-300">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80">
          <PenIcon className="h-6 w-6 text-teal-500" />
          <span>MindJournal</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent",
                pathname === item.href && "bg-secondary text-foreground font-semibold",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Link href="/journal/new">
          <Button className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg gap-2">
            <PlusIcon className="h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <ModeToggle />
          <Link href="/logout">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <LogOutIcon className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
