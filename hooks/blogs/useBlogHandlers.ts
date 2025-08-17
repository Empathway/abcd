import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { BlogPost, BlogFormData } from '@/types/blog';
import { 
  generateBlogCsvContent,
  downloadCsvFile,
  getCurrentDate
} from '@/lib/utils/blog-utils';

/**
 * Custom hook for all blog-related handlers (Grid view only)
 * @param {Object} managers - Object containing all manager hooks
 * @returns {Object} - Object containing all handler functions and form state
 */
export const useBlogHandlers = (managers: {
  blogManager: any;
  filterManager: any;
  paginationManager: any;
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    excerpt: "",
    status: "Draft",
    tags: [],
    categories: [],
    isPrivate: false,
    isFeatured: false
  });

  /**
   * Updates form data with partial updates
   * @param {Partial<BlogFormData>} updates - Partial form data to update
   */
  const updateFormData = useCallback((updates: Partial<BlogFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Resets form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      status: "Draft",
      tags: [],
      categories: [],
      isPrivate: false,
      isFeatured: false
    });
  }, []);

  /**
   * Handles search change with pagination reset
   * @param {string} value - Search term value
   */
  const handleSearchChange = useCallback((value: string) => {
    managers.filterManager.updateSearchTerm(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles status filter change with pagination reset
   * @param {string} value - Status filter value
   */
  const handleStatusFilterChange = useCallback((value: string) => {
    managers.filterManager.updateStatusFilter(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles category filter change with pagination reset
   * @param {string} value - Category filter value
   */
  const handleCategoryFilterChange = useCallback((value: string) => {
    managers.filterManager.updateCategoryFilter(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles date filter change with pagination reset
   * @param {string} value - Date filter value
   */
  const handleDateFilterChange = useCallback((value: string) => {
    managers.filterManager.updateDateFilter(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles featured filter change with pagination reset
   * @param {string} value - Featured filter value
   */
  const handleFeaturedFilterChange = useCallback((value: string) => {
    managers.filterManager.updateFeaturedFilter(value);
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
  }, [managers]);

  /**
   * Handles clearing all filters
   */
  const handleClearFilters = useCallback(() => {
    managers.filterManager.clearFilters();
    if (managers.paginationManager.currentPage !== 1) {
      managers.paginationManager.resetPagination();
    }
    toast.success("Filters cleared");
  }, [managers]);

  /**
   * Handles creating a new blog post
   */
  const handleCreatePost = useCallback(async () => {
    try {
      const success = await managers.blogManager.createPost(formData);
      if (success) {
        setShowCreateDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }, [formData, managers.blogManager, resetForm]);

  /**
   * Handles editing a blog post
   * @param {BlogPost} post - Blog post to edit
   */
  const handleEditPost = useCallback((post: BlogPost) => {
    try {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        scheduledDate: post.scheduledDate,
        featuredImage: post.featuredImage,
        tags: post.tags,
        categories: post.categories,
        seoTitle: post.seoTitle,
        metaDescription: post.metaDescription,
        isPrivate: post.isPrivate,
        isFeatured: post.isFeatured
      });
      setShowEditDialog(true);
    } catch (error) {
      console.error('Error preparing post for edit:', error);
      toast.error('Failed to prepare post for editing');
    }
  }, []);

  /**
   * Handles updating a blog post
   */
  const handleUpdatePost = useCallback(async () => {
    try {
      if (!editingPost) return;
      
      const success = await managers.blogManager.updatePost(editingPost.id, formData);
      if (success) {
        setShowEditDialog(false);
        setEditingPost(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }, [editingPost, formData, managers.blogManager, resetForm]);

  /**
   * Handles exporting blog posts to CSV
   */
  const handleExportPosts = useCallback(() => {
    try {
      if (managers.filterManager.filteredPosts.length === 0) {
        toast.error("No blog posts to export.");
        return;
      }

      const csvContent = generateBlogCsvContent(managers.filterManager.filteredPosts);
      const filename = `blog-posts-${getCurrentDate()}.csv`;
      
      downloadCsvFile(csvContent, filename);
      toast.success(`${managers.filterManager.filteredPosts.length} blog posts exported successfully`);
    } catch (error) {
      console.error('Error exporting blog posts:', error);
      toast.error('Failed to export blog posts');
    }
  }, [managers.filterManager.filteredPosts]);

  /**
   * Handles post preview
   * @param {BlogPost} post - Post to preview
   */
  const handlePreviewPost = useCallback((post: BlogPost) => {
    console.log('Preview post:', post);
    toast.info('Preview functionality would open here');
  }, []);

  return {
    // State
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    editingPost,
    formData,

    // Form handlers
    updateFormData,
    resetForm,

    // Filter handlers
    handleSearchChange,
    handleStatusFilterChange,
    handleCategoryFilterChange,
    handleDateFilterChange,
    handleFeaturedFilterChange,
    handleClearFilters,

    // CRUD handlers
    handleCreatePost,
    handleEditPost,
    handleUpdatePost,
    handleExportPosts,
    handlePreviewPost,
  };
};
