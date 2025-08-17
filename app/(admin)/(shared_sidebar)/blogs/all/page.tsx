"use client";

//TODO: Add unarchive functionality lmao

import React from "react";
import { 
  Search,
  Plus,
  Download,
  Filter,
  X
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Types
import { BlogPost } from '@/types/blog';

// Hooks
import { useBlogs } from '@/hooks/blogs/useBlogs';
import { useBlogFilters } from '@/hooks/blogs/useBlogFilters';
import { usePagination } from '@/hooks/usePagination';
import { useBlogHandlers } from '@/hooks/blogs/useBlogHandlers';

// Utils
import { calculateBlogStats, formatNumber } from '@/lib/utils/blog-utils';

// Components
import { BlogForm } from '@/components/blog/BlogForm';
import { BlogGrid } from '@/components/blog/BlogGrid';

// Mock blog data
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with React Server Components",
    slug: "getting-started-react-server-components",
    content: "React Server Components represent a fundamental shift in how we think about React applications...",
    excerpt: "Learn how React Server Components can improve your app's performance and user experience with this comprehensive guide.",
    status: "Published",
    authorId: "user-1",
    authorName: "John Doe",
    createdDate: "2025-08-01",
    publishedDate: "2025-08-01",
    lastModified: "2025-08-05",
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    readTime: 8,
    viewCount: 1250,
    likeCount: 89,
    commentCount: 23,
    tags: ["React", "Server Components", "Performance"],
    categories: ["Technology", "Tutorial"],
    seoTitle: "React Server Components: Complete Guide for Developers",
    metaDescription: "Master React Server Components with our comprehensive tutorial. Learn best practices, implementation details, and performance benefits.",
    isPrivate: false,
    isFeatured: true
  },
  {
    id: "2",
    title: "Building Scalable APIs with Node.js and TypeScript",
    slug: "building-scalable-apis-nodejs-typescript",
    content: "Creating robust, maintainable APIs is crucial for modern web applications...",
    excerpt: "Discover best practices for building enterprise-grade APIs using Node.js and TypeScript with real-world examples.",
    status: "Published",
    authorId: "user-1",
    authorName: "John Doe",
    createdDate: "2025-07-28",
    publishedDate: "2025-07-28",
    lastModified: "2025-07-30",
    readTime: 12,
    viewCount: 890,
    likeCount: 67,
    commentCount: 15,
    tags: ["Node.js", "TypeScript", "API", "Backend"],
    categories: ["Technology", "Programming"],
    isPrivate: false,
    isFeatured: false
  },
  {
    id: "3",
    title: "The Future of Web Development in 2025",
    slug: "future-web-development-2025",
    content: "As we move through 2025, the web development landscape continues to evolve rapidly...",
    excerpt: "Explore emerging trends, technologies, and best practices that will shape web development in the coming years.",
    status: "Draft",
    authorId: "user-1",
    authorName: "John Doe",
    createdDate: "2025-08-12",
    lastModified: "2025-08-14",
    readTime: 6,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    tags: ["Web Development", "Trends", "Future", "Technology"],
    categories: ["Technology", "Opinion"],
    isPrivate: false,
    isFeatured: false
  },
  {
    id: "4",
    title: "Advanced CSS Grid Techniques",
    slug: "advanced-css-grid-techniques",
    content: "CSS Grid has revolutionized how we approach layout design on the web...",
    excerpt: "Master advanced CSS Grid techniques with practical examples and learn how to create complex layouts effortlessly.",
    status: "Scheduled",
    authorId: "user-1",
    authorName: "John Doe",
    createdDate: "2025-08-10",
    scheduledDate: "2025-08-20T09:00",
    lastModified: "2025-08-13",
    readTime: 10,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    tags: ["CSS", "Grid", "Layout", "Design"],
    categories: ["Design", "Tutorial"],
    isPrivate: false,
    isFeatured: false
  }
];

/**
 * Compact main component for managing user's blog posts
 * @returns {React.ReactElement} - MyBlogPosts component
 */
