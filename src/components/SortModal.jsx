import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SortAsc,
  GripVertical,
  User,
  DollarSign,
  Calendar,
  Building2,
  Mail,
  Clock,
  RefreshCw,
  FileText,
  Plus,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AVAILABLE_SORT_FIELDS,
  getSortDirectionLabel,
  getFieldIcon,
} from "@/lib/sorting";

// Sortable item component with smooth animations
const SortableItem = ({
  criterion,
  index,
  onSortDirectionChange,
  onRemoveSortCriterion,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: criterion.field });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.05 : 1,
  };

  const IconComponent = getIconComponent(criterion.field);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 
        bg-muted/30 rounded-lg border border-transparent 
        hover:border-muted-foreground/20 transition-all duration-200
        ${isDragging ? "shadow-lg ring-2 ring-primary/20" : ""}
      `}
    >
      {/* Drag handle and icon */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center space-x-2 flex-shrink-0 cursor-move 
                   hover:bg-muted/50 p-1 rounded transition-colors duration-150"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Field label */}
      <span className="flex-1 font-medium text-sm min-w-0">
        {AVAILABLE_SORT_FIELDS.find((f) => f.key === criterion.field)?.label}
      </span>

      {/* Direction buttons */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0 w-full sm:w-auto">
        <Button
          variant={criterion.direction === "asc" ? "default" : "outline"}
          size="sm"
          onClick={() => onSortDirectionChange(index, "asc")}
          className="text-xs px-3 py-1 h-8 w-full sm:w-auto transition-all duration-150"
        >
          {getSortDirectionLabel(criterion.field, "asc")}
        </Button>
        <Button
          variant={criterion.direction === "desc" ? "default" : "outline"}
          size="sm"
          onClick={() => onSortDirectionChange(index, "desc")}
          className="text-xs px-3 py-1 h-8 w-full sm:w-auto transition-all duration-150"
        >
          {getSortDirectionLabel(criterion.field, "desc")}
        </Button>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemoveSortCriterion(index)}
        className="text-destructive hover:text-destructive flex-shrink-0 
                   px-2 py-1 h-8 w-8 transition-colors duration-150"
      >
        ×
      </Button>
    </div>
  );
};

// Icon mapping for sort fields
const getIconComponent = (field) => {
  switch (field) {
    case "employee_name":
      return User;
    case "employee_salary":
      return DollarSign;
    case "employee_age":
      return Calendar;
    case "employeeType":
      return Building2;
    case "email":
      return Mail;
    case "createdAt":
      return Clock;
    case "updatedAt":
      return RefreshCw;
    default:
      return FileText;
  }
};

// Main SortModal component
const SortModal = ({
  sortCriteria,
  onSortDirectionChange,
  onRemoveSortCriterion,
  onClearAllSorts,
  onSortCriteriaReorder,
  isOpen,
  onOpenChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sortCriteria.findIndex(
        (item) => item.field === active.id
      );
      const newIndex = sortCriteria.findIndex((item) => item.field === over.id);

      const newSortCriteria = arrayMove(sortCriteria, oldIndex, newIndex);
      onSortCriteriaReorder(newSortCriteria);
    }
  };

  const addSortCriterion = (field) => {
    const newCriterion = { field, direction: "asc" };
    const newSortCriteria = [...sortCriteria, newCriterion];
    onSortCriteriaReorder(newSortCriteria);
  };

  const getAvailableFields = () => {
    const usedFields = sortCriteria.map((item) => item.field);
    return AVAILABLE_SORT_FIELDS.filter(
      (field) => !usedFields.includes(field.key)
    );
  };

  const availableFields = getAvailableFields();

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 w-full sm:w-auto transition-all duration-150"
        >
          <SortAsc className="h-4 w-4" />
          <span className="hidden sm:inline">Sort ({sortCriteria.length})</span>
          <span className="sm:hidden">Sort</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[95vw] sm:w-[500px] lg:w-[600px] p-0"
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="p-4 border-b bg-muted/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Sort By</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {sortCriteria.length} active sort criteria
              </p>
            </div>
            {availableFields.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="transition-all duration-150"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {availableFields.map((field) => (
                    <DropdownMenuItem
                      key={field.key}
                      onClick={() => addSortCriterion(field.key)}
                      className="transition-colors duration-150"
                    >
                      {field.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortCriteria.map((item) => item.field)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                {sortCriteria.map((criterion, index) => (
                  <SortableItem
                    key={criterion.field}
                    criterion={criterion}
                    index={index}
                    onSortDirectionChange={onSortDirectionChange}
                    onRemoveSortCriterion={onRemoveSortCriterion}
                  />
                ))}

                {sortCriteria.length === 0 && (
                  <div className="text-center py-8 transition-opacity duration-200">
                    <p className="text-muted-foreground">
                      No sort criteria added. Use the "Add Field" button to add
                      sorting criteria.
                    </p>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="p-4 border-t bg-muted/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={onClearAllSorts}
              className="text-muted-foreground hover:text-foreground w-full sm:w-auto 
                         transition-colors duration-150"
            >
              Clear all
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto transition-all duration-150"
            >
              Apply Sort
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortModal;
