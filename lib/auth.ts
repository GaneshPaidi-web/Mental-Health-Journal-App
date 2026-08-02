import { NextResponse } from "next/server"
import { verifyToken, type JwtPayload } from "@/lib/jwt"

export function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }
  return authHeader.slice(7)
}

export function authenticateRequest(req: Request): JwtPayload | NextResponse {
  const token = getTokenFromRequest(req)
  if (!token) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
  }

  return payload
}

export function isAuthError(result: JwtPayload | NextResponse): result is NextResponse {
  return result instanceof NextResponse
}
