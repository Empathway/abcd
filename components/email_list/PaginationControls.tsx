import React from 'react';
import { Button } from "@/components/ui/button";
import { PaginationState } from '@/types/subscriber';

interface PaginationControlsProps {
  pagination: PaginationState;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  getVisiblePages: () => number[];
}

/**
 * Pagination controls component
 * @param {PaginationControlsProps} props - Component props
 * @returns {React.ReactElement} - PaginationControls component
 */
export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPreviousPage,
  onNextPage,
  onGoToPage,
  getVisiblePages,
}) => {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
        {pagination.totalItems} results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((pageNum) => (
            <Button
              key={pageNum}
              variant={pagination.currentPage === pageNum ? "default" : "outline"}
              size="sm"
              className="w-8"
              onClick={() => onGoToPage(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
