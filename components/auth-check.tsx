"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")

    if (currentUser) {
      const parsedUser = JSON.parse(currentUser)
      setUser(parsedUser)
      setIsAuthenticated(true)

      // If user is trying to access admin pages but is not a superadmin
      if (pathname.startsWith("/admin") && parsedUser.role !== "superadmin") {
        router.push("/dashboard")
      }
    } else {
      router.push("/login")
    }

    setIsLoading(false)
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
