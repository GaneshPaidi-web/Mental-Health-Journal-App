import type { JournalEntry, MoodData } from "@/lib/types"

// Sample entries for demonstration purposes
const sampleEntries: JournalEntry[] = [
  {
    id: "sample-1",
    title: "Getting Started with Journaling",
    date: new Date().toISOString(),
    content:
      "Welcome to MindJournal! This is an example entry to help you get started. Try creating your own entry by clicking the 'New Entry' button.",
    tags: ["welcome", "getting-started"],
    mood: "happy",
  },
  {
    id: "sample-2",
    title: "Journaling Tips",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    content:
      "Regular journaling can help reduce stress and improve mental clarity. Try to write for at least 5 minutes each day, focusing on your thoughts and feelings.",
    tags: ["tips", "mindfulness"],
    mood: "calm",
  },
]

// Sample mood data
const sampleMoodData: MoodData[] = [
  {
    date: new Date().toISOString(),
    mood: "happy",
  },
  {
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    mood: "calm",
  },
  {
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // Day before yesterday
    mood: "neutral",
  },
]

// Get journal entries for the current user
export function getUserEntries(userId: string): JournalEntry[] {
  try {
    if (!userId) {
      console.warn("No user ID provided to getUserEntries")
      return []
    }

    const entriesKey = `journal_entries_${userId}`
    const storedEntries = localStorage.getItem(entriesKey)

    if (storedEntries) {
      return JSON.parse(storedEntries)
    }

    // If no entries exist, return empty array (not sample entries)
    return []
  } catch (error) {
    console.error("Error getting user entries:", error)
    return []
  }
}

// Save journal entries for the current user
export function saveUserEntries(userId: string, entries: JournalEntry[]): void {
  try {
    if (!userId) {
      console.error("No user ID provided to saveUserEntries")
      return
    }

    const entriesKey = `journal_entries_${userId}`
    localStorage.setItem(entriesKey, JSON.stringify(entries))
  } catch (error) {
    console.error("Error saving user entries:", error)
  }
}

// Get mood data for the current user
export function getUserMoodData(userId: string): MoodData[] {
  try {
    if (!userId) {
      console.warn("No user ID provided to getUserMoodData")
      return []
    }

    const moodKey = `mood_data_${userId}`
    const storedMoodData = localStorage.getItem(moodKey)

    if (storedMoodData) {
      return JSON.parse(storedMoodData)
    }

    // If no mood data exists, return empty array
    return []
  } catch (error) {
    console.error("Error getting user mood data:", error)
    return []
  }
}

// Save mood data for the current user
export function saveUserMoodData(userId: string, moodData: MoodData[]): void {
  try {
    if (!userId) {
      console.error("No user ID provided to saveUserMoodData")
      return
    }

    const moodKey = `mood_data_${userId}`
    localStorage.setItem(moodKey, JSON.stringify(moodData))
  } catch (error) {
    console.error("Error saving user mood data:", error)
  }
}

// Initialize a new user with sample data
export function initializeNewUser(userId: string): void {
  try {
    if (!userId) {
      console.error("No user ID provided to initializeNewUser")
      return
    }

    // Check if user already has data
    const existingEntries = getUserEntries(userId)
    const existingMoodData = getUserMoodData(userId)

    // Only initialize if user has no data
    if (existingEntries.length === 0) {
      saveUserEntries(userId, sampleEntries)
    }

    if (existingMoodData.length === 0) {
      saveUserMoodData(userId, sampleMoodData)
    }
  } catch (error) {
    console.error("Error initializing new user:", error)
  }
}

// Get sample entries (for demonstration)
export function getSampleEntries(): JournalEntry[] {
  return sampleEntries
}

// Get sample mood data (for demonstration)
export function getSampleMoodData(): MoodData[] {
  return sampleMoodData
}
