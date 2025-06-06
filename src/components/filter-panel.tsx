"use client"

import { MultiSelectFilter } from "./multi-select-filter"
import { useDashboard } from "./dashboard-context"

export function FilterPanel() {
  const { state, updateFilter, getFilterOptions } = useDashboard()

  console.log(`FilterPanel render: Page ${state.currentPage}`)

  return (
    <div
      className={`grid gap-4 ${
        state.columns.length <= 2
          ? "grid-cols-1 md:grid-cols-2"
          : state.columns.length === 3
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {state.columns.map((column) => (
        <div key={column} className="space-y-2">
          <label className="text-sm font-medium text-gray-700 capitalize">
            {column.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} Filter
          </label>
          <MultiSelectFilter
            options={getFilterOptions(column)}
            selectedValues={state.filters[column] || []}
            onChange={(values) => updateFilter(column, values)}
            placeholder={`Select ${column} values`}
            searchPlaceholder={`Search ${column}...`}
          />
          <div className="text-xs text-gray-500">
            {getFilterOptions(column).length.toLocaleString()} options available
          </div>
        </div>
      ))}
    </div>
  )
}
