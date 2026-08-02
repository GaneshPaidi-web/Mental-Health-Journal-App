import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email, password } = await req.json()

    // Find user by email
    const user = await User.findOne({ email }).select("+password") 
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Check if password is hashed (bcrypt hashes start with $2)
    const isHashed = user.password.startsWith("$2")
    let isMatch = false

    if (isHashed) {
      isMatch = await bcrypt.compare(password, user.password)
    } else {
      // Legacy plain-text check
      isMatch = user.password === password
      
      // Transparently migrate to hashed password if it matches
      if (isMatch) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()
      }
    }

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const userPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }

    const token = signToken({
      userId: userPayload.id,
      email: userPayload.email,
      name: userPayload.name,
      role: userPayload.role,
    })

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: userPayload,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
