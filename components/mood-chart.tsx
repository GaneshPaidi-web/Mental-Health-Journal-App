"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { MoodData, JournalEntry } from "@/lib/types"
import { getUserMoodData, getSampleMoodData } from "@/lib/journal-service"

interface MoodChartProps {
  userId?: string
  entries?: JournalEntry[]
}

export function MoodChart({ userId, entries }: MoodChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (entries && entries.length > 0) {
      prepareMoodChartData(entries)
    } else if (userId) {
      // Fetch if entries not provided (fallback)
      const fetchAndPrepare = async () => {
        try {
          const response = await fetch(`/api/entries?userId=${userId}`)
          if (response.ok) {
            const userEntries = await response.json()
            prepareMoodChartData(userEntries)
          } else {
            prepareMoodChartData(getSampleMoodData())
          }
        } catch (error) {
          console.error("Error fetching mood data:", error)
          prepareMoodChartData(getSampleMoodData())
        }
      }
      fetchAndPrepare()
    } else {
      prepareMoodChartData(getSampleMoodData())
    }
  }, [userId, entries])

  const prepareMoodChartData = (moodData: MoodData[]) => {
    try {
      // Get last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split("T")[0]
      }).reverse()

      // Map mood values to numbers for the chart
      const moodValues: Record<string, number> = {
        happy: 5,
        calm: 4,
        neutral: 3,
        sad: 2,
        anxious: 1,
        angry: 0,
        tired: 2,
      }

      // Create chart data
      const data = last7Days.map((day) => {
        const entry = moodData.find((m) => m.date.split("T")[0] === day)
        return {
          date: new Date(day).toLocaleDateString("en-US", { weekday: "short" }),
          value: entry ? moodValues[entry.mood] || 3 : null,
          mood: entry?.mood || null,
        }
      })

      setChartData(data)
    } catch (error) {
      console.error("Error preparing mood chart data:", error)
      setChartData([])
    }
  }

  // Get color based on mood
  const getMoodColor = (mood: string | null): string => {
    const moodColors: Record<string, string> = {
      happy: "#10b981", // green
      calm: "#3b82f6", // blue
      neutral: "#8b5cf6", // purple
      sad: "#6b7280", // gray
      anxious: "#f59e0b", // amber
      angry: "#ef4444", // red
      tired: "#8b5cf6", // purple
    }

    return mood ? moodColors[mood] || "#14b8a6" : "#14b8a6"
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const mood = payload[0].payload.mood
      return (
        <div className="bg-card text-card-foreground p-2 rounded-lg shadow-md border text-sm">
          <p className="capitalize" style={{ color: getMoodColor(mood) }}>
            {`Mood: ${mood || "Not recorded"}`}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomBar = (props: any) => {
    const { x, y, width, height, mood } = props
    return <rect x={x} y={y} width={width} height={height} fill={getMoodColor(mood)} rx={4} ry={4} />
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis
          tickFormatter={(value) => {
            const moods = ["Angry", "Anxious", "Sad", "Neutral", "Calm", "Happy"]
            return moods[value] || ""
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" shape={<CustomBar />} isAnimationActive={true} />
      </BarChart>
    </ResponsiveContainer>
  )
}
