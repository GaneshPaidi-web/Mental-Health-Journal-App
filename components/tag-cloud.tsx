"use client"

import { useEffect, useState } from "react"
import type { JournalEntry } from "@/lib/types"
import { getRandomColor } from "@/lib/utils"
import { getUserEntries } from "@/lib/journal-service"

interface TagCloudProps {
  userId?: string
}

export function TagCloud({ userId }: TagCloudProps) {
  const [tags, setTags] = useState<{ tag: string; count: number }[]>([])

  useEffect(() => {
    // Get journal entries
    try {
      let entries: JournalEntry[] = []

      if (userId) {
        entries = getUserEntries(userId)
      }

      if (entries.length > 0) {
        generateTagCloud(entries)
      } else {
        // Create sample data if none exists
        const sampleTags = [
          { tag: "anxiety", count: 8 },
          { tag: "mindfulness", count: 6 },
          { tag: "sleep", count: 5 },
          { tag: "work", count: 4 },
          { tag: "gratitude", count: 3 },
          { tag: "exercise", count: 3 },
          { tag: "meditation", count: 2 },
          { tag: "relationships", count: 2 },
          { tag: "stress", count: 2 },
          { tag: "self-care", count: 1 },
          { tag: "goals", count: 1 },
          { tag: "health", count: 1 },
        ]
        setTags(sampleTags)
      }
    } catch (error) {
      console.error("Error loading tag cloud data:", error)
      // Use sample data as fallback
      const sampleTags = [
        { tag: "anxiety", count: 8 },
        { tag: "mindfulness", count: 6 },
        { tag: "sleep", count: 5 },
        { tag: "work", count: 4 },
        { tag: "gratitude", count: 3 },
      ]
      setTags(sampleTags)
    }
  }, [userId])

  const generateTagCloud = (entries: JournalEntry[]) => {
    try {
      // Count tag occurrences
      const tagCounts: Record<string, number> = {}

      entries.forEach((entry) => {
        entry.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      })

      // Convert to array and sort by count
      const tagArray = Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }))
      tagArray.sort((a, b) => b.count - a.count)

      setTags(tagArray)
    } catch (error) {
      console.error("Error generating tag cloud:", error)
      setTags([])
    }
  }

  // Calculate font size based on tag count
  const getFontSize = (count: number) => {
    if (tags.length === 0) return 20

    const min = 14
    const max = 36
    const maxCount = Math.max(...tags.map((t) => t.count))
    const minCount = Math.min(...tags.map((t) => t.count))

    if (maxCount === minCount) return (min + max) / 2

    const size = min + ((count - minCount) / (maxCount - minCount)) * (max - min)
    return Math.round(size)
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-wrap justify-center items-center gap-4 max-w-2xl">
        {tags.length > 0 ? (
          tags.map(({ tag, count }) => (
            <span
              key={tag}
              className="inline-block transition-transform hover:scale-110"
              style={{
                fontSize: `${getFontSize(count)}px`,
                color: getRandomColor(tag),
                padding: "0.25rem 0.5rem",
              }}
            >
              {tag}
            </span>
          ))
        ) : (
          <p className="text-muted-foreground">No tags available. Start adding tags to your journal entries.</p>
        )}
      </div>
    </div>
  )
}
