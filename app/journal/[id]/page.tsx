"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Edit2Icon, Trash2Icon } from "lucide-react"
import type { JournalEntry } from "@/lib/types"
import { formatDate, formatTime } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getUserEntries, saveUserEntries } from "@/lib/journal-service"
import { BackToDashboard } from "@/components/back-to-dashboard"

export default function JournalEntryPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const [user, setUser] = useState<any>(null)
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Fetch journal entry from API
        const fetchEntry = async () => {
          try {
            const response = await fetch(`/api/entries/${params.id}`)
            if (response.ok) {
              const foundEntry = await response.json()
              setEntry(foundEntry)
            } else {
              toast({
                title: "Entry not found",
                description: "The journal entry you're looking for doesn't exist.",
                variant: "destructive",
              })
              setTimeout(() => {
                router.push("/journal")
              }, 2000)
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

        fetchEntry()
      } catch (error) {
        console.error("Error parsing user data:", error)
        toast({
          title: "Error",
          description: "There was a problem loading your data. Please try again.",
          variant: "destructive",
        })
        router.push("/journal")
        setIsLoading(false)
      }
    } else {
      // Redirect to login if not logged in
      router.push("/login")
      setIsLoading(false)
    }
  }, [params.id, router, toast])

  const handleDelete = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/entries/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete entry")
      }

      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted successfully.",
      })

      // Redirect to journal page
      router.push("/journal")
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast({
        title: "Error deleting entry",
        description: "There was a problem deleting your entry. Please try again.",
        variant: "destructive",
      })
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
          <CardHeader>
            <CardTitle>Entry not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The journal entry you're looking for doesn't exist.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/journal")} className="rounded-lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </Button>
            <BackToDashboard />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <BackToDashboard className="hidden sm:flex" />
          <Link href={`/journal/edit/${entry.id}`}>
            <Button variant="outline" className="rounded-lg">
              <Edit2Icon className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-500 rounded-lg">
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your journal entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 rounded-lg">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-2xl">{entry.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <span>{formatDate(entry.date)}</span>
              <span className="mx-2">•</span>
              <span>{formatTime(entry.date)}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{entry.mood}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {entry.content.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {entry.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
