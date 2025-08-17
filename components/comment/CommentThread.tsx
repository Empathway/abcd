import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Reply, 
  Check, 
  X, 
  Trash2, 
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface CommentThreadProps {
  comment: Comment;
  replies: Comment[];
  selectedComments: Set<string>;
  onToggleSelection: (id: string) => void;
  onReply: (parentId: string, content: string) => void;
  onUpdateStatus: (id: string, status: Comment['status']) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}


export const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  replies,
  selectedComments,
  onToggleSelection,
  onReply,
  onUpdateStatus,
  onDelete,
  isLoading = false,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyBox(false);
    }
  };

  const handleCancelReply = () => {
    setReplyContent('');
    setShowReplyBox(false);
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Main Comment */}
      <div className="p-4 hover:bg-gray-50 transition-colors">
        <div className="flex gap-3">
          <Checkbox
            checked={selectedComments.has(comment.id)}
            onCheckedChange={() => onToggleSelection(comment.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            {/* Author Info */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-900">{comment.authorName}</span>
                <Badge className={getCommentStatusBadgeClass(comment.status)}>
                  {comment.status}
                </Badge>
                <span className="text-gray-500">{comment.createdDate}</span>
              </div>
            </div>

            {/* Comment Content */}
            <div className="mb-3">
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
              {comment.authorWebsite && (
                <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                  <ExternalLink className="w-3 h-3" />
                  <a href={comment.authorWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {comment.authorWebsite}
                  </a>
                </div>
              )}
            </div>

            {/* Comment Meta */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <span>On: {comment.blogPostTitle}</span>
              <span>•</span>
              <span>{comment.authorEmail}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="text-gray-600 hover:text-gray-900 h-8"
              >
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </Button>

              {comment.status !== 'Approved' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateStatus(comment.id, 'Approved')}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              )}

              {comment.status !== 'Rejected' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateStatus(comment.id, 'Rejected')}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {comment.status !== 'Spam' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(comment.id, 'Spam')}>
                      <X className="w-4 h-4 mr-2" />
                      Mark as Spam
                    </DropdownMenuItem>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the comment from {comment.authorName}. This action cannot be undone.
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
            </div>

            {/* Inline Reply Box */}
            {showReplyBox && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <div className="flex-1">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {replyContent.length}/1000 characters
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelReply}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSubmitReply}
                          disabled={!replyContent.trim() || isLoading}
                        >
                          {isLoading ? 'Posting...' : 'Reply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Replies Section */}
      {replies.length > 0 && (
        <div className="border-l-2 border-blue-100 ml-8">
          <div className="pl-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="text-blue-600 hover:text-blue-700 mb-2 h-8"
            >
              {showReplies ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </Button>

            {showReplies && replies.map((reply) => (
              <div key={reply.id} className="py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex gap-3">
                  <Checkbox
                    checked={selectedComments.has(reply.id)}
                    onCheckedChange={() => onToggleSelection(reply.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium">
                        {reply.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-900">{reply.authorName}</span>
                        <Badge className={getCommentStatusBadgeClass(reply.status)}>
                          {reply.status}
                        </Badge>
                        <span className="text-gray-500">{reply.createdDate}</span>
                      </div>
                    </div>

                    <p className="text-gray-900 whitespace-pre-wrap text-sm leading-relaxed mb-2">
                      {reply.content}
                    </p>

                    <div className="flex items-center gap-2">
                      {reply.status !== 'Approved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateStatus(reply.id, 'Approved')}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 h-7 text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                      )}

                      {reply.status !== 'Rejected' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateStatus(reply.id, 'Rejected')}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 h-7 w-7 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onUpdateStatus(reply.id, 'Spam')}>
                            <X className="w-4 h-4 mr-2" />
                            Mark as Spam
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(reply.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
