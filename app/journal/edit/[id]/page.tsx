"use client"

import type React from "react"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { TagInput } from "@/components/tag-input"
import { useToast } from "@/hooks/use-toast"
import type { JournalEntry } from "@/lib/types"
import { getUserEntries, saveUserEntries } from "@/lib/journal-service"
import { BackToDashboard } from "@/components/back-to-dashboard"

export default function EditEntryPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const [user, setUser] = useState<any>(null)
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [mood, setMood] = useState<string | null>(null)
  const [detectedEmoji, setDetectedEmoji] = useState("😌")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchEntry = async (id: string) => {
      try {
        const response = await fetch(`/api/entries/${id}`)
        if (response.ok) {
          const foundEntry = await response.json()
          setEntry(foundEntry)
          setTitle(foundEntry.title)
          setContent(foundEntry.content)
          setTags(foundEntry.tags)
          setMood(foundEntry.mood)
        } else {
          toast({
            title: "Entry not found",
            description: "The journal entry you're trying to edit doesn't exist.",
            variant: "destructive",
          })
          router.push("/journal")
        }
      } catch (error) {
        console.error("Error fetching entry:", error)
        toast({
          title: "Error",
          description: "There was a problem loading the entry.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchEntry(params.id)
    } else {
      // Redirect to login if not logged in
      router.push("/login")
      setIsLoading(false)
    }
  }, [params.id, router, toast])

  // Automatic Mood Detection with Debounce
  useEffect(() => {
    // Only analyze if content has actually changed from the original entry
    if (!content || content.trim().length < 5 || (entry && content === entry.content)) {
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
  }, [content, entry])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !entry) {
      toast({
        title: "Error",
        description: "Unable to update entry. Please try again.",
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

    try {
      const response = await fetch(`/api/entries/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          tags,
          mood: mood || "calm",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update entry")
      }

      toast({
        title: "Entry updated",
        description: "Your journal entry has been updated successfully.",
      })

      // Redirect to journal entry page
      setTimeout(() => {
        router.push(`/journal/${params.id}`)
      }, 500)
    } catch (error) {
      console.error("Error updating entry:", error)
      toast({
        title: "Error updating entry",
        description: "There was a problem updating your entry. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="flex-1 p-8">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <p>The journal entry you're trying to edit doesn't exist.</p>
            <div className="flex gap-4 mt-4">
              <Button variant="outline" onClick={() => router.push("/journal")} className="rounded-lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Journal
              </Button>
              <BackToDashboard />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()} className="rounded-lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Edit Journal Entry</h2>
        </div>
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

            <div className="space-y-4">
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
              <p className="text-xs text-gray-500">Press Enter or comma to add a tag</p>
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
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
