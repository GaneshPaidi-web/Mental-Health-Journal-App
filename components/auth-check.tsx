"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { authFetch, clearAuth, getToken, type AuthUser } from "@/lib/auth-client"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const verifyAuth = async () => {
      const token = getToken()

      if (!token) {
        router.push("/login")
        setIsLoading(false)
        return
      }

      try {
        const response = await authFetch("/api/auth/me")

        if (!response.ok) {
          clearAuth()
          router.push("/login")
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)

        if (pathname.startsWith("/admin") && data.user.role !== "superadmin") {
          router.push("/dashboard")
        }
      } catch {
        clearAuth()
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
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
