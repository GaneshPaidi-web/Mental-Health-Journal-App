"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/tag-input"
import { useToast } from "@/hooks/use-toast"
import type { JournalEntry, MoodData } from "@/lib/types"
import { getUserEntries, saveUserEntries, getUserMoodData, saveUserMoodData } from "@/lib/journal-service"
import { BackToDashboard } from "@/components/back-to-dashboard"

export default function NewEntryPage() {
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [mood, setMood] = useState<string | null>("calm")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [detectedEmoji, setDetectedEmoji] = useState("😌")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
        toast({
          title: "Error",
          description: "There was a problem loading your data. Please try again.",
          variant: "destructive",
        })
        router.push("/login")
      }
    } else {
      // Redirect to login if not logged in
      router.push("/login")
    }
  }, [router, toast])

  // Automatic Mood Detection with Debounce
  useEffect(() => {
    if (!content || content.trim().length < 5) {
      setMood("calm")
      setDetectedEmoji("😌")
      return
    }

    const analyzeMood = async () => {
      setIsAnalyzing(true)
      try {
        const response = await fetch("/api/sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: content }),
        })

        if (response.ok) {
          const result = await response.json()
          setMood(result.emotion)
          setDetectedEmoji(result.emoji)
        }
      } catch (error) {
        console.error("Auto-analysis error:", error)
      } finally {
        setIsAnalyzing(false)
      }
    }

    const timer = setTimeout(() => {
      analyzeMood()
    }, 1000) // 1 second debounce

    return () => clearTimeout(timer)
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to create a journal entry.",
        variant: "destructive",
      })
      return
    }

    if (!title || !content || !mood) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Create new entry in MongoDB via API
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title,
          date: new Date().toISOString(),
          content,
          tags,
          mood: mood || "calm",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save entry")
      }

      toast({
        title: "Entry saved",
        description: `Your journal entry has been saved with a ${mood} mood.`,
      })

      // Redirect to journal page
      setTimeout(() => {
        router.push("/journal")
      }, 500)
    } catch (error) {
      console.error("Error saving entry:", error)
      toast({
        title: "Error saving entry",
        description: "There was a problem saving your entry. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">New Journal Entry</h2>
        <BackToDashboard />
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your entry a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Journal Entry</Label>
                {mood && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-full animate-in fade-in zoom-in duration-300">
                    <span className="text-lg">{detectedEmoji}</span>
                    <span className="text-xs font-medium text-teal-700 dark:text-teal-300 capitalize">
                      Detected Mood: {mood}
                      {isAnalyzing && "..."}
                    </span>
                  </div>
                )}
              </div>
              <Textarea
                id="content"
                placeholder="Write your thoughts here... AI will automatically detect your mood!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[250px] rounded-lg focus-visible:ring-teal-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput tags={tags} setTags={setTags} />
              <p className="text-xs text-muted-foreground">Press Enter or comma to add a tag</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 rounded-lg" disabled={isSubmitting}>
                {isSubmitting ? (
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
                    Saving...
                  </>
                ) : (
                  "Save Entry"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
