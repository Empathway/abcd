import { useState, useCallback, useMemo } from 'react';
import { Campaign } from '@/types/campaign';

interface CampaignFilterState {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
}

/**
 * Custom hook for managing campaign filters and search
 * @param {Campaign[]} campaigns - Array of campaigns to filter
 * @returns {object} - Object containing filtered data and filter functions
 */
export const useCampaignFilters = (campaigns: Campaign[]) => {
  const [filters, setFilters] = useState<CampaignFilterState>({
    searchTerm: '',
    statusFilter: 'All',
    dateFilter: 'All',
  });

  /**
   * Filters campaigns based on current filter state
   * @returns {Campaign[]} - Filtered array of campaigns
   */
  const filteredCampaigns = useMemo(() => {
    try {
      let filtered = [...campaigns];

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.subject.toLowerCase().includes(searchLower) ||
            c.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      if (filters.statusFilter !== 'All') {
        filtered = filtered.filter((c) => c.status === filters.statusFilter);
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
        }
      }

      return filtered;
    } catch (error) {
      console.error('Error filtering campaigns:', error);
      return campaigns;
    }
  }, [campaigns, filters]);

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
   * Updates date filter
   * @param {string} dateFilter - Date range to filter by
   */
  const updateDateFilter = useCallback((dateFilter: string) => {
    setFilters(prev => ({ ...prev, dateFilter }));
  }, []);

  /**
   * Clears all filters and resets to default state
   */
  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: 'All',
      dateFilter: 'All',
    });
  }, []);

  /**
   * Checks if any filters are currently active
   * @returns {boolean} - True if any filters are applied
   */
  const hasActiveFilters = useMemo(() => {
    return filters.searchTerm !== '' || 
           filters.statusFilter !== 'All' || 
           filters.dateFilter !== 'All';
  }, [filters]);

  return {
    filters,
    filteredCampaigns,
    updateSearchTerm,
    updateStatusFilter,
    updateDateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
