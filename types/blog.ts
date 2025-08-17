export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: "Draft" | "Published" | "Scheduled" | "Archived";
    authorId: string;
    authorName: string;
    createdDate: string;
    publishedDate?: string;
    lastModified: string;
    scheduledDate?: string;
    featuredImage?: string;
    readTime: number;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    tags: string[];
    categories: string[];
    seoTitle?: string;
    metaDescription?: string;
    isPrivate: boolean;
    isFeatured: boolean;
  }
  
  export interface BlogFormData {
    title: string;
    content: string;
    excerpt: string;
    status: BlogPost['status'];
    scheduledDate?: string;
    featuredImage?: string;
    tags: string[];
    categories: string[];
    seoTitle?: string;
    metaDescription?: string;
    isPrivate: boolean;
    isFeatured: boolean;
  }
  
  export interface BlogFilterState {
    searchTerm: string;
    statusFilter: string;
    categoryFilter: string;
    dateFilter: string;
    featuredFilter: string;
  }
  
  export interface BlogStats {
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    archived: number;
    totalViews: number;
    totalLikes: number;
    avgReadTime: number;
  }
  