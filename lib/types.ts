export interface JournalEntry {
  id?: string
  _id?: string
  title: string
  date: string
  content: string
  tags: string[]
  mood: string
}

export interface MoodData {
  date: string
  mood: string
}

export interface User {
  id: string
  name: string
  email: string
}
