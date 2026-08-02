import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Entry from "@/models/Entry"
import { authenticateRequest, isAuthError } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const auth = authenticateRequest(req)
    if (isAuthError(auth)) return auth

    await dbConnect()
    const entries = await Entry.find({ userId: auth.userId }).sort({ date: -1 })
    return NextResponse.json(entries, { status: 200 })
  } catch (error: any) {
    console.error("GET entries error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = authenticateRequest(req)
    if (isAuthError(auth)) return auth

    await dbConnect()
    const entryData = await req.json()

    const entry = await Entry.create({
      ...entryData,
      userId: auth.userId,
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (error: any) {
    console.error("POST entries error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
