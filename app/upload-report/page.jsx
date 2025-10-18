"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function UploadReportPage() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [reportType, setReportType] = useState("blood-test")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    setLoading(true)
    setError("")

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

      if (!token) {
        router.push("/login")
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("reportType", reportType)

      const res = await fetch("/api/reports/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Upload failed")
        return
      }

      setSuccess("Report uploaded successfully!")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err) {
      setError("An error occurred during upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-background rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Upload Medical Report</h1>
          <p className="text-muted-foreground mb-8">Upload your medical reports (PDF, JPG, PNG) for AI analysis</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="blood-test">Blood Test</option>
                <option value="xray">X-Ray</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="prescription">Prescription</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select File</label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <div className="text-4xl mb-2">📁</div>
                <p className="font-medium">{file ? file.name : "Click to upload or drag and drop"}</p>
                <p className="text-sm text-muted-foreground">PDF, JPG, or PNG</p>
              </div>
            </div>

            {error && <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg">{error}</div>}

            {success && <div className="bg-accent/10 text-accent px-4 py-2 rounded-lg">{success}</div>}

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-primary hover:bg-primary-dark text-black font-medium py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload & Analyze"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
