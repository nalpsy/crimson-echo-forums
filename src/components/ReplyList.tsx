
import { useForumStore, Reply } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreateReply } from "./CreateReply";
import { useState } from "react";

type ReplyListProps = {
  topicId: string;
};

export const ReplyList = ({ topicId }: ReplyListProps) => {
  const { getRepliesByTopic } = useForumStore();
  const replies = getRepliesByTopic(topicId);

  if (replies.length === 0) {
    return (
      <div className="text-center py-8 bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">No replies yet. Be the first to join the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {replies
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((reply) => (
          <ReplyCard key={reply.id} reply={reply} />
        ))}
    </div>
  );
};

type ReplyCardProps = {
  reply: Reply;
};

export const ReplyCard = ({ reply }: ReplyCardProps) => {
  const { getUserById, upvoteReply, downvoteReply, currentUser } = useForumStore();
  const author = getUserById(reply.authorId);
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  const upvoteCount = reply.upvotes.length;
  const downvoteCount = reply.downvotes.length;
  const score = upvoteCount - downvoteCount;
  
  const hasUpvoted = currentUser ? reply.upvotes.includes(currentUser.id) : false;
  const hasDownvoted = currentUser ? reply.downvotes.includes(currentUser.id) : false;

  return (
    <div className="p-4 rounded-lg bg-card border border-border">
      <div className="flex">
        {/* Vote column */}
        <div className="flex flex-col items-center mr-4 space-y-1">
          <Button
            variant={hasUpvoted ? "default" : "ghost"}
            size="icon"
            className={cn(
              "h-8 w-8",
              hasUpvoted && "bg-primary text-primary-foreground"
            )}
            onClick={() => upvoteReply(reply.id)}
            disabled={!currentUser}
          >
            <ArrowBigUp className="h-5 w-5" />
          </Button>
          
          <span className={cn(
            "text-sm font-medium",
            score > 0 ? "text-primary" : score < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            {score}
          </span>
          
          <Button
            variant={hasDownvoted ? "default" : "ghost"}
            size="icon"
            className={cn(
              "h-8 w-8",
              hasDownvoted && "bg-destructive text-destructive-foreground"
            )}
            onClick={() => downvoteReply(reply.id)}
            disabled={!currentUser}
          >
            <ArrowBigDown className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Content column */}
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {author && (
              <>
                <div 
                  className={`w-6 h-6 rounded-full mr-2 ${author.avatarColor} flex items-center justify-center text-white font-bold text-xs`}
                >
                  {author.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-card-foreground">{author.username}</span>
                <span className="mx-2 text-muted-foreground">•</span>
              </>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
            </span>
          </div>
          
          <div className="text-card-foreground whitespace-pre-line">
            {reply.content}
          </div>
          
          <div className="mt-4 flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </Button>
          </div>
          
          {showReplyForm && (
            <div className="mt-4">
              <CreateReply 
                topicId={reply.topicId} 
                onClose={() => setShowReplyForm(false)}
                initialContent={`@${author?.username} `}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
