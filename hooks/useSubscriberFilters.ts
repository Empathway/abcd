import { useState, useCallback, useMemo } from 'react';
import { Subscriber, FilterState } from '../types/subscriber';

/**
 * Custom hook for managing subscriber filters and search
 * @param {Subscriber[]} subscribers - Array of subscribers to filter
 * @returns {object} - Object containing filtered data and filter functions
 */
export const useSubscriberFilters = (subscribers: Subscriber[]) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    statusFilter: 'All',
    sourceFilter: 'All',
  });

  /**
   * Filters subscribers based on current filter state
   * @returns {Subscriber[]} - Filtered array of subscribers
   */
  const filteredSubscribers = useMemo(() => {
    try {
      let filtered = [...subscribers];

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(searchLower) ||
            s.email.toLowerCase().includes(searchLower) ||
            s.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      if (filters.statusFilter !== 'All') {
        filtered = filtered.filter((s) => s.status === filters.statusFilter);
      }

      if (filters.sourceFilter !== 'All') {
        filtered = filtered.filter((s) => s.source === filters.sourceFilter);
      }

      return filtered;
    } catch (error) {
      console.error('Error filtering subscribers:', error);
      return subscribers;
    }
  }, [subscribers, filters]);

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
   * Updates source filter
   * @param {string} sourceFilter - Source to filter by
   */
  const updateSourceFilter = useCallback((sourceFilter: string) => {
    setFilters(prev => ({ ...prev, sourceFilter }));
  }, []);

  /**
   * Clears all filters and resets to default state
   */
  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: 'All',
      sourceFilter: 'All',
    });
  }, []);

  /**
   * Checks if any filters are currently active
   * @returns {boolean} - True if any filters are applied
   */
  const hasActiveFilters = useMemo(() => {
    return filters.searchTerm !== '' || 
           filters.statusFilter !== 'All' || 
           filters.sourceFilter !== 'All';
  }, [filters]);

  return {
    filters,
    filteredSubscribers,
    updateSearchTerm,
    updateStatusFilter,
    updateSourceFilter,
    clearFilters,
    hasActiveFilters,
  };
};
