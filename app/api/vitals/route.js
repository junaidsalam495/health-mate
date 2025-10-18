import { NextResponse } from "next/server"
import { verifyToken, extractToken } from "@/lib/auth"
import { getVitalsByUserId, addVital } from "@/lib/db"
import { ObjectId } from "mongodb"

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

    const vitals = await getVitalsByUserId(decoded.userId)

    return NextResponse.json(vitals)
  } catch (error) {
    console.error("Fetch vitals error:", error)
    return NextResponse.json({ message: "Failed to fetch vitals" }, { status: 500 })
  }
}

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

    const body = await request.json()

    const vital = await addVital({
      userId: new ObjectId(decoded.userId),
      ...body,
    })

    return NextResponse.json(vital, { status: 201 })
  } catch (error) {
    console.error("Add vital error:", error)
    return NextResponse.json({ message: "Failed to add vital" }, { status: 500 })
  }
}
