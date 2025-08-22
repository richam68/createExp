"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Filter } from "lucide-react";
import { sortEmployees } from "@/lib/sorting";
import SearchBar from "@/components/SearchBar";
import FilterTabs from "@/components/FilterTabs";
import SortModal from "@/components/SortModal";
import EmployeeTable from "@/components/EmployeeTable";
import Pagination from "@/components/Pagination";
import useDebounce from "@/hooks/useDebounce";

// Default sort criteria
const defaultSortCriteria = [
  { field: "employee_name", direction: "asc" },
  { field: "createdAt", direction: "asc" },
  { field: "employee_salary", direction: "desc" },
  { field: "employee_age", direction: "asc" },
  { field: "employeeType", direction: "asc" },
  { field: "email", direction: "asc" },
  { field: "updatedAt", direction: "desc" },
];

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSortPopoverOpen, setIsSortPopoverOpen] = useState(false);

  const [sortCriteria, setSortCriteria] = useState(() => {
    // Load from localStorage or use default
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("employeeSortCriteria");
      return saved ? JSON.parse(saved) : defaultSortCriteria;
    }
    return defaultSortCriteria;
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Save sort criteria to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "employeeSortCriteria",
        JSON.stringify(sortCriteria)
      );
    }
  }, [sortCriteria]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/api/employees");
        setEmployees(response.data.employees);
        setFilteredEmployees(response.data.employees);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employees data");
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...employees];

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered?.filter(
        (employee) =>
          employee?.employeeType?.toLowerCase() === activeTab?.toLowerCase()
      );
    }

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered?.filter(
        (employee) =>
          employee?.employee_name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          employee?.email
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          employee?.employeeType
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // console.log("SORTING TRIGGERED ");
    // console.log("Filtered data count:", filtered.length);
    // console.log(
    //   "Current sort criteria:",
    //   JSON.stringify(sortCriteria, null, 2)
    // );
    // console.log(
    //   "Sample dates:",
    //   filtered.slice(0, 3).map((e) => e.createdAt)
    // );

    // Apply sorting with multi-level support
    const sortedEmployees = sortEmployees(filtered, sortCriteria);
    setFilteredEmployees(sortedEmployees);

    // Reset to first page when filters change
    setCurrentPage(1);
  }, [employees, activeTab, debouncedSearchTerm, sortCriteria]);

  // Test function for debugging sorting
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.testSorting = () => {
        // console.log("Testing sorting function...");
        // console.log("Current sort criteria:", sortCriteria);
        // console.log("Sample employees:", employees.slice(0, 5));

        // Test with a better example that will show cascading
        const testData = [
          {
            employee_name: "Alice",
            createdAt: "2024-06-10T09:00:00Z",
            employee_salary: 50000,
            employeeType: "Individual",
          },
          {
            employee_name: "Bob",
            createdAt: "2024-06-10T09:00:00Z",
            employee_salary: 60000,
            employeeType: "Individual",
          },
          {
            employee_name: "Charlie",
            createdAt: "2024-06-10T09:00:00Z",
            employee_salary: 40000,
            employeeType: "Company",
          },
          {
            employee_name: "David",
            createdAt: "2024-06-10T09:00:00Z",
            employee_salary: 50000,
            employeeType: "Individual",
          },
          {
            employee_name: "Eve",
            createdAt: "2024-07-15T09:30:00Z",
            employee_salary: 70000,
            employeeType: "Company",
          },
        ];

        // console.log("Test data (should show cascading):", testData);
        // console.log(
        //   "Expected: Same dates should be sorted by salary, then by type, then by name"
        // );

        // const sorted = sortEmployees(testData, sortCriteria);
        // console.log("Sorted test data:", sorted);

        // // Test specific cascading
        // console.log("\n Testing specific cascading scenarios:");
        // const sameDateGroup = testData.filter(
        //   (item) => item.createdAt === "2024-06-10T09:00:00Z"
        // );
        // console.log("Items with same date (2024-06-10):", sameDateGroup);
        // console.log("These should be sorted by the second criterion (salary)");
      };
    }
  }, [sortCriteria, employees]);

  // Pagination logic
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage;
  const endItem = startItem + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startItem, endItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortDirectionChange = (fieldIndex, newDirection) => {
    const newSortCriteria = [...sortCriteria];
    newSortCriteria[fieldIndex] = {
      ...newSortCriteria[fieldIndex],
      direction: newDirection,
    };
    setSortCriteria(newSortCriteria);
  };

  const removeSortCriterion = (fieldIndex) => {
    const newSortCriteria = sortCriteria.filter(
      (_, index) => index !== fieldIndex
    );
    setSortCriteria(newSortCriteria);
  };

  const clearAllSorts = () => {
    setSortCriteria([]);
  };

  const handleSortCriteriaReorder = (newSortCriteria) => {
    setSortCriteria(newSortCriteria);
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeTab !== "all") count++;
    if (searchTerm) count++;
    if (sortCriteria.length > 0) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Employees
          </h1>
          <p className="text-muted-foreground">
            Total employees: {filteredEmployees.length}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-lg border shadow-sm">
          {/* Tabs */}
          <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Action Bar */}
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Left side - Search and Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search employees..."
                />

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800 hover:bg-red-100"
                  >
                    Filter Applies {getActiveFiltersCount()}
                  </Badge>
                </div>

                <SortModal
                  sortCriteria={sortCriteria}
                  onSortDirectionChange={handleSortDirectionChange}
                  onRemoveSortCriterion={removeSortCriterion}
                  onClearAllSorts={clearAllSorts}
                  onSortCriteriaReorder={handleSortCriteriaReorder}
                  isOpen={isSortPopoverOpen}
                  onOpenChange={setIsSortPopoverOpen}
                />
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0 w-10 h-10"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                    <DropdownMenuItem>Import Data</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Table */}
          <EmployeeTable
            employees={currentEmployees}
            formatSalary={formatSalary}
            formatDate={formatDate}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              startItem={startItem}
              endItem={endItem}
            />
          )}
        </div>
      </div>
    </div>
  );
}
