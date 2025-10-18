import { NextResponse } from "next/server"
import { verifyToken, extractToken } from "@/lib/auth"
import { addReport } from "@/lib/db"
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

    const formData = await request.formData()
    const file = formData.get("file")
    const reportType = formData.get("reportType")

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    // In production, upload to Cloudinary/Firebase
    const report = await addReport({
      userId: new ObjectId(decoded.userId),
      fileName: file.name,
      reportType,
      fileSize: file.size,
      summary: "AI analysis pending...",
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ message: "Upload failed" }, { status: 500 })
  }
}
