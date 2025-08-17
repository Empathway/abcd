export interface Comment {
    id: string;
    blogPostId: string;
    blogPostTitle: string;
    authorName: string;
    authorEmail: string;
    authorWebsite?: string;
    content: string;
    status: "Pending" | "Approved" | "Rejected" | "Spam";
    createdDate: string;
    parentId?: string; // For nested replies
    replies?: Comment[];
    isReply: boolean;
    depth: number; // 0 for top-level, 1+ for replies
    ipAddress?: string;
    userAgent?: string;
  }
  
  export interface CommentFormData {
    content: string;
    status: Comment['status'];
    authorName?: string;
    authorEmail?: string;
  }
  
  export interface CommentFilterState {
    searchTerm: string;
    statusFilter: string;
    blogPostFilter: string;
    dateFilter: string;
    typeFilter: string; // All, Comments, Replies
  }
  
  export interface CommentStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    spam: number;
    totalReplies: number;
    avgResponseTime: number;
  }
  
  export interface BlogPostOption {
    id: string;
    title: string;
    commentCount: number;
  }
  