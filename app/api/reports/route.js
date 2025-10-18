import { NextResponse } from "next/server"
import { verifyToken, extractToken } from "@/lib/auth"
import { getReportsByUserId } from "@/lib/db"

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

    const reports = await getReportsByUserId(decoded.userId)

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Fetch reports error:", error)
    return NextResponse.json({ message: "Failed to fetch reports" }, { status: 500 })
  }
}
