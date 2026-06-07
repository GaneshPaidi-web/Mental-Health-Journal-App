"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon } from "lucide-react"
import type { JournalEntry } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function SearchPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [allMoods, setAllMoods] = useState<string[]>([])

  useEffect(() => {
    // Get journal entries
    const storedEntries = localStorage.getItem("journalEntries")
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries)
      setEntries(parsedEntries)

      // Extract all unique tags
      const tags = new Set<string>()
      const moods = new Set<string>()

      parsedEntries.forEach((entry: JournalEntry) => {
        entry.tags.forEach((tag) => tags.add(tag))
        moods.add(entry.mood)
      })

      setAllTags(Array.from(tags))
      setAllMoods(Array.from(moods))
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries([])
      return
    }

    const query = searchQuery.toLowerCase()
    let filtered: JournalEntry[] = []

    switch (searchType) {
      case "title":
        filtered = entries.filter((entry) => entry.title.toLowerCase().includes(query))
        break
      case "content":
        filtered = entries.filter((entry) => entry.content.toLowerCase().includes(query))
        break
      case "tag":
        filtered = entries.filter((entry) => entry.tags.some((tag) => tag.toLowerCase().includes(query)))
        break
      case "mood":
        filtered = entries.filter((entry) => entry.mood.toLowerCase().includes(query))
        break
      default:
        filtered = entries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(query) ||
            entry.content.toLowerCase().includes(query) ||
            entry.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            entry.mood.toLowerCase().includes(query),
        )
    }

    setFilteredEntries(filtered)
  }, [searchQuery, searchType, entries])

  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Search Entries</h2>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Search your journal</CardTitle>
          <CardDescription>Find entries by title, content, tags, or mood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-full md:w-[180px] rounded-lg">
                <SelectValue placeholder="Search in..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="tag">Tags</SelectItem>
                <SelectItem value="mood">Mood</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {searchType === "tag" && allTags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm mb-2">Common tags:</p>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {searchType === "mood" && allMoods.length > 0 && (
            <div className="mt-4">
              <p className="text-sm mb-2">Moods:</p>
              <div className="flex flex-wrap gap-2">
                {allMoods.map((mood) => (
                  <Button
                    key={mood}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs capitalize"
                    onClick={() => setSearchQuery(mood)}
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {searchQuery.trim() !== "" && (
          <div className="text-sm text-gray-500">
            {sortedEntries.length === 0
              ? "No entries found"
              : `Found ${sortedEntries.length} ${sortedEntries.length === 1 ? "entry" : "entries"}`}
          </div>
        )}

        {sortedEntries.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id}`}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow rounded-xl">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{entry.title}</CardTitle>
                  <CardDescription>{formatDate(entry.date)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-gray-500 dark:text-gray-400">{entry.content}</p>
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
        ))}
      </div>
    </div>
  )
}
