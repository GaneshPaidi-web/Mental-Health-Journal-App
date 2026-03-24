import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Entry from "@/models/Entry"

// GET a single entry
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const entry = await Entry.findById(id)

    if (!entry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry, { status: 200 })
  } catch (error: any) {
    console.error("GET entry by id error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// UPDATE an entry
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const updateData = await req.json()

    const entry = await Entry.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!entry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry, { status: 200 })
  } catch (error: any) {
    console.error("PUT entry error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE an entry
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params

    const entry = await Entry.findByIdAndDelete(id)

    if (!entry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("DELETE entry error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
