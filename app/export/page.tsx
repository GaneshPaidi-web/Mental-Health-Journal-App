"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DownloadIcon, UploadIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { JournalEntry, MoodData } from "@/lib/types"

export default function ExportPage() {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const handleExportAll = () => {
    try {
      // Get all data from localStorage
      const data = {
        journalEntries: JSON.parse(localStorage.getItem("journalEntries") || "[]"),
        moodData: JSON.parse(localStorage.getItem("moodData") || "[]"),
        // Don't include user credentials in the export
      }

      // Convert to JSON string
      const jsonString = JSON.stringify(data, null, 2)

      // Create a blob and download link
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      // Create download link and click it
      const a = document.createElement("a")
      a.href = url
      a.download = `mindjournal-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: "Your data has been exported successfully.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportEntries = () => {
    try {
      // Get journal entries
      const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]")

      // Convert to JSON string
      const jsonString = JSON.stringify(entries, null, 2)

      // Create a blob and download link
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      // Create download link and click it
      const a = document.createElement("a")
      a.href = url
      a.download = `mindjournal-entries-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: "Your journal entries have been exported successfully.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your entries. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    if (!importData.trim()) {
      toast({
        title: "Import failed",
        description: "Please paste your exported data.",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)

    try {
      // Parse the imported data
      const data = JSON.parse(importData)

      // Validate the data structure
      if (!data.journalEntries || !Array.isArray(data.journalEntries)) {
        throw new Error("Invalid data format: missing journal entries")
      }

      // Merge with existing data
      const existingEntries: JournalEntry[] = JSON.parse(localStorage.getItem("journalEntries") || "[]")
      const existingMoodData: MoodData[] = JSON.parse(localStorage.getItem("moodData") || "[]")

      // Create maps for existing data to avoid duplicates
      const entryMap = new Map(existingEntries.map((entry) => [entry.id, entry]))
      const moodMap = new Map(existingMoodData.map((mood) => [mood.date, mood]))

      // Add new entries
      data.journalEntries.forEach((entry: JournalEntry) => {
        if (!entryMap.has(entry.id)) {
          entryMap.set(entry.id, entry)
        }
      })

      // Add new mood data if available
      if (data.moodData && Array.isArray(data.moodData)) {
        data.moodData.forEach((mood: MoodData) => {
          if (!moodMap.has(mood.date)) {
            moodMap.set(mood.date, mood)
          }
        })
      }

      // Save merged data back to localStorage
      localStorage.setItem("journalEntries", JSON.stringify(Array.from(entryMap.values())))
      localStorage.setItem("moodData", JSON.stringify(Array.from(moodMap.values())))

      toast({
        title: "Import successful",
        description: "Your data has been imported successfully.",
      })

      setImportData("")
      setIsImporting(false)
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Import failed",
        description: "There was an error importing your data. Please check the format and try again.",
        variant: "destructive",
      })
      setIsImporting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Export & Import</h2>
      </div>

      <Tabs defaultValue="export" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:w-[400px] rounded-lg">
          <TabsTrigger value="export" className="rounded-lg">
            Export Data
          </TabsTrigger>
          <TabsTrigger value="import" className="rounded-lg">
            Import Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Export Your Data</CardTitle>
              <CardDescription>Download your journal entries and mood data for backup or transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Exporting your data allows you to create a backup that you can store safely or import into another
                device. Your data will be downloaded as a JSON file.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Export Everything</CardTitle>
                    <CardDescription>Journal entries, mood data, and settings</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={handleExportAll} className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg gap-2">
                      <DownloadIcon className="h-4 w-4" />
                      Export All Data
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Export Journal Entries</CardTitle>
                    <CardDescription>Only journal entries</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      onClick={handleExportEntries}
                      className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg gap-2"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Export Entries
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Import Your Data</CardTitle>
              <CardDescription>Restore your journal entries and mood data from a backup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Importing data will merge your backup with your existing data. Duplicate entries will be skipped, so you
                won't lose any current data.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="import-data">Paste your exported data below</Label>
                  <Textarea
                    id="import-data"
                    placeholder='{"journalEntries": [...], "moodData": [...]}'
                    className="min-h-[200px] rounded-lg font-mono text-sm"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleImport}
                  className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg gap-2"
                  disabled={isImporting}
                >
                  <UploadIcon className="h-4 w-4" />
                  {isImporting ? "Importing..." : "Import Data"}
                </Button>

                <div className="text-sm text-gray-500">
                  <p>
                    <strong>Note:</strong> You can also import data by opening your exported JSON file in a text editor,
                    copying all the content, and pasting it into the field above.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full rounded-lg">
                Import from File (Coming Soon)
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-xl">
              <DialogHeader>
                <DialogTitle>Import from File</DialogTitle>
                <DialogDescription>
                  This feature is coming soon. For now, please use the paste method above.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="file" className="sr-only">
                    File
                  </Label>
                  <Input id="file" type="file" disabled className="rounded-lg" />
                </div>
                <Button type="submit" size="sm" className="px-3 rounded-lg" disabled>
                  <span className="sr-only">Upload</span>
                  <UploadIcon className="h-4 w-4" />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogTrigger asChild>
                  <Button variant="secondary" className="rounded-lg">
                    Close
                  </Button>
                </DialogTrigger>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
