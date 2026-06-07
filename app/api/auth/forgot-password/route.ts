import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import crypto from "crypto"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email } = await req.json()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      // For security, don't reveal that the user doesn't exist
      return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    
    // Hash and set reset token and expiration (1 hour)
    const salt = await bcrypt.genSalt(10)
    user.resetPasswordToken = await bcrypt.hash(resetToken, salt)
    user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour

    await user.save()

    // Mock sending email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${email}`
    
    console.log("--- MOCK EMAIL ---")
    console.log(`To: ${email}`)
    console.log(`Subject: Password Reset Request`)
    console.log(`Message: Please click the following link to reset your password: ${resetUrl}`)
    console.log("------------------")

    return NextResponse.json(
      { message: "If an account with that email exists, a password reset link has been sent." },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
