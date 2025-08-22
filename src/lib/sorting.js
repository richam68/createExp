// Clean, reusable sorting utility functions for employee management

export const sortEmployees = (employees, sortCriteria) => {
  if (!sortCriteria || sortCriteria.length === 0) return employees;
  const sortedEmployees = [...employees].sort((a, b) => {
    // Loop through each sort criterion in priority order
    for (let i = 0; i < sortCriteria.length; i++) {
      const criterion = sortCriteria[i];
      const { field, direction } = criterion;
      let comparison = 0;

      // Get comparison value based on field type
      switch (field) {
        case "employee_name":
          comparison = (a?.employee_name || "").localeCompare(
            b?.employee_name || ""
          );
          break;
        case "employee_salary":
          comparison = (a?.employee_salary || 0) - (b?.employee_salary || 0);
          break;
        case "employee_age":
          const ageA = a?.employee_age ?? null;
          const ageB = b?.employee_age ?? null;
          if (ageA === null && ageB === null) comparison = 0;
          else if (ageA === null) comparison = 1;
          else if (ageB === null) comparison = -1;
          else comparison = ageA - ageB;
          break;
        case "employeeType":
          comparison = (a?.employeeType || "").localeCompare(
            b?.employeeType || ""
          );
          break;
        case "email":
          comparison = (a?.email || "").localeCompare(b?.email || "");
          break;
        case "createdAt":
          const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case "updatedAt":
          const updatedA = a?.updatedAt ? new Date(a.updatedAt) : new Date(0);
          const updatedB = b?.updatedAt ? new Date(b.updatedAt) : new Date(0);
          comparison = updatedA.getTime() - updatedB.getTime();
          break;
        default:
          comparison = 0;
      }

      // If we found a difference, return it (this enables cascading sort)
      if (comparison !== 0) {
        const result = direction === "asc" ? comparison : -comparison;
        return result;
      }
    }
    return 0;
  });

  // Additional debugging: Show specific examples of cascading
  const testEmployees = sortedEmployees.slice(0, 10);
  for (let i = 0; i < testEmployees.length - 1; i++) {
    const current = testEmployees[i];
    const next = testEmployees[i + 1];
  }

  return sortedEmployees;
};

export const getSortDirectionLabel = (field, direction) => {
  switch (field) {
    case "employee_name":
      return direction === "asc" ? "↑ A-Z" : "↓ Z-A";
    case "employee_salary":
      return direction === "asc" ? "↑ Low to High" : "↓ High to Low";
    case "employee_age":
      return direction === "asc" ? "↑ Young to Old" : "↓ Old to Young";
    case "employeeType":
      return direction === "asc" ? "↑ A-Z" : "↓ Z-A";
    case "email":
      return direction === "asc" ? "↑ A-Z" : "↓ Z-A";
    case "createdAt":
      return direction === "asc" ? "↑ Newest to Oldest" : "↓ Oldest to Newest";
    case "updatedAt":
      return direction === "asc" ? "↑ Newest to Oldest" : "↓ Oldest to Newest";
    default:
      return direction === "asc" ? "↑ Ascending" : "↓ Descending";
  }
};

export const getFieldIcon = (field) => {
  switch (field) {
    case "employee_name":
      return "User";
    case "employee_salary":
      return "DollarSign";
    case "employee_age":
      return "Calendar";
    case "employeeType":
      return "Building2";
    case "email":
      return "Mail";
    case "createdAt":
      return "Clock";
    case "updatedAt":
      return "RefreshCw";
    default:
      return "FileText";
  }
};

// Available sort fields for the UI
export const AVAILABLE_SORT_FIELDS = [
  { key: "employee_name", label: "Employee Name" },
  { key: "employee_salary", label: "Salary" },
  { key: "employee_age", label: "Age" },
  { key: "employeeType", label: "Employee Type" },
  { key: "email", label: "Email" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];
