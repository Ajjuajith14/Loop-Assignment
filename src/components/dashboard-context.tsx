"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react"

export interface DataRow {
  number: number
  [key: string]: number 
}

export interface FilterState {
  [key: string]: number[]
}

export interface Dataset {
  name: string
  url: string
  columns: string[]
}

export interface DashboardState {
  data: DataRow[]
  filteredData: DataRow[]
  filters: FilterState
  availableFilterOptions: { [key: string]: number[] }
  loading: boolean
  currentPage: number
  itemsPerPage: number
  visibleRows: number
  currentDataset: string
  datasets: Dataset[]
  columns: string[]
  searchTerm: string
}

type DashboardAction =
  | { type: "SET_DATA"; payload: { data: DataRow[]; columns: string[] } }
  | { type: "SET_FILTER"; payload: { column: string; values: number[] } }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DATASET"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string }

const datasets: Dataset[] = [
  {
    name: "Small Dataset",
    url: "/dataset_small.csv",
    columns: ["mod3", "mod4", "mod5", "mod6"],
  },
  {
    name: "Large Dataset",
    url: "./dataset_large.csv",
    columns: ["mod350", "mod8000", "mod20002"],
  },
]

const initialState: DashboardState = {
  data: [],
  filteredData: [],
  filters: {},
  availableFilterOptions: {},
  loading: true,
  currentPage: 1,
  itemsPerPage: 100,
  visibleRows: 20,
  currentDataset: "Small Dataset",
  datasets,
  columns: [],
  searchTerm: "",
}

