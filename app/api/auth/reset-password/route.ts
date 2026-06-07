import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email, token, newPassword } = await req.json()

    // Find user by email
    const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires")
    if (!user) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 })
    }

    // Verify token exists and has not expired
    if (!user.resetPasswordToken || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 })
    }

    // Compare the provided token with the hashed token in DB
    const isTokenMatch = await bcrypt.compare(token, user.resetPasswordToken)
    if (!isTokenMatch) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 })
    }

    // Token is valid! Hash the new password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    
    // Clear reset token fields
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    return NextResponse.json({ message: "Password reset successful. You can now login with your new password." }, { status: 200 })
  } catch (error: any) {
    console.error("Reset password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
