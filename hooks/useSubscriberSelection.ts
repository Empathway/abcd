import { useState, useCallback } from 'react';
import { Subscriber } from '../types/subscriber';

/**
 * Custom hook for managing subscriber selection state
 * @returns {object} - Object containing selection state and management functions
 */
export const useSubscriberSelection = () => {
  const [selectedSubscribers, setSelectedSubscribers] = useState<Set<string>>(new Set());

  /**
   * Toggles selection state for a single subscriber
   * @param {string} id - ID of subscriber to toggle
   */
  const toggleSubscriberSelection = useCallback((id: string) => {
    setSelectedSubscribers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  /**
   * Toggles selection for all visible subscribers
   * @param {Subscriber[]} visibleSubscribers - Array of currently visible subscribers
   */
  const toggleSelectAll = useCallback((visibleSubscribers: Subscriber[]) => {
    const visibleIds = visibleSubscribers.map(s => s.id);
    const allSelected = visibleIds.length > 0 && 
                       visibleIds.every(id => selectedSubscribers.has(id));

    if (allSelected) {
      setSelectedSubscribers(prev => {
        const newSet = new Set(prev);
        visibleIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    } else {
      setSelectedSubscribers(prev => {
        const newSet = new Set(prev);
        visibleIds.forEach(id => newSet.add(id));
        return newSet;
      });
    }
  }, [selectedSubscribers]);

  /**
   * Clears all selected subscribers
   */
  const clearSelection = useCallback(() => {
    setSelectedSubscribers(new Set());
  }, []);

  /**
   * Checks if all visible subscribers are selected
   * @param {Subscriber[]} visibleSubscribers - Array of currently visible subscribers
   * @returns {boolean} - True if all visible subscribers are selected
   */
  const areAllSelected = useCallback((visibleSubscribers: Subscriber[]): boolean => {
    if (visibleSubscribers.length === 0) return false;
    return visibleSubscribers.every(subscriber => selectedSubscribers.has(subscriber.id));
  }, [selectedSubscribers]);

  return {
    selectedSubscribers,
    toggleSubscriberSelection,
    toggleSelectAll,
    clearSelection,
    areAllSelected,
  };
};