export default function MyBlogPosts(): React.ReactElement {
  // Initialize all hooks
  const blogManager = useBlogs(mockPosts);
  const filterManager = useBlogFilters(blogManager.posts);
  const paginationManager = usePagination(12);

  // Get all handlers (updated to remove table view)
  const handlers = useBlogHandlers({
    blogManager,
    filterManager,
    paginationManager,
  });

  // Derived data
  const stats = calculateBlogStats(blogManager.posts);
  const pagination = paginationManager.paginationState(filterManager.filteredPosts.length);
  const paginatedPosts = paginationManager.getPaginatedItems(filterManager.filteredPosts);

  // Get unique categories for filter
  const availableCategories = Array.from(
    new Set(blogManager.posts.flatMap(p => p.categories))
  ).sort();

  return (
    <div className="w-full max-w-none px-4 py-6 space-y-6">
      {/* Compact Header with Inline Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">My Blog Posts</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{stats.total} total</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{stats.published} published</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{stats.draft} drafts</span>
              {stats.scheduled > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{stats.scheduled} scheduled</span>
                </>
              )}
              {stats.archived > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{stats.archived} archived</span>
                </>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">
            Create, manage, and track your blog content
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handlers.setShowCreateDialog(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Compact Search and Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search posts..."
            value={filterManager.filters.searchTerm}
            onChange={(e) => handlers.handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filters Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filters:</span>
          </div>
          
          <Select value={filterManager.filters.statusFilter} onValueChange={handlers.handleStatusFilterChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterManager.filters.categoryFilter} onValueChange={handlers.handleCategoryFilterChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterManager.filters.featuredFilter} onValueChange={handlers.handleFeaturedFilterChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Posts</SelectItem>
              <SelectItem value="Featured">Featured</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterManager.filters.dateFilter} onValueChange={handlers.handleDateFilterChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Dates</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="This Year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {filterManager.hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlers.handleClearFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear ({Object.values(filterManager.filters).filter(v => v !== 'All' && v !== '').length})
            </Button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="text-sm text-muted-foreground">
          Showing {filterManager.filteredPosts.length} 
          {filterManager.filteredPosts.length !== blogManager.posts.length && 
            ` of ${blogManager.posts.length}`} posts
        </div>
        <div className="text-xs text-muted-foreground">
          Grid view
        </div>
      </div>

      {/* Content Grid */}
      <div className="min-h-[400px]">
        <BlogGrid
          posts={paginatedPosts}
          onEdit={handlers.handleEditPost}
          onDuplicate={blogManager.duplicatePost}
          onPublish={blogManager.publishPost}
          onArchive={blogManager.archivePost}
          onDelete={blogManager.deletePost}
          onPreview={handlers.handlePreviewPost}
        />
      </div>

      {/* Compact Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages} 
            ({((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems})
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginationManager.previousPage()}
              disabled={pagination.currentPage === 1}
              className="h-8"
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {paginationManager.getVisiblePages(pagination.totalPages).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pagination.currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8"
                  onClick={() => paginationManager.goToPage(pageNum, pagination.totalPages)}
                >
                  {pageNum}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginationManager.nextPage(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <BlogForm
        open={handlers.showCreateDialog}
        onOpenChange={handlers.setShowCreateDialog}
        title="Create New Blog Post"
        description="Write and publish a new blog post to share with your audience."
        formData={handlers.formData}
        onFormDataChange={handlers.updateFormData}
        onSubmit={handlers.handleCreatePost}
        onCancel={() => {
          handlers.setShowCreateDialog(false);
          handlers.resetForm();
        }}
        isLoading={blogManager.isLoading}
        submitText="Create Post"
      />

      <BlogForm
        open={handlers.showEditDialog}
        onOpenChange={handlers.setShowEditDialog}
        title="Edit Blog Post"
        description="Update your blog post content and settings."
        formData={handlers.formData}
        onFormDataChange={handlers.updateFormData}
        onSubmit={handlers.handleUpdatePost}
        onCancel={() => {
          handlers.setShowEditDialog(false);
          handlers.resetForm();
        }}
        isLoading={blogManager.isLoading}
        submitText="Update Post"
      />
    </div>
  );
}
