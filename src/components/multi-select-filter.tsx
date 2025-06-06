"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiSelectFilterProps {
  options: number[]
  selectedValues: number[]
  onChange: (values: number[]) => void
  placeholder?: string
  searchPlaceholder?: string
}

export function MultiSelectFilter({
  options,
  selectedValues,
  onChange,
  placeholder = "Select values",
  searchPlaceholder = "Search...",
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options
    return options.filter((option) => option.toString().includes(searchTerm))
  }, [options, searchTerm])

  const maxVisibleOptions = 100
  const visibleOptions = filteredOptions.slice(0, maxVisibleOptions)
  const hasMoreOptions = filteredOptions.length > maxVisibleOptions

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleToggleOption = (value: number) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value].sort((a, b) => a - b)

    onChange(newValues)

    setIsOpen(false)
  }

  const handleSelectAll = () => {
    if (selectedValues.length === filteredOptions.length) {
      onChange([])
    } else {
      onChange([...filteredOptions])
    }
    setIsOpen(false)
  }

  const handleClearSelection = () => {
    onChange([])

    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-between text-left font-normal",
          selectedValues.length === 0 && "text-muted-foreground",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedValues.length === 0
            ? placeholder
            : selectedValues.length === 1
              ? selectedValues[0].toLocaleString()
              : `${selectedValues.length} selected`}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4"
              />
            </div>
          </div>

          <div className="p-2 border-b bg-gray-50 flex justify-between">
            <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs">
              {selectedValues.length === filteredOptions.length ? "Deselect All" : "Select All"}
            </Button>
            {selectedValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto">
            {visibleOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No options found</div>
            ) : (
              <>
                {visibleOptions.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleToggleOption(option)}
                  >
                    <Checkbox checked={selectedValues.includes(option)} onChange={() => handleToggleOption(option)} />
                    <span className="text-sm">{option.toLocaleString()}</span>
                  </div>
                ))}
                {hasMoreOptions && (
                  <div className="p-2 text-center text-xs text-gray-500 bg-gray-50">
                    Showing first {maxVisibleOptions} of {filteredOptions.length.toLocaleString()} options
                    <br />
                    Use search to narrow down results
                  </div>
                )}
              </>
            )}
          </div>

          {selectedValues.length > 0 && (
            <div className="p-2 border-t bg-gray-50 text-xs text-gray-600">
              {selectedValues.length.toLocaleString()} of {options.length.toLocaleString()} selected
            </div>
          )}
        </div>
      )}
    </div>
  )
}
