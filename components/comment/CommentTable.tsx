import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MoreHorizontal, 
  Reply, 
  Check, 
  X, 
  Trash2, 
  MessageCircle,
  ExternalLink
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
import { Comment } from '@/types/comment';
import { 
  getCommentStatusBadgeClass, 
  truncateComment 
} from '@/lib/utils/comment-utils';

interface CommentTableProps {
  comments: Comment[];
  selectedComments: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleSelectAll: () => void;
  areAllSelected: boolean;
  onReply: (comment: Comment) => void;
  onUpdateStatus: (id: string, status: Comment['status']) => void;
  onDelete: (id: string) => void;
}

/**
 * Table component for displaying comments
 * @param {CommentTableProps} props - Component props
 * @returns {React.ReactElement} - CommentTable component
 */
export const CommentTable: React.FC<CommentTableProps> = ({
  comments,
  selectedComments,
  onToggleSelection,
  onToggleSelectAll,
  areAllSelected,
  onReply,
  onUpdateStatus,
  onDelete,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={areAllSelected}
                onCheckedChange={onToggleSelectAll}
                aria-label="Select all comments"
              />
            </TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Blog Post</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">No comments found</p>
                  <p className="text-sm">Comments will appear here as they are submitted</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedComments.has(comment.id)}
                    onCheckedChange={() => onToggleSelection(comment.id)}
                    aria-label={`Select comment by ${comment.authorName}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className={`${comment.depth > 0 ? `ml-${Math.min(comment.depth * 4, 16)}` : ''}`}>
                      <p className="text-sm max-w-md">
                        {comment.depth > 0 && '↳ '}
                        {truncateComment(comment.content, 80)}
                      </p>
                    </div>
                    {comment.authorWebsite && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ExternalLink className="w-3 h-3" />
                        <span>{comment.authorWebsite}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{comment.authorName}</p>
                    <p className="text-xs text-muted-foreground">{comment.authorEmail}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="text-sm font-medium truncate">{comment.blogPostTitle}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCommentStatusBadgeClass(comment.status)}>
                    {comment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={comment.isReply ? "secondary" : "outline"} className="text-xs">
                      {comment.isReply ? "Reply" : "Comment"}
                    </Badge>
                    {comment.depth > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        L{comment.depth}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{comment.createdDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onReply(comment)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {comment.status !== 'Approved' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(comment.id, 'Approved')}>
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      {comment.status !== 'Rejected' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(comment.id, 'Rejected')}>
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      )}
                      {comment.status !== 'Spam' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(comment.id, 'Spam')}>
                          <X className="w-4 h-4 mr-2" />
                          Mark as Spam
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
                              This will permanently delete this comment from <strong>{comment.authorName}</strong>. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(comment.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
