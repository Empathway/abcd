import { BlogPost, BlogStats } from '@/types/blog';

/**
 * Validates blog post form data
 * @param {string} title - Blog post title
 * @param {string} content - Blog post content
 * @param {string} excerpt - Blog post excerpt
 * @param {BlogPost[]} existingPosts - Array of existing posts
 * @param {string} excludeId - ID to exclude from duplicate check
 * @returns {string | null} - Error message if validation fails, null if valid
 */
export const validateBlogData = (
  title: string,
  content: string,
  excerpt: string,
  existingPosts: BlogPost[],
  excludeId?: string
): string | null => {
  try {
    if (!title.trim()) {
      return "Blog title is required.";
    }

    if (!content.trim()) {
      return "Blog content is required.";
    }

    if (!excerpt.trim()) {
      return "Blog excerpt is required.";
    }

    if (title.length < 10) {
      return "Title must be at least 10 characters long.";
    }

    if (excerpt.length < 50) {
      return "Excerpt must be at least 50 characters long.";
    }

    const titleExists = existingPosts.some(
      p => p.title.toLowerCase() === title.toLowerCase() && p.id !== excludeId
    );

    if (titleExists) {
      return "A blog post with this title already exists.";
    }

    return null;
  } catch (error) {
    console.error('Error validating blog data:', error);
    return "Validation error occurred.";
  }
};

/**
 * Generates a URL-friendly slug from title
 * @param {string} title - Blog post title
 * @returns {string} - URL slug
 */
export const generateSlug = (title: string): string => {
  try {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  } catch (error) {
    console.error('Error generating slug:', error);
    return 'untitled-post';
  }
};

/**
 * Calculates estimated reading time based on content
 * @param {string} content - Blog post content
 * @returns {number} - Estimated reading time in minutes
 */
export const calculateReadTime = (content: string): number => {
  try {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / wordsPerMinute);
    return readTime < 1 ? 1 : readTime;
  } catch (error) {
    console.error('Error calculating read time:', error);
    return 1;
  }
};

/**
 * Calculates statistics from blog posts array
 * @param {BlogPost[]} posts - Array of blog posts to analyze
 * @returns {BlogStats} - Statistics object
 */
export const calculateBlogStats = (posts: BlogPost[]): BlogStats => {
  try {
    const stats = posts.reduce((acc, post) => {
      acc.total++;
      acc.totalViews += post.viewCount;
      acc.totalLikes += post.likeCount;
      
      switch (post.status) {
        case 'Published':
          acc.published++;
          break;
        case 'Draft':
          acc.draft++;
          break;
        case 'Scheduled':
          acc.scheduled++;
          break;
        case 'Archived':
          acc.archived++;
          break;
      }
      
      return acc;
    }, { 
      total: 0, 
      published: 0, 
      draft: 0, 
      scheduled: 0, 
      archived: 0, 
      totalViews: 0,
      totalLikes: 0,
      avgReadTime: 0
    });

    if (posts.length > 0) {
      const totalReadTime = posts.reduce((sum, post) => sum + post.readTime, 0);
      stats.avgReadTime = Math.round(totalReadTime / posts.length);
    }

    return stats;
  } catch (error) {
    console.error('Error calculating blog stats:', error);
    return { 
      total: 0, 
      published: 0, 
      draft: 0, 
      scheduled: 0, 
      archived: 0, 
      totalViews: 0,
      totalLikes: 0,
      avgReadTime: 0
    };
  }
};

/**
 * Gets CSS class for blog status badge
 * @param {string} status - Blog post status
 * @returns {string} - CSS class string
 */
export const getBlogStatusBadgeClass = (status: string): string => {
  const variants = {
    Draft: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    Published: "bg-green-100 text-green-800 hover:bg-green-200",
    Scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Archived: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  };
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
};

/**
 * Formats large numbers for display
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

/**
 * Truncates text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Generates blog CSV export content
 * @param {BlogPost[]} posts - Array of posts to export
 * @returns {string} - CSV formatted string
 */
export const generateBlogCsvContent = (posts: BlogPost[]): string => {
  try {
    const headers = [
      "Title", "Status", "Author", "Created Date", "Published Date", 
      "Views", "Likes", "Comments", "Read Time", "Categories", "Tags"
    ];
    
    const rows = posts.map(p => [
      p.title,
      p.status,
      p.authorName,
      p.createdDate,
      p.publishedDate || '',
      p.viewCount.toString(),
      p.likeCount.toString(),
      p.commentCount.toString(),
      `${p.readTime} min`,
      p.categories.join('; '),
      p.tags.join('; ')
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
  } catch (error) {
    console.error('Error generating blog CSV content:', error);
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
