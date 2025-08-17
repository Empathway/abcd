import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Comment, CommentFormData } from '@/types/comment';
import { truncateComment, getCommentStatusBadgeClass } from '@/lib/utils/comment-utils';

interface CommentReplyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: Comment | null;
  formData: CommentFormData;
  onFormDataChange: (updates: Partial<CommentFormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Form component for replying to comments
 * @param {CommentReplyFormProps} props - Component props
 * @returns {React.ReactElement} - CommentReplyForm component
 */
export const CommentReplyForm: React.FC<CommentReplyFormProps> = ({
  open,
  onOpenChange,
  comment,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  if (!comment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply to Comment</DialogTitle>
          <DialogDescription>
            Reply to {comment.authorName}'s comment on "{comment.blogPostTitle}"
          </DialogDescription>
        </DialogHeader>
        
        {/* Original Comment */}
        <div className="rounded-md bg-muted p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.authorName}</span>
              <Badge className={getCommentStatusBadgeClass(comment.status)}>
                {comment.status}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{comment.createdDate}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {truncateComment(comment.content, 200)}
          </p>
        </div>

        {/* Reply Form */}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="reply-content">Your Reply *</Label>
            <Textarea
              id="reply-content"
              value={formData.content}
              onChange={(e) => onFormDataChange({ content: e.target.value })}
              placeholder="Write your reply here..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.length}/1000 characters
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="reply-status">Reply Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onFormDataChange({ status: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading || !formData.content.trim()}>
            {isLoading ? 'Posting Reply...' : 'Post Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
