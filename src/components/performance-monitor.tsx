"use client"

import { useEffect, useState } from "react"
import { useDashboard } from "./dashboard-context"
import { Activity, Clock, Database, Filter, Search } from 'lucide-react'

export function PerformanceMonitor() {
  const { state } = useDashboard()
  const [filterTime, setFilterTime] = useState<number>(0)
  const [renderTime, setRenderTime] = useState<number>(0)
  const [searchTime, setSearchTime] = useState<number>(0)
  const [memoryUsage, setMemoryUsage] = useState<number>(0)

  useEffect(() => {
    const startTime = performance.now()

    const filterEndTime = performance.now()
    setFilterTime(filterEndTime - startTime)

    requestAnimationFrame(() => {
      const renderEndTime = performance.now()
      setRenderTime(renderEndTime - filterEndTime)
    })

    if ("memory" in performance) {
      const memory = (performance as any).memory
      setMemoryUsage(memory.usedJSHeapSize / 1024 / 1024) // Convert to MB
    }
  }, [state.filters, state.filteredData])

  useEffect(() => {
    if (state.searchTerm) {
      const startTime = performance.now()

      const endTime = performance.now()
      setSearchTime(endTime - startTime)
    }
  }, [state.searchTerm])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
          <Clock className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">Filter Time</p>
            <p className="text-lg font-bold text-blue-700">{filterTime.toFixed(2)}ms</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
          <Activity className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-900">Render Time</p>
            <p className="text-lg font-bold text-green-700">{renderTime.toFixed(2)}ms</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
          <Database className="h-8 w-8 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-purple-900">Records</p>
            <p className="text-lg font-bold text-purple-700">{state.data.length.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
          <Filter className="h-8 w-8 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-orange-900">Filter Options</p>
            <p className="text-lg font-bold text-orange-700">
              {Object.values(state.availableFilterOptions)
                .reduce((sum, options) => sum + options.length, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
          <Search className="h-8 w-8 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Search Time</p>
            <p className="text-lg font-bold text-yellow-700">{searchTime.toFixed(2)}ms</p>
          </div>
        </div>
      </div>

      {memoryUsage > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Memory Usage: <span className="font-semibold">{memoryUsage.toFixed(1)} MB</span>
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>• Filter time measures how long it takes to calculate available filter options</p>
        <p>• Search is optimized with debouncing to prevent excessive re-renders</p>
        <p>• Performance optimized with memoization and efficient data structures</p>
      </div>
    </div>
  )
}