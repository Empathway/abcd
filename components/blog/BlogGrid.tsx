import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Eye, 
  Trash2, 
  Archive,
  FileText,
  Star,
  Send,
  Heart,
  MessageCircle,
  Clock,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BlogPost } from '@/types/blog';
import { 
  getBlogStatusBadgeClass, 
  formatNumber, 
  truncateText 
} from '@/lib/utils/blog-utils';

interface BlogGridProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDuplicate: (id: string) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (post: BlogPost) => void;
}

/**
 * Grid component for displaying blog posts as cards
 * @param {BlogGridProps} props - Component props
 * @returns {React.ReactElement} - BlogGrid component
 */
export const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  onEdit,
  onDuplicate,
  onPublish,
  onArchive,
  onDelete,
  onPreview,
}) => {
  if (posts.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No blog posts found</h3>
            <p className="text-muted-foreground max-w-sm">
              Create your first blog post to get started sharing your thoughts with the world.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge className={getBlogStatusBadgeClass(post.status)}>
                    {post.status}
                  </Badge>
                  {post.isFeatured && (
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
                  {post.title}
                </h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onPreview(post)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(post)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(post.id)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  {post.status === 'Draft' && (
                    <DropdownMenuItem onClick={() => onPublish(post.id)}>
                      <Send className="w-4 h-4 mr-2" />
                      Publish
                    </DropdownMenuItem>
                  )}
                  {post.status !== 'Archived' && (
                    <DropdownMenuItem onClick={() => onArchive(post.id)}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete <strong>{post.title}</strong>. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(post.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-1">
              {post.categories.slice(0, 3).map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {post.categories.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.categories.length - 3}
                </Badge>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatNumber(post.viewCount)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{formatNumber(post.likeCount)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{post.commentCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.readTime}m</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created {post.createdDate}</span>
              </div>
              {post.publishedDate && (
                <span>Published {post.publishedDate}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
