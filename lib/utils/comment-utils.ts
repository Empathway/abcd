import { Comment, CommentStats } from '@/types/comment';

/**
 * Validates comment reply data
 * @param {string} content - Comment content
 * @returns {string | null} - Error message if validation fails, null if valid
 */
export const validateCommentData = (content: string): string | null => {
  try {
    if (!content.trim()) {
      return "Comment content is required.";
    }

    if (content.length < 10) {
      return "Comment must be at least 10 characters long.";
    }

    if (content.length > 1000) {
      return "Comment must be less than 1000 characters.";
    }

    return null;
  } catch (error) {
    console.error('Error validating comment data:', error);
    return "Validation error occurred.";
  }
};

/**
 * Calculates statistics from comments array
 * @param {Comment[]} comments - Array of comments to analyze
 * @returns {CommentStats} - Statistics object
 */
export const calculateCommentStats = (comments: Comment[]): CommentStats => {
  try {
    const stats = comments.reduce((acc, comment) => {
      acc.total++;
      
      if (comment.isReply) {
        acc.totalReplies++;
      }
      
      switch (comment.status) {
        case 'Pending':
          acc.pending++;
          break;
        case 'Approved':
          acc.approved++;
          break;
        case 'Rejected':
          acc.rejected++;
          break;
        case 'Spam':
          acc.spam++;
          break;
      }
      
      return acc;
    }, { 
      total: 0, 
      pending: 0, 
      approved: 0, 
      rejected: 0, 
      spam: 0, 
      totalReplies: 0,
      avgResponseTime: 0
    });

    return stats;
  } catch (error) {
    console.error('Error calculating comment stats:', error);
    return { 
      total: 0, 
      pending: 0, 
      approved: 0, 
      rejected: 0, 
      spam: 0, 
      totalReplies: 0,
      avgResponseTime: 0
    };
  }
};

/**
 * Gets CSS class for comment status badge
 * @param {string} status - Comment status
 * @returns {string} - CSS class string
 */
export const getCommentStatusBadgeClass = (status: string): string => {
  const variants = {
    Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Approved: "bg-green-100 text-green-800 hover:bg-green-200",
    Rejected: "bg-red-100 text-red-800 hover:bg-red-200",
    Spam: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
};

/**
 * Truncates comment content for display
 * @param {string} content - Comment content
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated content
 */
export const truncateComment = (content: string, maxLength: number = 100): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

/**
 * Formats comment thread with proper indentation
 * @param {Comment[]} comments - Array of comments
 * @returns {Comment[]} - Flattened array with proper depth
 */
export const flattenCommentThread = (comments: Comment[]): Comment[] => {
  try {
    const flattened: Comment[] = [];
    
    const addComment = (comment: Comment, depth: number = 0) => {
      flattened.push({ ...comment, depth });
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => addComment(reply, depth + 1));
      }
    };
    
    comments.forEach(comment => {
      if (!comment.parentId) { // Top-level comments only
        addComment(comment);
      }
    });
    
    return flattened;
  } catch (error) {
    console.error('Error flattening comment thread:', error);
    return comments;
  }
};

/**
 * Groups comments by blog post
 * @param {Comment[]} comments - Array of comments
 * @returns {Record<string, Comment[]>} - Comments grouped by blog post ID
 */
export const groupCommentsByPost = (comments: Comment[]): Record<string, Comment[]> => {
  try {
    return comments.reduce((groups, comment) => {
      if (!groups[comment.blogPostId]) {
        groups[comment.blogPostId] = [];
      }
      groups[comment.blogPostId].push(comment);
      return groups;
    }, {} as Record<string, Comment[]>);
  } catch (error) {
    console.error('Error grouping comments by post:', error);
    return {};
  }
};

/**
 * Generates comment CSV export content
 * @param {Comment[]} comments - Array of comments to export
 * @returns {string} - CSV formatted string
 */
export const generateCommentCsvContent = (comments: Comment[]): string => {
  try {
    const headers = [
      "Blog Post", "Author Name", "Author Email", "Content", "Status", 
      "Created Date", "Is Reply", "Depth", "Parent Comment"
    ];
    
    const rows = comments.map(c => [
      c.blogPostTitle,
      c.authorName,
      c.authorEmail,
      c.content.replace(/\n/g, ' ').replace(/"/g, '""'),
      c.status,
      c.createdDate,
      c.isReply ? 'Yes' : 'No',
      c.depth.toString(),
      c.parentId || ''
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
  } catch (error) {
    console.error('Error generating comment CSV content:', error);
    throw new Error('Failed to generate CSV content');
  }
};

/**
 * Gets current date in ISO format
 * @returns {string} - Current date string
 */
export const getCurrentDate = (): string => {
  try {
    return new Date().toISOString().split("T")[0];
  } catch (error) {
    console.error('Error getting current date:', error);
    return '';
  }
};

/**
 * Downloads CSV file to user's device
 * @param {string} content - CSV content to download
 * @param {string} filename - Name of the file to download
 */
export const downloadCsvFile = (content: string, filename: string): void => {
  try {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV file:', error);
    throw new Error('Failed to download CSV file');
  }
};
