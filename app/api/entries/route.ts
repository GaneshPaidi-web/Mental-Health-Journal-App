import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Entry from "@/models/Entry"

// GET all entries for a user
export async function GET(req: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 })
    }

    const entries = await Entry.find({ userId }).sort({ date: -1 })
    return NextResponse.json(entries, { status: 200 })
  } catch (error: any) {
    console.error("GET entries error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// CREATE a new entry
export async function POST(req: Request) {
  try {
    await dbConnect()
    const entryData = await req.json()

    if (!entryData.userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 })
    }

    const entry = await Entry.create(entryData)
    return NextResponse.json(entry, { status: 201 })
  } catch (error: any) {
    console.error("POST entries error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
