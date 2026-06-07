import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { JournalEntry } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface RecentEntriesProps {
  entries: JournalEntry[]
}

export function RecentEntries({ entries }: RecentEntriesProps) {
  // Sort entries by date (newest first)
  const sortedEntries =
    entries && entries.length > 0
      ? [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
      : []

  return (
    <div className="space-y-4">
      {sortedEntries.length > 0 ? (
        sortedEntries.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id}`}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow rounded-xl">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{entry.title}</CardTitle>
                  <CardDescription>{formatDate(entry.date)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{entry.content}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="bg-muted px-2 py-0.5 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>No entries yet</CardTitle>
            <CardDescription>Start journaling to see your entries here</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
