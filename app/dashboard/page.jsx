"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import ReportList from "@/components/report-list"
import VitalsList from "@/components/vitals-list"

export default function DashboardPage() {
  const router = useRouter()
  const [reports, setReports] = useState([])
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) {
      router.push("/login")
      return
    }

    fetchDashboardData(token)
  }, [router])

  const fetchDashboardData = async (token) => {
    try {
      const [reportsRes, vitalsRes, userRes] = await Promise.all([
        fetch("/api/reports", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/vitals", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (reportsRes.ok) setReports(await reportsRes.json())
      if (vitalsRes.ok) setVitals(await vitalsRes.json())
      if (userRes.ok) setUser(await userRes.json())
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your health data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/upload-report"
            className="bg-primary hover:bg-primary-dark text-black p-6 rounded-lg shadow-md transition transform hover:scale-105"
          >
            <div className="text-3xl mb-2">📄</div>
            <h3 className="font-bold text-lg">Upload Report</h3>
            <p className="text-sm opacity-90">Add medical reports</p>
          </Link>

          <Link
            href="/add-vitals"
            className="bg-accent hover:bg-green-600 text-black p-6 rounded-lg shadow-md transition transform hover:scale-105"
          >
            <div className="text-3xl mb-2">💓</div>
            <h3 className="font-bold text-lg">Add Vitals</h3>
            <p className="text-sm opacity-90">Track BP, Sugar, Weight</p>
          </Link>

          <Link
            href="/timeline"
            className="bg-secondary hover:bg-cyan-600 text-black p-6 rounded-lg shadow-md transition transform hover:scale-105"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-lg">Timeline</h3>
            <p className="text-sm opacity-90">View health history</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
            <ReportList reports={reports} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Vitals</h2>
            <VitalsList vitals={vitals} />
          </div>
        </div>
      </main>
    </div>
  )
}
