"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken, getCurrentUser } from "@/lib/auth-client"

export function AuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    const user = getCurrentUser()
    
    if (token && user) {
      if (user.role === "superadmin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [router])

  return null
}
