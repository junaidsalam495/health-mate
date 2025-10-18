"use client"

import { useRouter } from "next/navigation"

export default function DashboardHeader({ user }) {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0"
    router.push("/login")
  }

  return (
    <header className="bg-primary text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">HealthMate</h1>
          <p className="text-sm opacity-90">Sehat ka Smart Dost</p>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm">Welcome, {user.name}</span>}
          <button
            onClick={handleLogout}
            className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-opacity-90 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
