import { useState, useCallback, useMemo } from 'react';
import { PaginationState } from '../types/subscriber';

/**
 * Custom hook for managing pagination state
 * @param {number} itemsPerPage - Number of items to show per page
 * @returns {object} - Object containing pagination state and functions
 */
export const usePagination = (itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Calculates pagination state based on total items
   * @param {number} totalItems - Total number of items to paginate
   * @returns {PaginationState} - Complete pagination state
   */
  const paginationState = useCallback((totalItems: number): PaginationState => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
    };
  }, [currentPage, itemsPerPage]);

  /**
   * Gets paginated subset of items
   * @param {T[]} items - Array of items to paginate
   * @returns {T[]} - Paginated subset of items
   */
  const getPaginatedItems = useCallback(<T>(items: T[]): T[] => {
    try {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return items.slice(startIndex, startIndex + itemsPerPage);
    } catch (error) {
      console.error('Error paginating items:', error);
      return items;
    }
  }, [currentPage, itemsPerPage]);

  /**
   * Navigates to next page
   * @param {number} totalPages - Total number of pages
   */
  const nextPage = useCallback((totalPages: number) => {
    setCurrentPage(prev => prev < totalPages ? prev + 1 : prev);
  }, []);

  /**
   * Navigates to previous page
   */
  const previousPage = useCallback(() => {
    setCurrentPage(prev => prev > 1 ? prev - 1 : prev);
  }, []);

  /**
   * Navigates to specific page
   * @param {number} page - Page number to navigate to
   * @param {number} totalPages - Total number of pages
   */
  const goToPage = useCallback((page: number, totalPages: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, []);

  /**
   * Resets pagination to first page
   */
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  /**
   * Generates array of page numbers for pagination display
   * @param {number} totalPages - Total number of pages
   * @param {number} maxVisible - Maximum number of page buttons to show
   * @returns {number[]} - Array of page numbers to display
   */
  const getVisiblePages = useCallback((totalPages: number, maxVisible: number = 5): number[] => {
    try {
      if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (currentPage <= 3) {
        return Array.from({ length: maxVisible }, (_, i) => i + 1);
      }

      if (currentPage >= totalPages - 2) {
        return Array.from({ length: maxVisible }, (_, i) => totalPages - maxVisible + 1 + i);
      }

      return Array.from({ length: maxVisible }, (_, i) => currentPage - 2 + i);
    } catch (error) {
      console.error('Error generating visible pages:', error);
      return [1];
    }
  }, [currentPage]);

  return {
    currentPage,
    paginationState,
    getPaginatedItems,
    nextPage,
    previousPage,
    goToPage,
    resetPagination,
    getVisiblePages,
  };
};
