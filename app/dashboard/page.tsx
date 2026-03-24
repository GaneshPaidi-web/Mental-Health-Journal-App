"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, PenIcon, PlusIcon } from "lucide-react"
import type { JournalEntry, MoodData } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { MoodChart } from "@/components/mood-chart"
import { RecentEntries } from "@/components/recent-entries"
import { MoodSelector } from "@/components/mood-selector"
import { useToast } from "@/hooks/use-toast"
import { getUserEntries, getUserMoodData, saveUserMoodData } from "@/lib/journal-service"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [todaysMood, setTodaysMood] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Fetch journal entries from API
        const fetchEntries = async () => {
          try {
            const response = await fetch(`/api/entries?userId=${parsedUser.id || parsedUser._id}`)
            if (response.ok) {
              const userEntries = await response.json()
              setEntries(userEntries)

              // Check if user has an entry today for mood
              const today = new Date().toISOString().split("T")[0]
              const todayEntry = userEntries.find((e: JournalEntry) => e.date.split("T")[0] === today)
              if (todayEntry) {
                setTodaysMood(todayEntry.mood)
              }
            }
          } catch (error) {
            console.error("Error fetching entries:", error)
          } finally {
            setIsLoading(false)
          }
        }

        fetchEntries()
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Error",
          description: "There was a problem loading your data. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [toast])

  const handleMoodSelect = (mood: string) => {
    if (!user) return

    try {
      const today = new Date().toISOString()
      const moodData = getUserMoodData(user.id)

      // Check if mood already logged today
      const todayIndex = moodData.findIndex((m: MoodData) => m.date.split("T")[0] === today.split("T")[0])

      if (todayIndex >= 0) {
        // Update existing mood
        moodData[todayIndex].mood = mood
      } else {
        // Add new mood
        moodData.push({ date: today, mood })
      }

      saveUserMoodData(user.id, moodData)
      setTodaysMood(mood)

      toast({
        title: "Mood logged",
        description: `You're feeling ${mood} today.`,
      })
    } catch (error) {
      console.error("Error saving mood:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your mood. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calculate journaling streak
  const calculateStreak = (entries: JournalEntry[]): number => {
    if (entries.length === 0) return 0

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let streak = 1
    let currentDate = new Date(sortedEntries[0].date)
    currentDate.setHours(0, 0, 0, 0)

    // Check if most recent entry is from today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (currentDate.getTime() !== today.getTime()) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      // If most recent entry is not from yesterday either, streak is broken
      if (currentDate.getTime() !== yesterday.getTime()) {
        return 0
      }
    }

    // Count consecutive days
    for (let i = 1; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date)
      entryDate.setHours(0, 0, 0, 0)

      const expectedDate = new Date(currentDate)
      expectedDate.setDate(expectedDate.getDate() - 1)

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    return streak
  }

  const streak = calculateStreak(entries)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Link href="/journal/new">
            <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg gap-2">
              <PlusIcon className="h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>
      </div>

      {!isLoading && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                <PenIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entries.length}</div>
                <p className="text-xs text-muted-foreground">
                  {entries.length > 0
                    ? `Last entry: ${formatDate(entries[0]?.date || new Date().toISOString())}`
                    : "No entries yet"}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Journaling Streak</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streak} days</div>
                <p className="text-xs text-muted-foreground">
                  {streak > 0 ? "Keep it up!" : "Start journaling today!"}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">How are you feeling today?</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodSelector selectedMood={todaysMood} onSelect={handleMoodSelect} />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:w-[400px] rounded-lg">
              <TabsTrigger value="overview" className="rounded-lg">
                Overview
              </TabsTrigger>
              <TabsTrigger value="recent" className="rounded-lg">
                Recent Entries
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Mood Trends</CardTitle>
                    <CardDescription>Your mood patterns over the past 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <MoodChart userId={user?.id} entries={entries} />
                  </CardContent>
                </Card>
                <Card className="col-span-3 rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Common Tags</CardTitle>
                    <CardDescription>Frequently used tags in your journal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {entries.length > 0 ? (
                        // Get unique tags from all entries and display the most common ones
                        Array.from(new Set(entries.flatMap((entry) => entry.tags)))
                          .slice(0, 9)
                          .map((tag) => (
                            <div key={tag} className="bg-muted px-3 py-1 rounded-full text-sm">
                              {tag}
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No tags yet. Start journaling to see your common themes.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="recent" className="space-y-4">
              <RecentEntries entries={entries} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
