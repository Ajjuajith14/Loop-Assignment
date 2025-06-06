"use client"

import { FilterPanel } from "./filter-panel"
import { DataTable } from "./data-table"
import { SearchBar } from "./search-bar"
import { useDashboard } from "./dashboard-context"
import { PerformanceMonitor } from "./performance-monitor"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Filter, Database } from "lucide-react"

export function Dashboard() {
  const { state, clearAllFilters, switchDataset } = useDashboard()

  console.log(`Dashboard render: Page ${state.currentPage}`)

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading {state.currentDataset.toLowerCase()}...</span>
        </div>
      </div>
    )
  }

  const hasActiveFilters = Object.values(state.filters).some((values) => values.length > 0)

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Dataset</h2>
            </div>
            <Select value={state.currentDataset} onValueChange={switchDataset}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select dataset" />
              </SelectTrigger>
              <SelectContent>
                {state.datasets.map((dataset) => (
                  <SelectItem key={dataset.name} value={dataset.name}>
                    {dataset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{state.data.length.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Filtered Records</p>
              <p className="text-2xl font-bold text-blue-600">{state.filteredData.length.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Active Filters</p>
              <p className="text-2xl font-bold text-green-600">
                {Object.values(state.filters).filter((values) => values.length > 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Filter Efficiency</p>
              <p className="text-2xl font-bold text-purple-600">
                {state.data.length > 0 ? ((state.filteredData.length / state.data.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Dynamic Filters</h2>
            <span className="text-sm text-gray-500">({state.columns.length} filter columns)</span>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-red-600 hover:text-red-700">
              Clear All Filters
            </Button>
          )}
        </div>
        <FilterPanel />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable />
      </div>

      <PerformanceMonitor />
    </div>
  )
}
