import { useState, useCallback } from 'react';
import { Comment } from '@/types/comment';

/**
 * Custom hook for managing comment selection state
 * @returns {object} - Object containing selection state and management functions
 */
export const useCommentSelection = () => {
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());

  /**
   * Toggles selection state for a single comment
   * @param {string} id - ID of comment to toggle
   */
  const toggleCommentSelection = useCallback((id: string) => {
    setSelectedComments((prev) => {
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
   * Toggles selection for all visible comments
   * @param {Comment[]} visibleComments - Array of currently visible comments
   */
  const toggleSelectAll = useCallback((visibleComments: Comment[]) => {
    const visibleIds = visibleComments.map(c => c.id);
    const allSelected = visibleIds.length > 0 && 
                       visibleIds.every(id => selectedComments.has(id));

    if (allSelected) {
      setSelectedComments(prev => {
        const newSet = new Set(prev);
        visibleIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    } else {
      setSelectedComments(prev => {
        const newSet = new Set(prev);
        visibleIds.forEach(id => newSet.add(id));
        return newSet;
      });
    }
  }, [selectedComments]);

  /**
   * Clears all selected comments
   */
  const clearSelection = useCallback(() => {
    setSelectedComments(new Set());
  }, []);

  /**
   * Checks if all visible comments are selected
   * @param {Comment[]} visibleComments - Array of currently visible comments
   * @returns {boolean} - True if all visible comments are selected
   */
  const areAllSelected = useCallback((visibleComments: Comment[]): boolean => {
    if (visibleComments.length === 0) return false;
    return visibleComments.every(comment => selectedComments.has(comment.id));
  }, [selectedComments]);

  return {
    selectedComments,
    toggleCommentSelection,
    toggleSelectAll,
    clearSelection,
    areAllSelected,
  };
};
