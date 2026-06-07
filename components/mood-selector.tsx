"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MoodSelectorProps {
  selectedMood: string | null
  onSelect: (mood: string) => void
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const moods = [
    { name: "happy", emoji: "😊", color: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300" },
    { name: "calm", emoji: "😌", color: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300" },
    { name: "sad", emoji: "😔", color: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300" },
    { name: "anxious", emoji: "😰", color: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300" },
    { name: "angry", emoji: "😠", color: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300" },
    { name: "tired", emoji: "😴", color: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <Button
          key={mood.name}
          variant="outline"
          className={cn(
            "flex flex-col h-auto py-2 px-4 rounded-xl border-2 hover:bg-muted",
            selectedMood === mood.name && "border-teal-500 bg-teal-50 dark:bg-teal-900/20",
            !selectedMood && mood.color,
          )}
          onClick={() => onSelect(mood.name)}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="mt-1 capitalize">{mood.name}</span>
        </Button>
      ))}
    </div>
  )
}
