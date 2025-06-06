"use client";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  DashboardProvider,
  useDashboard,
} from "@/components/dashboard-context";
import { MultiSelectFilter } from "@/components/multi-select-filter";
import "@testing-library/jest-dom";

global.fetch = jest.fn();

const mockData = [
  { number: 1, mod3: 1, mod4: 1, mod5: 1, mod6: 1 },
  { number: 2, mod3: 2, mod4: 2, mod5: 2, mod6: 2 },
  { number: 3, mod3: 0, mod4: 3, mod5: 3, mod6: 3 },
  { number: 4, mod3: 1, mod4: 0, mod5: 4, mod6: 4 },
  { number: 5, mod3: 2, mod4: 1, mod5: 0, mod6: 5 },
];

const mockCsvData = `number,mod3,mod4,mod5,mod6
1,1,1,1,1
2,2,2,2,2
3,0,3,3,3
4,1,0,4,4
5,2,1,0,5`;

beforeEach(() => {
  (fetch as jest.Mock).mockResolvedValue({
    text: () => Promise.resolve(mockCsvData),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Dashboard Context", () => {
  test("loads and parses CSV data correctly", async () => {
    let contextValue: any;

    function TestComponent() {
      contextValue = useDashboard();
      return <div>Test</div>;
    }

    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    await waitFor(() => {
      expect(contextValue.state.loading).toBe(false);
    });

    expect(contextValue.state.data).toHaveLength(5);
    expect(contextValue.state.data[0]).toEqual({
      number: 1,
      mod3: 1,
      mod4: 1,
      mod5: 1,
      mod6: 1,
    });
  });

  test("filters data correctly", async () => {
    let contextValue: any;

    function TestComponent() {
      contextValue = useDashboard();
      return <div>Test</div>;
    }

    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    await waitFor(() => {
      expect(contextValue.state.loading).toBe(false);
    });

    contextValue.updateFilter("mod3", [1]);

    await waitFor(() => {
      expect(contextValue.state.filteredData).toHaveLength(2);
      expect(
        contextValue.state.filteredData.every((row: any) => row.mod3 === 1)
      ).toBe(true);
    });
  });

  test("updates available filter options based on other filters", async () => {
    let contextValue: any;

    function TestComponent() {
      contextValue = useDashboard();
      return <div>Test</div>;
    }

    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    await waitFor(() => {
      expect(contextValue.state.loading).toBe(false);
    });

    expect(contextValue.getFilterOptions("mod4")).toEqual([0, 1, 2, 3]);

    // Applying filter for mod3 = 1
    contextValue.updateFilter("mod3", [1]);

    await waitFor(() => {
      const mod4Options = contextValue.getFilterOptions("mod4");
      expect(mod4Options).toEqual([0, 1]); 
    });
  });
});

describe("MultiSelectFilter", () => {
  test("renders with placeholder when no values selected", () => {
    render(
      <MultiSelectFilter
        options={[1, 2, 3]}
        selectedValues={[]}
        onChange={() => {}}
        placeholder="Select values"
      />
    );

    expect(screen.getByText("Select values")).toBeInTheDocument();
  });

  test("shows selected count when multiple values selected", () => {
    render(
      <MultiSelectFilter
        options={[1, 2, 3]}
        selectedValues={[1, 2]}
        onChange={() => {}}
        placeholder="Select values"
      />
    );

    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  test("filters options based on search term", async () => {
    render(
      <MultiSelectFilter
        options={[10, 20, 30, 100, 200]}
        selectedValues={[]}
        onChange={() => {}}
        placeholder="Select values"
        searchPlaceholder="Search..."
      />
    );

    fireEvent.click(screen.getByText("Select values"));

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "10" } });

    await waitFor(() => {
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.queryByText("20")).not.toBeInTheDocument();
    });
  });

  test("calls onChange when option is selected", () => {
    const mockOnChange = jest.fn();

    render(
      <MultiSelectFilter
        options={[1, 2, 3]}
        selectedValues={[]}
        onChange={mockOnChange}
        placeholder="Select values"
      />
    );

    fireEvent.click(screen.getByText("Select values"));

    fireEvent.click(screen.getByText("1"));

    expect(mockOnChange).toHaveBeenCalledWith([1]);
  });
});
