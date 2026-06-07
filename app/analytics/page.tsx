"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MoodData } from "@/lib/types"
import { MoodChart } from "@/components/mood-chart"
import { EntryFrequencyChart } from "@/components/entry-frequency-chart"
import { TagCloud } from "@/components/tag-cloud"
import { BackToDashboard } from "@/components/back-to-dashboard"
import { getUserMoodData } from "@/lib/journal-service"

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [moodData, setMoodData] = useState<MoodData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Get mood data for this user
      const userMoodData = getUserMoodData(parsedUser.id)
      setMoodData(userMoodData)
    }

    setIsLoading(false)
  }, [])

  const generateSampleMoodData = (): MoodData[] => {
    const moods = ["happy", "calm", "sad", "anxious", "angry", "tired"]
    const today = new Date()

    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      return {
        date: date.toISOString(),
        mood: moods[Math.floor(Math.random() * moods.length)],
      }
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <BackToDashboard />
      </div>

      {!isLoading && (
        <Tabs defaultValue="mood" className="space-y-4">
          <TabsList className="grid grid-cols-3 md:w-[400px] rounded-lg">
            <TabsTrigger value="mood" className="rounded-lg">
              Mood Trends
            </TabsTrigger>
            <TabsTrigger value="frequency" className="rounded-lg">
              Entry Frequency
            </TabsTrigger>
            <TabsTrigger value="tags" className="rounded-lg">
              Tag Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-4">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Mood Trends</CardTitle>
                <CardDescription>Track how your mood has changed over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <MoodChart userId={user?.id} />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Most Common Mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">Calm</div>
                  <p className="text-sm text-gray-500">Based on your journal entries</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Mood Variability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Moderate</div>
                  <p className="text-sm text-gray-500">Your mood tends to be relatively stable</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Mood Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">+15%</div>
                  <p className="text-sm text-gray-500">Compared to last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="frequency" className="space-y-4">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Entry Frequency</CardTitle>
                <CardDescription>Track how often you journal</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <EntryFrequencyChart userId={user?.id} />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Total Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-sm text-gray-500">Since you started journaling</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3 days</div>
                  <p className="text-sm text-gray-500">Keep it up!</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Best Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5 days</div>
                  <p className="text-sm text-gray-500">Your longest journaling streak</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Tag Cloud</CardTitle>
                <CardDescription>Visualize the most common themes in your journal</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <TagCloud userId={user?.id} />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Top Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>anxiety</span>
                      <span className="text-gray-500">8 entries</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>mindfulness</span>
                      <span className="text-gray-500">6 entries</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>sleep</span>
                      <span className="text-gray-500">5 entries</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>work</span>
                      <span className="text-gray-500">4 entries</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>gratitude</span>
                      <span className="text-gray-500">3 entries</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Tag Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>Anxiety</strong> appears most frequently in your entries, often paired with tags related to
                    work and sleep.
                  </p>
                  <p>
                    Entries tagged with <strong>mindfulness</strong> tend to have more positive mood ratings.
                  </p>
                  <p>
                    Consider exploring more <strong>gratitude</strong> practices, as these entries correlate with
                    improved mood.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
