import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  startItem,
  endItem,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // Reusable button renderer
  const renderNavButton = ({
    icon: Icon,
    onClick,
    disabled,
    extraClasses = "",
  }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={extraClasses}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/20">
      {/* Items info */}
      <div className="text-sm text-muted-foreground">
        Showing {startItem + 1} to {Math.min(endItem, totalItems)} of{" "}
        {totalItems} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {renderNavButton({
          icon: ChevronsLeft,
          onClick: () => onPageChange(1),
          disabled: currentPage === 1,
          extraClasses: "hidden sm:flex",
        })}

        {renderNavButton({
          icon: ChevronLeft,
          onClick: () => onPageChange(currentPage - 1),
          disabled: currentPage === 1,
        })}

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className="w-8 h-8 p-0 text-xs"
            >
              {page}
            </Button>
          ))}
        </div>

        {renderNavButton({
          icon: ChevronRight,
          onClick: () => onPageChange(currentPage + 1),
          disabled: currentPage === totalPages,
        })}

        {renderNavButton({
          icon: ChevronsRight,
          onClick: () => onPageChange(totalPages),
          disabled: currentPage === totalPages,
          extraClasses: "hidden sm:flex",
        })}
      </div>
    </div>
  );
};

export default Pagination;
