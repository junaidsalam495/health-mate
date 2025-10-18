import { NextResponse } from "next/server"
import { verifyToken, extractToken } from "@/lib/auth"
import { analyzeReport } from "@/lib/gemini"
import { updateReport } from "@/lib/db"

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

    const { reportId, fileContent, reportType } = await request.json()

    if (!reportId || !fileContent) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const analysis = await analyzeReport(fileContent, reportType)

    // Update report with analysis in MongoDB
    const updatedReport = await updateReport(reportId, {
      analysis,
      analyzedAt: new Date(),
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ message: "Analysis failed" }, { status: 500 })
  }
}
