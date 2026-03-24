"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PenIcon, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid reset link. Please request a new one.")
    }
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword: password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to reset password. The link may have expired.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        title: "Error",
        description: "There was an error connecting to the server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-teal-900/20 border border-teal-800 rounded-lg p-6 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-teal-500 mx-auto" />
        <h3 className="text-xl font-medium">Password Reset Successful</h3>
        <p className="text-sm text-gray-400">
          Your password has been updated. You'll be redirected to the login page in a few seconds.
        </p>
        <div className="pt-2">
            <Link href="/login">
                <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg w-full">
                    Proceed to Login Now
                </Button>
            </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-500 bg-red-900/10 border border-red-900/20 p-3 rounded-lg flex items-center gap-2 mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg pr-10"
            disabled={!token || !email}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your new password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-lg"
          disabled={!token || !email}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg mt-2" 
        disabled={isLoading || !token || !email}
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>

      {(!token || !email) && (
          <div className="text-center pt-4">
              <Link href="/forgot-password">
                  <Button variant="link" className="text-teal-500">
                      Request a new reset link
                  </Button>
              </Link>
          </div>
      )}
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <PenIcon className="h-6 w-4 text-teal-500" />
            <span className="text-xl font-bold">MindJournal</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-xl shadow-lg border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Password</CardTitle>
            <CardDescription>
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-800 mt-4 pt-4">
            <p className="text-sm text-gray-500">
              Remembered your password?{" "}
              <Link href="/login" className="text-teal-500 hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
