# Multi-Level Sorting System with Drag & Drop

Reusable React implementation of a multi-level sorting system using dnd-kit for drag-and-drop functionality.

## Features

- **Multiple Sort Criteria** - Add unlimited sorting fields
- **Ascending/Descending Toggle** - Each criterion supports both directions
- **Drag & Drop Ordering** - Reorder criteria using dnd-kit for dynamic priority changes
- **Multi-Level Sorting Logic** - All criteria work together in sequence
- **Subtle Animations** - Smooth transitions and visual feedback
- **Responsive Design** - Works on mobile and desktop
- **localStorage Persistence** - Sort preferences are saved automatically

## How Multi-Level Sorting Works

The sorting system applies criteria in the order they appear:

1. **First criterion** sorts the entire dataset
2. **Second criterion** sorts items that are equal on the first
3. **Third criterion** sorts items equal on the first two
4. **And so on...**

### Example:

```
Sort Criteria Order:
1. Created At (descending) - Newest first
2. Salary (ascending) - Low to High
3. Age (ascending) - Young to Old

Result:
- Items are first sorted by creation date (newest first)
- Within the same creation date, items are sorted by salary (low to high)
- Within the same creation date AND salary, items are sorted by age (young to old)
```

## Implementation

### 1. Sorting Utility (`src/lib/sorting.js`)

```javascript
import { sortEmployees, AVAILABLE_SORT_FIELDS } from "@/lib/sorting";

// Sort your data
const sortedData = sortEmployees(employees, sortCriteria);

// Available fields for UI
console.log(AVAILABLE_SORT_FIELDS);
// [
//   { key: "employee_name", label: "Employee Name" },
//   { key: "employee_salary", label: "Salary" },
//   { key: "employee_age", label: "Age" },
//   // ... more fields
// ]
```

### 2. SortModal Component (`src/components/SortModal.jsx`)

```jsx
import SortModal from "@/components/SortModal";

<SortModal
  sortCriteria={sortCriteria}
  onSortDirectionChange={handleSortDirectionChange}
  onRemoveSortCriterion={removeSortCriterion}
  onClearAllSorts={clearAllSorts}
  onSortCriteriaReorder={handleSortCriteriaReorder}
  isOpen={isSortPopoverOpen}
  onOpenChange={setIsSortPopoverOpen}
/>;
```

### 3. Main Page Integration (`src/app/page.js`)

```jsx
// State for sort criteria
const [sortCriteria, setSortCriteria] = useState([
  { field: "employee_name", direction: "asc" },
  { field: "createdAt", direction: "desc" },
  { field: "employee_salary", direction: "asc" },
]);

// Apply sorting to your data
useEffect(() => {
  const sortedData = sortEmployees(filteredData, sortCriteria);
  setFilteredData(sortedData);
}, [sortCriteria]);

// Handlers for sort operations
const handleSortDirectionChange = (fieldIndex, newDirection) => {
  const newSortCriteria = [...sortCriteria];
  newSortCriteria[fieldIndex] = {
    ...newSortCriteria[fieldIndex],
    direction: newDirection,
  };
  setSortCriteria(newSortCriteria);
};

const handleSortCriteriaReorder = (newSortCriteria) => {
  setSortCriteria(newSortCriteria);
};
```

## Customization

### Adding New Sort Fields

1. **Update the sorting logic** in `src/lib/sorting.js`:

```javascript
case "new_field":
  comparison = (a?.new_field || "").localeCompare(b?.new_field || "");
  break;
```

2. **Add to AVAILABLE_SORT_FIELDS**:

```javascript
export const AVAILABLE_SORT_FIELDS = [
  // ... existing fields
  { key: "new_field", label: "New Field" },
];
```

3. **Add icon mapping** in `SortModal.jsx`:

```javascript
const getIconComponent = (field) => {
  switch (field) {
    // ... existing cases
    case "new_field":
      return NewIcon;
    default:
      return FileText;
  }
};
```

### Styling Customization

The component uses Tailwind CSS classes and can be easily customized:

```jsx
// Custom button styles
<Button className="bg-blue-500 hover:bg-blue-600 text-white">
  Custom Sort Button
</Button>

// Custom modal width
<PopoverContent className="w-[800px] p-0">
  {/* Your content */}
</PopoverContent>
```

## Dependencies

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "lucide-react": "^0.540.0"
}
```

## Responsive Behavior

- **Mobile (< 640px)**: Full-width modal, stacked buttons
- **Tablet (640px - 1024px)**: Medium-width modal, side-by-side buttons
- **Desktop (> 1024px)**: Large modal with optimal spacing

## Animations

- **Drag feedback**: Opacity changes and scale effects
- **Smooth transitions**: 200ms duration for all interactions
- **Hover effects**: Subtle color and border changes
- **Loading states**: Visual feedback during operations

## Persistence

Sort criteria are automatically saved to localStorage:

```javascript
// Save to localStorage
useEffect(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem("employeeSortCriteria", JSON.stringify(sortCriteria));
  }
}, [sortCriteria]);

// Load from localStorage
const [sortCriteria, setSortCriteria] = useState(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("employeeSortCriteria");
    return saved ? JSON.parse(saved) : defaultSortCriteria;
  }
  return defaultSortCriteria;
});
```

## Testing

1. **Open the sort modal** by clicking the "Sort" button
2. **Add multiple criteria** using the "Add Field" button
3. **Drag and drop** to reorder criteria
4. **Change directions** with ↑/↓ buttons
5. **Verify sorting** - check that all criteria work together
6. **Test persistence** - refresh the page to see saved preferences

## Performance

- **Efficient sorting**: O(n log n) complexity with proper cascading
- **Debounced updates**: Prevents excessive re-renders
- **Optimized drag**: 8px activation constraint prevents accidental drags
- **Memoized components**: React.memo for performance optimization

## Troubleshooting

### Sorting not working?

- Check console for errors
- Verify sortCriteria state is updating
- Ensure sortEmployees function is being called

### Drag and drop not working?

- Verify @dnd-kit packages are installed
- Check that items have unique IDs
- Ensure proper event handlers are connected

### Styling issues?

- Verify Tailwind CSS is properly configured
- Check for CSS conflicts
- Ensure all required classes are available

## License

This implementation is part of your project and follows the same license terms.
