"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PenIcon, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { initializeNewUser } from "@/lib/journal-service"
import { isValidEmail, isValidUsername, checkPasswordStrength, doPasswordsMatch } from "@/lib/validation"
import { Progress } from "@/components/ui/progress"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [passwordStrength, setPasswordStrength] = useState({
    strength: "weak" as "weak" | "medium" | "strong",
    message: "",
    score: 0,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Validate form on input change
  useEffect(() => {
    validateForm()
  }, [formData])

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }

    let isValid = true

    // Validate name
    if (formData.name.trim() === "") {
      errors.name = "Name is required"
      isValid = false
    } else if (!isValidUsername(formData.name)) {
      errors.name = "Name must start with a letter (not a number or special character)"
      isValid = false
    }

    // Validate email
    if (formData.email.trim() === "") {
      errors.email = "Email is required"
      isValid = false
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    // Validate password
    if (formData.password.trim() === "") {
      errors.password = "Password is required"
      isValid = false
    } else {
      const strength = checkPasswordStrength(formData.password)
      setPasswordStrength({
        strength: strength.strength,
        message: strength.message,
        score: strength.strength === "weak" ? 33 : strength.strength === "medium" ? 66 : 100,
      })
    }

    // Validate confirm password
    if (formData.confirmPassword.trim() === "") {
      errors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (!doPasswordsMatch(formData.password, formData.confirmPassword)) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setFormErrors(errors)
    setIsFormValid(isValid)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before submission
    validateForm()
    if (!isFormValid) return

    setIsLoading(true)

    // Store user in MongoDB via API
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Registration failed",
          description: data.message || "There was an error creating your account.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const newUser = data.user

      // Set current user (for session management)
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      // Initialize new user with sample data (Note: this still uses local logic for now, could be API-fied later)
      initializeNewUser(newUser.id)

      toast({
        title: "Account created!",
        description: "You have successfully registered.",
      })

      // Redirect to dashboard or admin panel based on role
      setTimeout(() => {
        if (newUser.role === "superadmin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      }, 1500)
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "There was an error connecting to the server. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <PenIcon className="h-6 w-6 text-teal-500" />
            <span className="text-xl font-bold">MindJournal</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-xl shadow-lg border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Enter your information to get started with MindJournal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`rounded-lg ${formErrors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {formErrors.name && (
                  <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`rounded-lg ${formErrors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {formErrors.email && (
                  <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`rounded-lg pr-10 ${formErrors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </button>
                </div>
                {formErrors.password ? (
                  <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.password}
                  </div>
                ) : (
                  formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Password strength:</span>
                        <span
                          className={`text-xs ${
                            passwordStrength.strength === "weak"
                              ? "text-red-500"
                              : passwordStrength.strength === "medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                          }`}
                        >
                          {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength.score}
                        className={`h-1 ${
                          passwordStrength.strength === "weak"
                            ? "bg-red-500"
                            : passwordStrength.strength === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <p className="text-xs text-gray-500">{passwordStrength.message}</p>
                    </div>
                  )
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`rounded-lg pr-10 ${formErrors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                  </button>
                </div>
                {formErrors.confirmPassword ? (
                  <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.confirmPassword}
                  </div>
                ) : (
                  formData.password &&
                  formData.confirmPassword &&
                  doPasswordsMatch(formData.password, formData.confirmPassword) && (
                    <div className="text-sm text-green-500 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Passwords match
                    </div>
                  )
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
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
