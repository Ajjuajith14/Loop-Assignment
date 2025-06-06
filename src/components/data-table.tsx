"use client"

import React, { useMemo, useEffect } from "react"
import { useDashboard } from "./dashboard-context"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function DataTable() {
  const { state, dispatch, getCurrentPageData } = useDashboard()
  const { filteredData, currentPage, itemsPerPage, visibleRows, columns, searchTerm } = state

  console.log(`DataTable render: Page ${currentPage}`)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const currentPageData = getCurrentPageData()

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length)

  const visibleData = currentPageData.slice(0, visibleRows)
  const hasMoreInPage = currentPageData.length > visibleRows

  useEffect(() => {
    console.log(`DataTable useEffect: Page changed to ${currentPage}`)
    console.log(`Showing rows ${startIndex + 1}-${Math.min(endIndex, filteredData.length)}`)
    if (currentPageData.length > 0) {
      console.log(
        `First row: ${currentPageData[0]?.number}, Last row: ${currentPageData[currentPageData.length - 1]?.number}`,
      )
    }
  }, [currentPage, currentPageData, startIndex, endIndex, filteredData.length])

  const tableColumns = useMemo(() => {
    const cols = [{ key: "number", label: "Number", width: "w-32" }]

    columns.forEach((column) => {
      cols.push({
        key: column,
        label: column.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        width: "w-24",
      })
    })

    return cols
  }, [columns])

  const goToPage = (page: number) => {
    console.log(`goToPage called: ${page}`)
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      console.log(`Dispatching SET_PAGE: ${page}`)
      dispatch({ type: "SET_PAGE", payload: page })
    } else {
      console.log(`Page navigation blocked: page=${page}, currentPage=${currentPage}, totalPages=${totalPages}`)
    }
  }

  const pageNumbers = useMemo(() => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    if (totalPages <= 1) return [1]

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    rangeWithDots.push(1)

    if (currentPage - delta > 2) {
      rangeWithDots.push("...")
    }

    range.forEach((page) => {
      if (page !== 1 && page !== totalPages) {
        rangeWithDots.push(page)
      }
    })

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...")
    }

    if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }, [currentPage, totalPages])

  const highlightSearchTerm = (content: string) => {
    if (!searchTerm) return content

    const parts = content.split(new RegExp(`(${searchTerm})`, "gi"))

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 font-medium">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    )
  }

  return (
    <div className="space-y-4">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Data Table</h3>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + visibleRows, endIndex)} of{" "}
            {filteredData.length.toLocaleString()} results (Page {currentPage} of {totalPages})
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  #
                </th>
                {tableColumns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                      column.width,
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visibleData.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length + 1} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? (
                      <div>
                        <p className="text-lg font-medium">No results found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium">No data available</p>
                        <p className="text-sm">Try changing your filters</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                visibleData.map((row, index) => (
                  <tr key={`page-${currentPage}-row-${startIndex + index}-${row.number}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{startIndex + index + 1}</td>
                    {tableColumns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {searchTerm
                          ? highlightSearchTerm(row[column.key]?.toLocaleString() || "")
                          : row[column.key]?.toLocaleString() || row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasMoreInPage && (
          <div className="px-6 py-3 bg-gray-50 border-t text-center">
            <p className="text-sm text-gray-600">
              Showing {visibleRows} of {currentPageData.length.toLocaleString()} rows on this page
              <br />
              <span className="text-xs text-gray-500">
                (Virtual scrolling - showing first {visibleRows} rows for performance)
              </span>
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages.toLocaleString()} ({filteredData.length.toLocaleString()} total results)
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-1">
                {pageNumbers.map((page, index) => (
                  <React.Fragment key={`page-${page}-${index}`}>
                    {page === "..." ? (
                      <span className="px-3 py-1 text-gray-500">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page as number)}
                        className={cn(
                          "min-w-[2.5rem]",
                          currentPage === page && "bg-blue-600 text-white hover:bg-blue-700",
                        )}
                        title={`Go to page ${page}`}
                      >
                        {page}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
