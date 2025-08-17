import React from 'react';
import { Comment } from '@/types/comment';
import { CommentThread } from './CommentThread';
import { MessageCircle } from 'lucide-react';

interface CommentListProps {
  comments: Comment[];
  selectedComments: Set<string>;
  onToggleSelection: (id: string) => void;
  onReply: (parentId: string, content: string) => void;
  onUpdateStatus: (id: string, status: Comment['status']) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

/**
 * YouTube Studio-style comment list component
 */
export const CommentList: React.FC<CommentListProps> = ({
  comments,
  selectedComments,
  onToggleSelection,
  onReply,
  onUpdateStatus,
  onDelete,
  isLoading = false,
}) => {
  // Group comments by parent (top-level comments with their replies)
  const commentThreads = React.useMemo(() => {
    const topLevelComments = comments.filter(c => !c.parentId);
    const commentMap = new Map<string, Comment[]>();
    
    // Group replies by parent ID
    comments.filter(c => c.parentId).forEach(reply => {
      if (!commentMap.has(reply.parentId!)) {
        commentMap.set(reply.parentId!, []);
      }
      commentMap.get(reply.parentId!)!.push(reply);
    });
    
    return topLevelComments.map(comment => ({
      comment,
      replies: commentMap.get(comment.id) || []
    }));
  }, [comments]);

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
        <p className="text-gray-500 max-w-sm">
          Comments from your blog posts will appear here. You can moderate, reply, and manage them all in one place.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      {commentThreads.map(({ comment, replies }) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          replies={replies}
          selectedComments={selectedComments}
          onToggleSelection={onToggleSelection}
          onReply={onReply}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};
