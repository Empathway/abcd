"use client";

import React from "react";
import { 
  Search,
  Download,
  Filter,
  X,
  Check,
  MessageCircle
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
import { Separator } from "@/components/ui/separator";

// Types
import { Comment, BlogPostOption } from '@/types/comment';

// Hooks
import { useComments } from '@/hooks/comments/useComments';
import { useCommentFilters } from '@/hooks/comments/useCommentFilters';
import { useCommentSelection } from '@/hooks/comments/useCommentSelection';
import { usePagination } from '@/hooks/usePagination';
import { useCommentHandlers } from '@/hooks/comments/useCommentHandlers';

// Utils
import { calculateCommentStats } from '@/lib/utils/comment-utils';

// Components
import { CommentList } from '@/components/comment/CommentList';

// Rich fake data for testing
const mockComments: Comment[] = [
  {
    id: "1",
    blogPostId: "1",
    blogPostTitle: "Getting Started with React Server Components",
    authorName: "Alice Johnson",
    authorEmail: "alice.johnson@example.com",
    authorWebsite: "https://alicedev.com",
    content: "This is an absolutely fantastic tutorial! I've been struggling with React Server Components for weeks, and this post finally made everything click. The examples are clear and the explanations are thorough. Thank you so much for taking the time to write this detailed guide. It's exactly what the React community needed.",
    status: "Approved",
    createdDate: "2025-08-10",
    isReply: false,
    depth: 0,
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
  },
  {
    id: "2",
    blogPostId: "1",
    blogPostTitle: "Getting Started with React Server Components",
    authorName: "Admin",
    authorEmail: "admin@myblog.com",
    content: "Thank you so much Alice! I'm really glad the tutorial helped you understand RSC better. That was exactly my goal - to make this complex topic more accessible. If you have any specific questions about implementing RSC in your projects, feel free to ask!",
    status: "Approved",
    createdDate: "2025-08-10",
    parentId: "1",
    isReply: true,
    depth: 1
  },
  {
    id: "3",
    blogPostId: "1",
    blogPostTitle: "Getting Started with React Server Components",
    authorName: "Alice Johnson",
    authorEmail: "alice.johnson@example.com",
    content: "Actually, I do have a question! How do you handle data fetching in nested server components? Is there a performance impact when you have multiple levels of nesting?",
    status: "Approved",
    createdDate: "2025-08-11",
    parentId: "1",
    isReply: true,
    depth: 1
  },
  {
    id: "4",
    blogPostId: "2",
    blogPostTitle: "Building Scalable APIs with Node.js and TypeScript",
    authorName: "Bob Smith",
    authorEmail: "bob.smith@techcorp.com",
    authorWebsite: "https://bobdev.io",
    content: "Great article! I'm particularly interested in your approach to error handling. We're using a similar setup at my company, but I'm curious about your thoughts on using Prisma vs raw SQL for complex queries. Do you have any performance benchmarks?",
    status: "Pending",
    createdDate: "2025-08-12",
    isReply: false,
    depth: 0
  },
  {
    id: "5",
    blogPostId: "3",
    blogPostTitle: "The Future of Web Development in 2025",
    authorName: "Charlie Brown",
    authorEmail: "charlie@webagency.com",
    content: "I have mixed feelings about some of your predictions. While I agree that AI will play a bigger role, I think you're underestimating the impact of WebAssembly. WASM is already changing the game for performance-critical applications, and I expect it to become mainstream much faster than you suggest.",
    status: "Approved",
    createdDate: "2025-08-14",
    isReply: false,
    depth: 0
  },
  {
    id: "6",
    blogPostId: "3",
    blogPostTitle: "The Future of Web Development in 2025",
    authorName: "Admin",
    authorEmail: "admin@myblog.com",
    content: "That's a really interesting point Charlie! You might be right about WebAssembly adoption happening faster. I was being conservative in my timeline, but the recent developments in WASM tooling have been impressive. What specific use cases are you seeing WASM being adopted for at your agency?",
    status: "Approved",
    createdDate: "2025-08-14",
    parentId: "5",
    isReply: true,
    depth: 1
  },
  {
    id: "7",
    blogPostId: "4",
    blogPostTitle: "Advanced CSS Grid Techniques",
    authorName: "Diana Prince",
    authorEmail: "diana.prince@spamsite.com",
    content: "This is great but have you tried our AMAZING CSS framework that does everything automatically? Visit css-magic-framework.sketchy-site.com for 50% off! Limited time offer!!!",
    status: "Spam",
    createdDate: "2025-08-13",
    isReply: false,
    depth: 0
  },
  {
    id: "8",
    blogPostId: "4",
    blogPostTitle: "Advanced CSS Grid Techniques",
    authorName: "Eva Martinez",
    authorEmail: "eva.martinez@designer.com",
    content: "Love this deep dive into CSS Grid! The subgrid examples are particularly helpful. I've been waiting for better subgrid support in browsers, and your workarounds for older browsers are genius. Bookmarking this for reference.",
    status: "Approved",
    createdDate: "2025-08-15",
    isReply: false,
    depth: 0
  },
  {
    id: "9",
    blogPostId: "2",
    blogPostTitle: "Building Scalable APIs with Node.js and TypeScript",
    authorName: "Frank Wilson",
    authorEmail: "frank.w@startup.io",
    content: "This architecture looks solid, but I'm concerned about the complexity for smaller teams. Do you have any recommendations for a more lightweight approach for startups with limited resources?",
    status: "Pending",
    createdDate: "2025-08-15",
    isReply: false,
    depth: 0
  },
  {
    id: "10",
    blogPostId: "1",
    blogPostTitle: "Getting Started with React Server Components",
    authorName: "Grace Lee",
    authorEmail: "grace.lee@frontend.dev",
    content: "I'm having trouble with hydration errors when using RSC. Any tips for debugging these issues? The error messages aren't always clear about what's causing the mismatch.",
    status: "Pending",
    createdDate: "2025-08-15",
    isReply: false,
    depth: 0
  },
  {
    id: "11",
    blogPostId: "3",
    blogPostTitle: "The Future of Web Development in 2025",
    authorName: "Henry Davis",
    authorEmail: "henry.davis@rejected.com",
    content: "This article is completely wrong and the author clearly doesn't know what they're talking about. Web development peaked in 2010 and everything since then has been unnecessary complexity.",
    status: "Rejected",
    createdDate: "2025-08-13",
    isReply: false,
    depth: 0
  },
  {
    id: "12",
    blogPostId: "4",
    blogPostTitle: "Advanced CSS Grid Techniques",
    authorName: "Isabel Rodriguez",
    authorEmail: "isabel@uxdesign.studio",
    content: "The accessibility considerations section is incredibly valuable! Too many CSS Grid tutorials ignore screen reader compatibility. Thank you for including those ARIA examples.",
    status: "Approved",
    createdDate: "2025-08-14",
    isReply: false,
    depth: 0
  },
  {
    id: "13",
    blogPostId: "4",
    blogPostTitle: "Advanced CSS Grid Techniques",
    authorName: "Admin",
    authorEmail: "admin@myblog.com",
    content: "Thanks Isabel! Accessibility is often overlooked in CSS tutorials, so I'm glad you found that section helpful. I'm planning to write a dedicated post about CSS Grid accessibility patterns soon.",
    status: "Approved",
    createdDate: "2025-08-14",
    parentId: "12",
    isReply: true,
    depth: 1
  },
  {
    id: "14",
    blogPostId: "2",
    blogPostTitle: "Building Scalable APIs with Node.js and TypeScript",
    authorName: "Jack Thompson",
    authorEmail: "jack@devtools.com",
    content: "Have you considered using GraphQL instead of REST for this architecture? I feel like it would solve some of the over-fetching issues you mentioned.",
    status: "Approved",
    createdDate: "2025-08-12",
    isReply: false,
    depth: 0
  },
  {
    id: "15",
    blogPostId: "1",
    blogPostTitle: "Getting Started with React Server Components",
    authorName: "Kate Williams",
    authorEmail: "kate.w@reactdev.com",
    content: "Question about caching: how do you handle cache invalidation with server components? Our team is struggling with stale data issues.",
    status: "Pending",
    createdDate: "2025-08-15",
    isReply: false,
    depth: 0
  }
];

const mockBlogPosts: BlogPostOption[] = [
  { id: "1", title: "Getting Started with React Server Components", commentCount: 6 },
  { id: "2", title: "Building Scalable APIs with Node.js and TypeScript", commentCount: 3 },
  { id: "3", title: "The Future of Web Development in 2025", commentCount: 3 },
  { id: "4", title: "Advanced CSS Grid Techniques", commentCount: 3 },
];

export default function AllComments(): React.ReactElement {
  // Initialize all hooks
  const commentManager = useComments(mockComments);
  const filterManager = useCommentFilters(commentManager.comments);
  const selectionManager = useCommentSelection();
  const paginationManager = usePagination(10);

  // Get all handlers
  const handlers = useCommentHandlers({
    commentManager,
    filterManager,
    selectionManager,
    paginationManager,
  });

  // Derived data
  const stats = calculateCommentStats(commentManager.comments);
  const pagination = paginationManager.paginationState(filterManager.filteredComments.length);
  const paginatedComments = paginationManager.getPaginatedItems(filterManager.filteredComments) as Comment[];

  return (
    <div className="w-full max-w-none px-4 py-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Comments</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{stats.total} total</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{stats.pending} pending</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{stats.approved} approved</span>
              {stats.rejected > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{stats.rejected} rejected</span>
                </>
              )}
              {stats.spam > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{stats.spam} spam</span>
                </>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">
            Manage comments from your blog posts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlers.handleExportComments} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search comments..."
            value={filterManager.filters.searchTerm}
            onChange={(e) => handlers.handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Spam">Spam</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterManager.filters.blogPostFilter} onValueChange={handlers.handleBlogPostFilterChange}>
            <SelectTrigger className="w-[200px] h-8">
              <SelectValue placeholder="Blog Post" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Blog Posts</SelectItem>
              {mockBlogPosts.map((post) => (
                <SelectItem key={post.id} value={post.id}>
                  {post.title} ({post.commentCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterManager.filters.typeFilter} onValueChange={handlers.handleTypeFilterChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Comments">Comments</SelectItem>
              <SelectItem value="Replies">Replies</SelectItem>
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

      {/* Bulk Actions */}
      {selectionManager.selectedComments.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">
            {selectionManager.selectedComments.size} selected
          </span>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => handlers.handleBulkStatusUpdate('Approved')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handlers.handleBulkStatusUpdate('Rejected')}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="text-sm text-muted-foreground">
          {filterManager.filteredComments.length} comments
        </div>
      </div>

      {/* Comments List */}
      <CommentList
        comments={paginatedComments}
        selectedComments={selectionManager.selectedComments}
        onToggleSelection={selectionManager.toggleCommentSelection}
        onReply={handlers.handleInlineReply}
        onUpdateStatus={commentManager.updateCommentStatus}
        onDelete={commentManager.deleteComment}
        isLoading={commentManager.isLoading}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center pt-6">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginationManager.previousPage()}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            {paginationManager.getVisiblePages(pagination.totalPages).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pagination.currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className="w-10"
                onClick={() => paginationManager.goToPage(pageNum, pagination.totalPages)}
              >
                {pageNum}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginationManager.nextPage(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

