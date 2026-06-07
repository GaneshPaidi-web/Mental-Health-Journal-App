"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear current user
    localStorage.removeItem("currentUser")

    // Redirect to home page
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Logging out...</h1>
        <p className="text-gray-500">You will be redirected to the home page.</p>
      </div>
    </div>
  )
}
