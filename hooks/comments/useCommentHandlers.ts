import { useCallback } from 'react';
import { toast } from 'sonner';
import { Comment } from '@/types/comment';
import { 
  generateCommentCsvContent,
  downloadCsvFile,
  getCurrentDate
} from '@/lib/utils/comment-utils';

/**
 * Custom hook for all comment-related handlers (YouTube Studio style)
 * @param {Object} managers - Object containing all manager hooks
 * @returns {Object} - Object containing all handler functions
 */
export const useCommentHandlers = (managers: {
  commentManager: any;
  filterManager: any;
  selectionManager: any;
  paginationManager: any;
}) => {
  /**
   * Handles search change with pagination reset
   * @param {string} value - Search term value
   */
  const handleSearchChange = useCallback((value: string) => {
    managers.filterManager.updateSearchTerm(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles status filter change with pagination reset
   * @param {string} value - Status filter value
   */
  const handleStatusFilterChange = useCallback((value: string) => {
    managers.filterManager.updateStatusFilter(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles blog post filter change with pagination reset
   * @param {string} value - Blog post filter value
   */
  const handleBlogPostFilterChange = useCallback((value: string) => {
    managers.filterManager.updateBlogPostFilter(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles date filter change with pagination reset
   * @param {string} value - Date filter value
   */
  const handleDateFilterChange = useCallback((value: string) => {
    managers.filterManager.updateDateFilter(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles type filter change with pagination reset
   * @param {string} value - Type filter value
   */
  const handleTypeFilterChange = useCallback((value: string) => {
    managers.filterManager.updateTypeFilter(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles clearing all filters
   */
  const handleClearFilters = useCallback(() => {
    managers.filterManager.clearFilters();
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
    toast.success("Filters cleared");
  }, [managers]);

  /**
   * Handles inline reply to comment
   * @param {string} parentId - ID of parent comment
   * @param {string} content - Reply content
   */
  const handleInlineReply = useCallback(async (parentId: string, content: string) => {
    try {
      const success = await managers.commentManager.addReply(parentId, {
        content,
        status: "Approved" // Auto-approve admin replies
      });
      
      if (success) {
        toast.success("Reply posted successfully");
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  }, [managers.commentManager]);

  /**
   * Handles bulk status update
   * @param {string} status - New status for selected comments
   */
  const handleBulkStatusUpdate = useCallback(async (status: Comment['status']) => {
    try {
      await managers.commentManager.bulkUpdateStatus(managers.selectionManager.selectedComments, status);
      managers.selectionManager.clearSelection();
    } catch (error) {
      console.error('Error updating comment statuses:', error);
    }
  }, [managers]);

  /**
   * Handles exporting comments to CSV
   */
  const handleExportComments = useCallback(() => {
    try {
      if (managers.filterManager.filteredComments.length === 0) {
        toast.error("No comments to export.");
        return;
      }

      const csvContent = generateCommentCsvContent(managers.filterManager.filteredComments);
      const filename = `comments-${getCurrentDate()}.csv`;
      
      downloadCsvFile(csvContent, filename);
      toast.success(`${managers.filterManager.filteredComments.length} comments exported successfully`);
    } catch (error) {
      console.error('Error exporting comments:', error);
      toast.error('Failed to export comments');
    }
  }, [managers.filterManager.filteredComments]);

  return {
    // Filter handlers
    handleSearchChange,
    handleStatusFilterChange,
    handleBlogPostFilterChange,
    handleDateFilterChange,
    handleTypeFilterChange,
    handleClearFilters,

    // Action handlers
    handleInlineReply,
    handleBulkStatusUpdate,
    handleExportComments,
  };
};
