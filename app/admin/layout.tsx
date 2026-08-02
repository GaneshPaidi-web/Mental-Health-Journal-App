"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { authFetch, clearAuth, getToken } from "@/lib/auth-client"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verifyAdmin = async () => {
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
        if (data.user.role === "superadmin") {
          setIsAuthorized(true)
        } else {
          router.push("/dashboard")
        }
      } catch {
        clearAuth()
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    verifyAdmin()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
