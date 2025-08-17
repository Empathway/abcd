import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Comment, CommentFormData } from '@/types/comment';
import { validateCommentData, getCurrentDate } from '@/lib/utils/comment-utils';

/**
 * Custom hook for managing comments CRUD operations
 * @param {Comment[]} initialData - Initial array of comments
 * @returns {object} - Object containing comments state and management functions
 */
export const useComments = (initialData: Comment[]) => {
  const [comments, setComments] = useState<Comment[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Adds a reply to a comment
   * @param {string} parentId - ID of parent comment
   * @param {CommentFormData} formData - Form data for reply
   * @returns {Promise<boolean>} - Promise that resolves to true if successful
   */
  const addReply = useCallback(async (parentId: string, formData: CommentFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const validationError = validateCommentData(formData.content);
      if (validationError) {
        throw new Error(validationError);
      }

      const parentComment = comments.find(c => c.id === parentId);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }

      const newReply: Comment = {
        id: (comments.length + 1).toString(),
        blogPostId: parentComment.blogPostId,
        blogPostTitle: parentComment.blogPostTitle,
        authorName: formData.authorName || "Admin",
        authorEmail: formData.authorEmail || "admin@example.com",
        content: formData.content.trim(),
        status: formData.status,
        createdDate: getCurrentDate(),
        parentId: parentId,
        isReply: true,
        depth: parentComment.depth + 1,
      };

      setComments(prev => [...prev, newReply]);
      toast.success("Reply added successfully");
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add reply';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [comments]);

  /**
   * Updates comment status
   * @param {string} id - ID of comment to update
   * @param {string} status - New status
   * @returns {Promise<void>} - Promise that resolves when update is complete
   */
  const updateCommentStatus = useCallback(async (id: string, status: Comment['status']): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      setComments(prev => prev.map(comment =>
        comment.id === id
          ? { ...comment, status }
          : comment
      ));

      const statusText = status.toLowerCase();
      toast.success(`Comment ${statusText} successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update comment';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Deletes a comment
   * @param {string} id - ID of comment to delete
   * @returns {Promise<void>} - Promise that resolves when deletion is complete
   */
  const deleteComment = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Also delete all replies to this comment
      setComments(prev => prev.filter(c => c.id !== id && c.parentId !== id));
      toast.success("Comment deleted successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete comment';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Bulk updates comment statuses
   * @param {Set<string>} ids - Set of comment IDs
   * @param {string} status - New status
   * @returns {Promise<void>} - Promise that resolves when update is complete
   */
  const bulkUpdateStatus = useCallback(async (ids: Set<string>, status: Comment['status']): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (ids.size === 0) {
        throw new Error("No comments selected.");
      }

      setComments(prev => prev.map(comment =>
        ids.has(comment.id)
          ? { ...comment, status }
          : comment
      ));

      const statusText = status.toLowerCase();
      toast.success(`${ids.size} comment${ids.size > 1 ? 's' : ''} ${statusText} successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update comments';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    comments,
    isLoading,
    error,
    addReply,
    updateCommentStatus,
    deleteComment,
    bulkUpdateStatus,
  };
};
