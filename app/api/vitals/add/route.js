import { NextResponse } from "next/server"
import { verifyToken, extractToken } from "@/lib/auth"
import { addVital } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function POST(request) {
  try {
    const token = extractToken(request.headers.get("authorization"))

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { type, value, notes } = await request.json()

    if (!type || !value) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const vital = await addVital({
      userId: new ObjectId(decoded.userId),
      type,
      value,
      notes,
    })

    return NextResponse.json(vital)
  } catch (error) {
    console.error("Add vital error:", error)
    return NextResponse.json({ message: "Failed to add vital" }, { status: 500 })
  }
}
