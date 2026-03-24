"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusIcon, SearchIcon } from "lucide-react"
import type { JournalEntry } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { getUserEntries } from "@/lib/journal-service"

export default function JournalPage() {
  const [user, setUser] = useState<any>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Fetch journal entries for this user from API
      const fetchEntries = async () => {
        try {
          const response = await fetch(`/api/entries?userId=${parsedUser.id || parsedUser._id}`)
          if (response.ok) {
            const userEntries = await response.json()
            setEntries(userEntries)
            setFilteredEntries(userEntries)
          }
        } catch (error) {
          console.error("Error fetching entries:", error)
        }
      }

      fetchEntries()
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(entries)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
      setFilteredEntries(filtered)
    }
  }, [searchQuery, entries])

  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Journal Entries</h2>
        <Link href="/journal/new">
          <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg gap-2">
            <PlusIcon className="h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search entries by title, content, or tags..."
            className="w-full pl-8 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {sortedEntries.length > 0 ? (
          sortedEntries.map((entry) => (
            <Link key={entry._id || entry.id} href={`/journal/${entry._id || entry.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{entry.title}</CardTitle>
                    <CardDescription>{formatDate(entry.date)}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-500 dark:text-gray-400">{entry.content}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm capitalize">{entry.mood}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>No entries found</CardTitle>
              <CardDescription>
                {searchQuery ? "Try a different search term" : "Start journaling to see your entries here"}
              </CardDescription>
            </CardHeader>
            {!searchQuery && (
              <CardContent>
                <Link href="/journal/new">
                  <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Create your first entry
                  </Button>
                </Link>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
