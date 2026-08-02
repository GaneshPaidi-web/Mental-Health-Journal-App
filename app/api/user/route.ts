import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Entry from "@/models/Entry"
import { authenticateRequest, isAuthError } from "@/lib/auth"

export async function DELETE(req: Request) {
  try {
    const authResult = authenticateRequest(req)
    if (isAuthError(authResult)) {
      return authResult
    }

    await dbConnect()

    const userId = authResult.userId

    // Delete all journal entries associated with the user
    await Entry.deleteMany({ userId })

    // Delete the user account itself
    await User.findByIdAndDelete(userId)

    return NextResponse.json(
      { message: "Account and all associated data deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Account deletion error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const authResult = authenticateRequest(req)
    if (isAuthError(authResult)) {
      return authResult
    }

    await dbConnect()

    const userId = authResult.userId
    const { name, dob, gender } = await req.json()

    // Find and update user. Note that we don't allow changing email here.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, dob, gender },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const userPayload = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      dob: updatedUser.dob || "",
      gender: updatedUser.gender || "",
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: userPayload,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
