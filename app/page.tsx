"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardView } from "@/components/dashboard-view"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (isAuthenticated === null) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen">
      <DashboardView />
    </main>
  )
}
