"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import type { JournalEntry } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { BackToDashboard } from "@/components/back-to-dashboard"
import { getUserEntries } from "@/lib/journal-service"

export default function CalendarPage() {
  const [user, setUser] = useState<any>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDateEntries, setSelectedDateEntries] = useState<JournalEntry[]>([])

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Get journal entries for this user
      const userEntries = getUserEntries(parsedUser.id)
      setEntries(userEntries)
    }
  }, [])

  useEffect(() => {
    if (selectedDate && entries.length > 0) {
      const selectedDateStr = selectedDate.toISOString().split("T")[0]
      const filteredEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.date).toISOString().split("T")[0]
        return entryDate === selectedDateStr
      })
      setSelectedDateEntries(filteredEntries)
    } else {
      setSelectedDateEntries([])
    }
  }, [selectedDate, entries])

  // Get dates with entries for highlighting in calendar
  const getDatesWithEntries = () => {
    const dates = new Set<string>()
    entries.forEach((entry) => {
      const date = new Date(entry.date).toISOString().split("T")[0]
      dates.add(date)
    })
    return Array.from(dates).map((dateStr) => new Date(dateStr))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Calendar View</h2>
        <BackToDashboard />
      </div>

      <div className="grid gap-4 md:grid-cols-[350px_1fr]">
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Journal Calendar</CardTitle>
            <CardDescription>Select a date to view entries</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: getDatesWithEntries(),
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(20, 184, 166, 0.1)",
                  borderColor: "rgb(20, 184, 166)",
                  color: "rgb(20, 184, 166)",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>{selectedDate ? formatDate(selectedDate.toISOString()) : "Select a date"}</CardTitle>
            <CardDescription>
              {selectedDateEntries.length === 0
                ? "No entries for this date"
                : `${selectedDateEntries.length} ${selectedDateEntries.length === 1 ? "entry" : "entries"} found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEntries.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEntries.map((entry) => (
                  <Link key={entry.id} href={`/journal/${entry.id}`}>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow rounded-xl">
                      <CardHeader className="pb-2">
                        <CardTitle>{entry.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{entry.content}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No journal entries for this date</p>
                <Link href="/journal/new">
                  <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg">Create New Entry</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
