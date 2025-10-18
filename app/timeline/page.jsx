"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function TimelinePage() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) {
      router.push("/login")
      return
    }

    fetchTimeline(token)
  }, [router])

  const fetchTimeline = async (token) => {
    try {
      const res = await fetch("/api/timeline", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setItems(await res.json())
      }
    } catch (err) {
      console.error("Error fetching timeline:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading timeline...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-background rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Health Timeline</h1>

          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No health records yet. Start by uploading a report or adding vitals.
            </p>
          ) : (
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={item._id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${item.type === "report" ? "bg-primary" : "bg-accent"}`} />
                    {index < items.length - 1 && <div className="w-1 h-12 bg-border mt-2" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    {item.description && <p className="text-muted-foreground">{item.description}</p>}
                    {item.value && <p className="text-sm font-medium text-primary mt-1">Value: {item.value}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
