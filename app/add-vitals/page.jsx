"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AddVitalsPage() {
  const router = useRouter()
  const [vitalType, setVitalType] = useState("bp")
  const [value, setValue] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!value) {
      setError("Please enter a value")
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

      const res = await fetch("/api/vitals/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: vitalType, value, notes }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Failed to add vital")
        return
      }

      setSuccess("Vital recorded successfully!")
      setValue("")
      setNotes("")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getPlaceholder = () => {
    switch (vitalType) {
      case "bp":
        return "e.g., 120/80"
      case "sugar":
        return "e.g., 95 mg/dL"
      case "weight":
        return "e.g., 70 kg"
      case "heart-rate":
        return "e.g., 72 bpm"
      default:
        return "Enter value"
    }
  }

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-background rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Add Vitals</h1>
          <p className="text-muted-foreground mb-8">Manually track your health vitals (BP, Sugar, Weight, etc.)</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Vital Type</label>
              <select
                value={vitalType}
                onChange={(e) => setVitalType(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="bp">Blood Pressure (BP)</option>
                <option value="sugar">Blood Sugar</option>
                <option value="weight">Weight</option>
                <option value="heart-rate">Heart Rate</option>
                <option value="temperature">Temperature</option>
                <option value="oxygen">Oxygen Level (SpO2)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Value</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes..."
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>

            {error && <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg">{error}</div>}

            {success && <div className="bg-accent/10 text-accent px-4 py-2 rounded-lg">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-green-600 text-black font-medium py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Recording..." : "Record Vital"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
