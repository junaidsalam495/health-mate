import { NextResponse } from "next/server"
import { verifyToken, extractToken } from "@/lib/auth"
import { findUserById } from "@/lib/db"

export async function GET(request) {
  try {
    const token = extractToken(request.headers.get("authorization"))

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const user = await findUserById(decoded.userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    console.error("Fetch user error:", error)
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 })
  }
}
