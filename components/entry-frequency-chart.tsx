"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { JournalEntry } from "@/lib/types"
import { getUserEntries } from "@/lib/journal-service"

interface EntryFrequencyChartProps {
  userId?: string
}

export function EntryFrequencyChart({ userId }: EntryFrequencyChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Get journal entries
    let entries: JournalEntry[] = []

    try {
      if (userId) {
        entries = getUserEntries(userId)
      }

      // If no entries, use sample data
      if (entries.length === 0) {
        entries = generateSampleEntries()
      }

      prepareChartData(entries)
    } catch (error) {
      console.error("Error loading chart data:", error)
      // Use sample data as fallback
      prepareChartData(generateSampleEntries())
    }
  }, [userId])

  const prepareChartData = (entries: JournalEntry[]) => {
    try {
      // Get last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split("T")[0]
      }).reverse()

      // Count entries per day
      const entryCounts = last30Days.map((day) => {
        const count = entries.filter((entry) => new Date(entry.date).toISOString().split("T")[0] === day).length

        return {
          date: new Date(day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          count,
        }
      })

      setChartData(entryCounts)
    } catch (error) {
      console.error("Error preparing chart data:", error)
      setChartData([])
    }
  }

  const generateSampleEntries = (): JournalEntry[] => {
    const entries: JournalEntry[] = []
    const today = new Date()

    // Generate random entries over the last 30 days
    for (let i = 0; i < 20; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))

      entries.push({
        id: `sample-${i}`,
        title: `Sample Entry ${i}`,
        date: date.toISOString(),
        content: "This is a sample journal entry.",
        tags: ["sample"],
        mood: "neutral",
      })
    }

    return entries
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card text-card-foreground p-2 rounded-lg shadow-md border text-sm">
          <p>{`${payload[0].payload.date}: ${payload[0].value} ${payload[0].value === 1 ? "entry" : "entries"}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="date" tickLine={false} axisLine={true} tick={{ fontSize: 12 }} interval="preserveStartEnd" />
        <YAxis allowDecimals={false} tickLine={false} axisLine={true} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} isAnimationActive={true} />
      </BarChart>
    </ResponsiveContainer>
  )
}