const DashboardContext = createContext<{
  state: DashboardState
  dispatch: React.Dispatch<DashboardAction>
  updateFilter: (column: string, values: number[]) => void
  clearAllFilters: () => void
  getFilterOptions: (column: string) => number[]
  switchDataset: (datasetName: string) => void
  setSearchTerm: (term: string) => void
  getCurrentPageData: () => DataRow[]
} | null>(null)

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  console.log("Reducer action:", action.type, action.type === "SET_PAGE" ? action.payload : "")

  switch (action.type) {
    case "SET_DATA":
      console.log("Setting data, resetting page to 1")
      return {
        ...state,
        data: action.payload.data,
        columns: action.payload.columns,
        loading: false,
        filters: {},
        currentPage: 1,
        searchTerm: "",
      }
    case "SET_FILTER":
      console.log("Setting filter, resetting page to 1")
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.column]: action.payload.values,
        },
        currentPage: 1,
      }
    case "CLEAR_FILTERS":
      console.log("Clearing filters, resetting page to 1")
      return {
        ...state,
        filters: {},
        currentPage: 1,
      }
    case "SET_PAGE":
      console.log(`Setting page from ${state.currentPage} to ${action.payload}`)
      return {
        ...state,
        currentPage: action.payload,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_DATASET":
      console.log("Setting dataset, resetting page to 1")
      return {
        ...state,
        currentDataset: action.payload,
        loading: true,
        filters: {},
        currentPage: 1,
        searchTerm: "",
      }
    case "SET_SEARCH_TERM":
      console.log("Setting search term, resetting page to 1")
      return {
        ...state,
        searchTerm: action.payload,
        currentPage: 1,
      }
    default:
      return state
  }
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })

        const currentDatasetConfig = state.datasets.find((d) => d.name === state.currentDataset)
        if (!currentDatasetConfig) return

        const response = await fetch(currentDatasetConfig.url)
        const csvText = await response.text()

        const lines = csvText.trim().split("\n")
        const headers = lines[0].split(",")

        const filterColumns = headers.filter((h) => h !== "number")

        const data: DataRow[] = lines.slice(1).map((line) => {
          const values = line.split(",")
          const row: DataRow = { number: Number.parseInt(values[0]) }

          headers.forEach((header, index) => {
            if (header !== "number") {
              row[header] = Number.parseInt(values[index])
            }
          })

          return row
        })

        console.log("Data loaded, dispatching SET_DATA")
        dispatch({ type: "SET_DATA", payload: { data, columns: filterColumns } })
      } catch (error) {
        console.error("Error loading data:", error)
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadData()
  }, [state.currentDataset])

  const filteredDataAndOptions = useMemo(() => {
    console.log("Recalculating filtered data...")

    if (state.data.length === 0 || state.columns.length === 0) {
      return { filteredData: [], availableFilterOptions: {} }
    }

    let filtered = state.data
    if (state.searchTerm) {
      const searchTermLower = state.searchTerm.toLowerCase()
      filtered = filtered.filter((row) => {
        if (row.number.toString().includes(searchTermLower)) {
          return true
        }

        for (const column of state.columns) {
          if (row[column].toString().includes(searchTermLower)) {
            return true
          }
        }

        return false
      })
    }

    Object.entries(state.filters).forEach(([column, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter((row) => values.includes(row[column]))
      }
    })

    const availableOptions: { [key: string]: number[] } = {}

    state.columns.forEach((column) => {
      let dataForThisFilter = state.searchTerm ? filtered : state.data

      if (!state.searchTerm) {
        Object.entries(state.filters).forEach(([filterColumn, values]) => {
          if (filterColumn !== column && values.length > 0) {
            dataForThisFilter = dataForThisFilter.filter((row) => values.includes(row[filterColumn]))
          }
        })
      }

      const uniqueValues = Array.from(new Set(dataForThisFilter.map((row) => row[column]))).sort((a, b) => a - b)
      availableOptions[column] = uniqueValues
    })

    console.log(`Filtered data length: ${filtered.length}`)
    return { filteredData: filtered, availableFilterOptions: availableOptions }
  }, [state.data, state.filters, state.columns, state.searchTerm])

  const updateFilter = useCallback((column: string, values: number[]) => {
    console.log("updateFilter called")
    dispatch({ type: "SET_FILTER", payload: { column, values } })
  }, [])

  const clearAllFilters = useCallback(() => {
    console.log("clearAllFilters called")
    dispatch({ type: "CLEAR_FILTERS" })
  }, [])

  const getFilterOptions = useCallback(
    (column: string): number[] => {
      return filteredDataAndOptions.availableFilterOptions[column] || []
    },
    [filteredDataAndOptions.availableFilterOptions],
  )

  const switchDataset = useCallback((datasetName: string) => {
    console.log("switchDataset called")
    dispatch({ type: "SET_DATASET", payload: datasetName })
  }, [])

  const setSearchTerm = useCallback((term: string) => {
    console.log("setSearchTerm called")
    dispatch({ type: "SET_SEARCH_TERM", payload: term })
  }, [])

  const getCurrentPageData = useCallback(() => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage
    const endIndex = Math.min(startIndex + state.itemsPerPage, filteredDataAndOptions.filteredData.length)
    const pageData = filteredDataAndOptions.filteredData.slice(startIndex, endIndex)

    console.log(
      `getCurrentPageData: Page ${state.currentPage}, Start: ${startIndex}, End: ${endIndex}, Data length: ${pageData.length}`,
    )
    if (pageData.length > 0) {
      console.log(`First row: ${pageData[0].number}, Last row: ${pageData[pageData.length - 1].number}`)
    }

    return pageData
  }, [state.currentPage, state.itemsPerPage, filteredDataAndOptions.filteredData])

  const contextValue = useMemo(
    () => ({
      state: {
        ...state,
        filteredData: filteredDataAndOptions.filteredData,
        availableFilterOptions: filteredDataAndOptions.availableFilterOptions,
      },
      dispatch,
      updateFilter,
      clearAllFilters,
      getFilterOptions,
      switchDataset,
      setSearchTerm,
      getCurrentPageData,
    }),
    [
      state,
      filteredDataAndOptions.filteredData,
      filteredDataAndOptions.availableFilterOptions,
      updateFilter,
      clearAllFilters,
      getFilterOptions,
      switchDataset,
      setSearchTerm,
      getCurrentPageData,
    ],
  )

  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
