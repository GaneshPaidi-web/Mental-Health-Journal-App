"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ModeToggle } from "@/components/mode-toggle"
import { clearAuth, authFetch } from "@/lib/auth-client"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
  })
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    moodPrompt: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        dob: parsedUser.dob || "",
        gender: parsedUser.gender || "",
      })
    }
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call backend to update user profile in MongoDB
      const response = await authFetch("/api/user", {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          dob: formData.dob,
          gender: formData.gender,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile on server")
      }

      const data = await response.json()
      const updatedUser = data.user

      // Update current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update user in users array (local fallback)
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === updatedUser.id)

      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem("users", JSON.stringify(users))
      }

      setUser(updatedUser)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    toast({
      title: "Notification settings updated",
      description: `${key} notifications ${notifications[key] ? "disabled" : "enabled"}.`,
    })
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      // Call backend to delete user and all associated data from MongoDB
      const response = await authFetch("/api/user", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete account on server")
      }

      // Remove user from local users array for client-side state
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const filteredUsers = users.filter((u: any) => u.id !== user.id)
      localStorage.setItem("users", JSON.stringify(filteredUsers))

      clearAuth()

      toast({
        title: "Account deleted",
        description: "Your account and all your data have been deleted successfully.",
      })

      // Redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Account deletion error:", error)
      toast({
        title: "Deletion failed",
        description: "There was an error deleting your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px] rounded-lg">
          <TabsTrigger value="profile" className="rounded-lg">
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="rounded-lg bg-muted text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 rounded-lg" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions that affect your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Deleting your account will remove all your data and cannot be undone.</p>
              <Button variant="destructive" className="rounded-lg" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how MindJournal looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="flex items-center gap-2">
                  <ModeToggle />
                  <span className="text-sm text-gray-500">Choose between light, dark, or system theme</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-reminder">Daily Reminder</Label>
                  <p className="text-sm text-gray-500">Receive a daily reminder to journal</p>
                </div>
                <Switch
                  id="daily-reminder"
                  checked={notifications.dailyReminder}
                  onCheckedChange={() => handleNotificationChange("dailyReminder")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-report">Weekly Report</Label>
                  <p className="text-sm text-gray-500">Receive a weekly summary of your mood and journaling</p>
                </div>
                <Switch
                  id="weekly-report"
                  checked={notifications.weeklyReport}
                  onCheckedChange={() => handleNotificationChange("weeklyReport")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mood-prompt">Mood Prompts</Label>
                  <p className="text-sm text-gray-500">Receive prompts to log your mood throughout the day</p>
                </div>
                <Switch
                  id="mood-prompt"
                  checked={notifications.moodPrompt}
                  onCheckedChange={() => handleNotificationChange("moodPrompt")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                Note: Since this is a web application, notifications will only appear when the app is open.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
