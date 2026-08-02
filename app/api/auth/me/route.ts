import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { authenticateRequest, isAuthError } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const auth = authenticateRequest(req)
    if (isAuthError(auth)) return auth

    await dbConnect()
    const user = await User.findById(auth.userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
