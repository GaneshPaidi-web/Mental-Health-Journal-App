"use client"

import type React from "react"
import { useEffect } from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { initializeSuperAdmin } from "@/lib/init-superadmin"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    try {
      // Initialize superadmin account
      initializeSuperAdmin()
    } catch (error) {
      console.error("Error initializing superadmin:", error)
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>MindJournal - Mental Health Journal App</title>
        <meta
          name="description"
          content="Track your moods, record your thoughts, and gain insights into your emotional well-being"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
