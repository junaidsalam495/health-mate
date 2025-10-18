import { NextResponse } from "next/server"
import { verifyToken, extractToken } from "@/lib/auth"
import { getReportById } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const token = extractToken(request.headers.get("authorization"))

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const report = await getReportById(params.id)

    if (!report || report.userId.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Report not found" }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Fetch report error:", error)
    return NextResponse.json({ message: "Failed to fetch report" }, { status: 500 })
  }
}
