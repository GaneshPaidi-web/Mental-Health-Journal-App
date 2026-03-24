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

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
        name: parsedUser.name,
        email: parsedUser.email,
      })
    }
  }, [])

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update user in localStorage
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
      }

      // Update current user
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update user in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === user.id)

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

  const handleDeleteAccount = () => {
    try {
      // Remove user from users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const filteredUsers = users.filter((u: any) => u.id !== user.id)
      localStorage.setItem("users", JSON.stringify(filteredUsers))

      // Clear current user
      localStorage.removeItem("currentUser")

      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="rounded-lg"
                    required
                  />
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
