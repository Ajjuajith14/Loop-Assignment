"use client"

import { useState, useEffect } from "react"
import { useDashboard } from "./dashboard-context"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

export function SearchBar() {
  const { state, setSearchTerm } = useDashboard()
  const [searchInput, setSearchInput] = useState("")

  console.log(`SearchBar render: Page ${state.currentPage}`)

  useEffect(() => {
    setSearchInput(state.searchTerm)
  }, [state.searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("SearchBar: Setting search term")
      setSearchTerm(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, setSearchTerm])

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search across all columns..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9 pr-8"
        />
        {searchInput && (
          <button onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
      {state.searchTerm && (
        <div className="mt-1 text-xs text-gray-500">
          Found {state.filteredData.length.toLocaleString()} results for "{state.searchTerm}"
        </div>
      )}
    </div>
  )
}
