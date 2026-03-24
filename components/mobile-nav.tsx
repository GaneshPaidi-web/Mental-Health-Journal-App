"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  BarChart3Icon,
  CalendarIcon,
  CogIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PenIcon,
  PlusIcon,
  SearchIcon,
  DownloadIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function MobileNav({ user }: { user: any }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] max-w-[300px] p-0 bg-background border-r border-border">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2">
            <PenIcon className="h-6 w-6 text-teal-500" />
            <span className="text-foreground">MindJournal</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full bg-background">
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
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4">
            <Link href="/journal/new" onClick={() => setOpen(false)}>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg gap-2">
                <PlusIcon className="h-4 w-4" />
                New Entry
              </Button>
            </Link>
          </div>
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Link href="/logout" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <LogOutIcon className="h-5 w-5" />
                  <span className="sr-only">Log out</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
