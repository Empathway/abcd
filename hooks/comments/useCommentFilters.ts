import { useState, useCallback, useMemo } from 'react';
import { Comment, CommentFilterState } from '@/types/comment';

/**
 * Custom hook for managing comment filters and search
 * @param {Comment[]} comments - Array of comments to filter
 * @returns {object} - Object containing filtered data and filter functions
 */
export const useCommentFilters = (comments: Comment[]) => {
  const [filters, setFilters] = useState<CommentFilterState>({
    searchTerm: '',
    statusFilter: 'All',
    blogPostFilter: 'All',
    dateFilter: 'All',
    typeFilter: 'All',
  });

  /**
   * Filters comments based on current filter state
   * @returns {Comment[]} - Filtered array of comments
   */
  const filteredComments = useMemo(() => {
    try {
      let filtered = [...comments];

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.content.toLowerCase().includes(searchLower) ||
            c.authorName.toLowerCase().includes(searchLower) ||
            c.authorEmail.toLowerCase().includes(searchLower) ||
            c.blogPostTitle.toLowerCase().includes(searchLower)
        );
      }

      if (filters.statusFilter !== 'All') {
        filtered = filtered.filter((c) => c.status === filters.statusFilter);
      }

      if (filters.blogPostFilter !== 'All') {
        filtered = filtered.filter((c) => c.blogPostId === filters.blogPostFilter);
      }

      if (filters.typeFilter !== 'All') {
        if (filters.typeFilter === 'Comments') {
          filtered = filtered.filter((c) => !c.isReply);
        } else if (filters.typeFilter === 'Replies') {
          filtered = filtered.filter((c) => c.isReply);
        }
      }

      if (filters.dateFilter !== 'All') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (filters.dateFilter) {
          case 'Today':
            filterDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(c => new Date(c.createdDate) >= filterDate);
            break;
          case 'This Week':
            filterDate.setDate(now.getDate() - 7);
            filtered = filtered.filter(c => new Date(c.createdDate) >= filterDate);
            break;
          case 'This Month':
            filterDate.setMonth(now.getMonth() - 1);
            filtered = filtered.filter(c => new Date(c.createdDate) >= filterDate);
            break;
          case 'This Year':
            filterDate.setFullYear(now.getFullYear() - 1);
            filtered = filtered.filter(c => new Date(c.createdDate) >= filterDate);
            break;
        }
      }

      return filtered;
    } catch (error) {
      console.error('Error filtering comments:', error);
      return comments;
    }
  }, [comments, filters]);

  /**
   * Updates search term filter
   * @param {string} searchTerm - Search term to filter by
   */
  const updateSearchTerm = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  /**
   * Updates status filter
   * @param {string} statusFilter - Status to filter by
   */
  const updateStatusFilter = useCallback((statusFilter: string) => {
    setFilters(prev => ({ ...prev, statusFilter }));
  }, []);

  /**
   * Updates blog post filter
   * @param {string} blogPostFilter - Blog post to filter by
   */
  const updateBlogPostFilter = useCallback((blogPostFilter: string) => {
    setFilters(prev => ({ ...prev, blogPostFilter }));
  }, []);

  /**
   * Updates date filter
   * @param {string} dateFilter - Date range to filter by
   */
  const updateDateFilter = useCallback((dateFilter: string) => {
    setFilters(prev => ({ ...prev, dateFilter }));
  }, []);

  /**
   * Updates type filter
   * @param {string} typeFilter - Type to filter by
   */
  const updateTypeFilter = useCallback((typeFilter: string) => {
    setFilters(prev => ({ ...prev, typeFilter }));
  }, []);

  /**
   * Clears all filters and resets to default state
   */
  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: 'All',
      blogPostFilter: 'All',
      dateFilter: 'All',
      typeFilter: 'All',
    });
  }, []);

  /**
   * Checks if any filters are currently active
   * @returns {boolean} - True if any filters are applied
   */
  const hasActiveFilters = useMemo(() => {
    return filters.searchTerm !== '' || 
           filters.statusFilter !== 'All' || 
           filters.blogPostFilter !== 'All' ||
           filters.dateFilter !== 'All' ||
           filters.typeFilter !== 'All';
  }, [filters]);

  return {
    filters,
    filteredComments,
    updateSearchTerm,
    updateStatusFilter,
    updateBlogPostFilter,
    updateDateFilter,
    updateTypeFilter,
    clearFilters,
    hasActiveFilters,
  };
};
