import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Entry from "@/models/Entry"
import { authenticateRequest, isAuthError } from "@/lib/auth"

async function getAuthorizedEntry(id: string, userId: string, role: string) {
  const entry = await Entry.findById(id)
  if (!entry) return null
  if (role !== "superadmin" && entry.userId.toString() !== userId) return null
  return entry
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(req)
    if (isAuthError(auth)) return auth

    await dbConnect()
    const { id } = await params
    const entry = await getAuthorizedEntry(id, auth.userId, auth.role)

    if (!entry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry, { status: 200 })
  } catch (error: any) {
    console.error("GET entry by id error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(req)
    if (isAuthError(auth)) return auth

    await dbConnect()
    const { id } = await params
    const existingEntry = await getAuthorizedEntry(id, auth.userId, auth.role)

    if (!existingEntry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 })
    }

    const updateData = await req.json()
    const entry = await Entry.findByIdAndUpdate(
      id,
      { ...updateData, userId: auth.userId },
      { new: true, runValidators: true },
    )

    return NextResponse.json(entry, { status: 200 })
  } catch (error: any) {
    console.error("PUT entry error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(req)
    if (isAuthError(auth)) return auth

    await dbConnect()
    const { id } = await params
    const existingEntry = await getAuthorizedEntry(id, auth.userId, auth.role)

    if (!existingEntry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 })
    }

    await Entry.findByIdAndDelete(id)
    return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("DELETE entry error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
