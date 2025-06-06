"use client"

import { DashboardProvider } from "@/components/dashboard-context"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Dynamic filter optimization with modulo data</p>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard />
        </main>
      </div>
    </DashboardProvider>
  )
}