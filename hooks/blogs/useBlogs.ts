import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { BlogPost, BlogFormData } from '@/types/blog';
import { 
  validateBlogData, 
  generateSlug, 
  calculateReadTime, 
  getCurrentDate 
} from '@/lib/utils/blog-utils';

/**
 * Custom hook for managing blog posts CRUD operations
 * @param {BlogPost[]} initialData - Initial array of blog posts
 * @returns {object} - Object containing posts state and management functions
 */
export const useBlogs = (initialData: BlogPost[]) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Creates a new blog post
   * @param {BlogFormData} formData - Form data for new post
   * @returns {Promise<boolean>} - Promise that resolves to true if successful
   */
  const createPost = useCallback(async (formData: BlogFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const validationError = validateBlogData(
        formData.title,
        formData.content,
        formData.excerpt,
        posts
      );

      if (validationError) {
        throw new Error(validationError);
      }

      const now = getCurrentDate();
      const newPost: BlogPost = {
        id: (posts.length + 1).toString(),
        title: formData.title.trim(),
        slug: generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt.trim(),
        status: formData.status,
        authorId: "current-user-id",
        authorName: "Current User",
        createdDate: now,
        lastModified: now,
        publishedDate: formData.status === 'Published' ? now : undefined,
        scheduledDate: formData.scheduledDate,
        featuredImage: formData.featuredImage,
        readTime: calculateReadTime(formData.content),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        tags: formData.tags,
        categories: formData.categories,
        seoTitle: formData.seoTitle,
        metaDescription: formData.metaDescription,
        isPrivate: formData.isPrivate,
        isFeatured: formData.isFeatured,
      };

      setPosts(prev => [newPost, ...prev]);
      toast.success("Blog post created successfully");
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [posts]);

  /**
   * Updates an existing blog post
   * @param {string} id - ID of post to update
   * @param {BlogFormData} formData - Updated form data
   * @returns {Promise<boolean>} - Promise that resolves to true if successful
   */
  const updatePost = useCallback(async (id: string, formData: BlogFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const validationError = validateBlogData(
        formData.title,
        formData.content,
        formData.excerpt,
        posts,
        id
      );

      if (validationError) {
        throw new Error(validationError);
      }

      setPosts(prev => prev.map(post =>
        post.id === id
          ? {
              ...post,
              title: formData.title.trim(),
              slug: generateSlug(formData.title),
              content: formData.content,
              excerpt: formData.excerpt.trim(),
              status: formData.status,
              lastModified: getCurrentDate(),
              publishedDate: formData.status === 'Published' && !post.publishedDate ? getCurrentDate() : post.publishedDate,
              scheduledDate: formData.scheduledDate,
              featuredImage: formData.featuredImage,
              readTime: calculateReadTime(formData.content),
              tags: formData.tags,
              categories: formData.categories,
              seoTitle: formData.seoTitle,
              metaDescription: formData.metaDescription,
              isPrivate: formData.isPrivate,
              isFeatured: formData.isFeatured,
            }
          : post
      ));

      toast.success("Blog post updated successfully");
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [posts]);

  /**
   * Duplicates an existing blog post
   * @param {string} id - ID of post to duplicate
   * @returns {Promise<void>} - Promise that resolves when duplication is complete
   */
  const duplicatePost = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const post = posts.find(p => p.id === id);
      if (!post) {
        throw new Error('Post not found');
      }

      const now = getCurrentDate();
      const duplicatedPost: BlogPost = {
        ...post,
        id: (posts.length + 1).toString(),
        title: `${post.title} (Copy)`,
        slug: generateSlug(`${post.title} (Copy)`),
        status: "Draft",
        createdDate: now,
        lastModified: now,
        publishedDate: undefined,
        scheduledDate: undefined,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
      };

      setPosts(prev => [duplicatedPost, ...prev]);
      toast.success("Blog post duplicated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [posts]);

  /**
   * Publishes a draft post
   * @param {string} id - ID of post to publish
   * @returns {Promise<void>} - Promise that resolves when publishing is complete
   */
  const publishPost = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      setPosts(prev => prev.map(post =>
        post.id === id
          ? {
              ...post,
              status: "Published" as const,
              publishedDate: getCurrentDate(),
              lastModified: getCurrentDate(),
            }
          : post
      ));

      toast.success("Post published successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Archives a blog post
   * @param {string} id - ID of post to archive
   * @returns {Promise<void>} - Promise that resolves when archiving is complete
   */
  const archivePost = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      setPosts(prev => prev.map(post =>
        post.id === id
          ? {
              ...post,
              status: "Archived" as const,
              lastModified: getCurrentDate(),
            }
          : post
      ));

      toast.success("Post archived successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Deletes a blog post
   * @param {string} id - ID of post to delete
   * @returns {Promise<void>} - Promise that resolves when deletion is complete
   */
  const deletePost = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    posts,
    isLoading,
    error,
    createPost,
    updatePost,
    duplicatePost,
    publishPost,
    archivePost,
    deletePost,
  };
};
