import { NextResponse } from "next/server"
import { verifyToken, extractToken } from "@/lib/auth"
import { getTimelineByUserId } from "@/lib/db"

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

    const timeline = await getTimelineByUserId(decoded.userId)

    const formattedTimeline = timeline.map((item) => {
      if (item.type === "report") {
        return {
          ...item,
          title: item.fileName,
          description: `Report Type: ${item.reportType}`,
          date: item.createdAt,
        }
      } else {
        return {
          ...item,
          title: `${item.type.toUpperCase()}: ${item.value}`,
          description: item.notes || "",
          date: item.createdAt,
        }
      }
    })

    return NextResponse.json(formattedTimeline)
  } catch (error) {
    console.error("Fetch timeline error:", error)
    return NextResponse.json({ message: "Failed to fetch timeline" }, { status: 500 })
  }
}
