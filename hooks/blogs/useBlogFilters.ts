import { useState, useCallback, useMemo } from 'react';
import { BlogPost, BlogFilterState } from '@/types/blog';

/**
 * Custom hook for managing blog post filters and search
 * @param {BlogPost[]} posts - Array of blog posts to filter
 * @returns {object} - Object containing filtered data and filter functions
 */
export const useBlogFilters = (posts: BlogPost[]) => {
  const [filters, setFilters] = useState<BlogFilterState>({
    searchTerm: '',
    statusFilter: 'All',
    categoryFilter: 'All',
    dateFilter: 'All',
    featuredFilter: 'All',
  });

  /**
   * Filters blog posts based on current filter state
   * @returns {BlogPost[]} - Filtered array of blog posts
   */
  const filteredPosts = useMemo(() => {
    try {
      let filtered = [...posts];

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(searchLower) ||
            p.excerpt.toLowerCase().includes(searchLower) ||
            p.content.toLowerCase().includes(searchLower) ||
            p.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
            p.categories.some(cat => cat.toLowerCase().includes(searchLower))
        );
      }

      if (filters.statusFilter !== 'All') {
        filtered = filtered.filter((p) => p.status === filters.statusFilter);
      }

      if (filters.categoryFilter !== 'All') {
        filtered = filtered.filter((p) => p.categories.includes(filters.categoryFilter));
      }

      if (filters.featuredFilter !== 'All') {
        const isFeatured = filters.featuredFilter === 'Featured';
        filtered = filtered.filter((p) => p.isFeatured === isFeatured);
      }

      if (filters.dateFilter !== 'All') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (filters.dateFilter) {
          case 'Today':
            filterDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(p => new Date(p.createdDate) >= filterDate);
            break;
          case 'This Week':
            filterDate.setDate(now.getDate() - 7);
            filtered = filtered.filter(p => new Date(p.createdDate) >= filterDate);
            break;
          case 'This Month':
            filterDate.setMonth(now.getMonth() - 1);
            filtered = filtered.filter(p => new Date(p.createdDate) >= filterDate);
            break;
          case 'This Year':
            filterDate.setFullYear(now.getFullYear() - 1);
            filtered = filtered.filter(p => new Date(p.createdDate) >= filterDate);
            break;
        }
      }

      return filtered;
    } catch (error) {
      console.error('Error filtering blog posts:', error);
      return posts;
    }
  }, [posts, filters]);

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
   * Updates category filter
   * @param {string} categoryFilter - Category to filter by
   */
  const updateCategoryFilter = useCallback((categoryFilter: string) => {
    setFilters(prev => ({ ...prev, categoryFilter }));
  }, []);

  /**
   * Updates date filter
   * @param {string} dateFilter - Date range to filter by
   */
  const updateDateFilter = useCallback((dateFilter: string) => {
    setFilters(prev => ({ ...prev, dateFilter }));
  }, []);

  /**
   * Updates featured filter
   * @param {string} featuredFilter - Featured status to filter by
   */
  const updateFeaturedFilter = useCallback((featuredFilter: string) => {
    setFilters(prev => ({ ...prev, featuredFilter }));
  }, []);

  /**
   * Clears all filters and resets to default state
   */
  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: 'All',
      categoryFilter: 'All',
      dateFilter: 'All',
      featuredFilter: 'All',
    });
  }, []);

  /**
   * Checks if any filters are currently active
   * @returns {boolean} - True if any filters are applied
   */
  const hasActiveFilters = useMemo(() => {
    return filters.searchTerm !== '' || 
           filters.statusFilter !== 'All' || 
           filters.categoryFilter !== 'All' ||
           filters.dateFilter !== 'All' ||
           filters.featuredFilter !== 'All';
  }, [filters]);

  return {
    filters,
    filteredPosts,
    updateSearchTerm,
    updateStatusFilter,
    updateCategoryFilter,
    updateDateFilter,
    updateFeaturedFilter,
    clearFilters,
    hasActiveFilters,
  };
};
