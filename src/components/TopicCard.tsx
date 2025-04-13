
import { Link } from "react-router-dom";
import { useForumStore, Topic } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TopicCardProps = {
  topic: Topic;
};

export const TopicCard = ({ topic }: TopicCardProps) => {
  const { getUserById, getRepliesByTopic, upvoteTopic, downvoteTopic, currentUser } = useForumStore();
  
  const author = getUserById(topic.authorId);
  const replies = getRepliesByTopic(topic.id);
  const replyCount = replies.length;
  
  const upvoteCount = topic.upvotes.length;
  const downvoteCount = topic.downvotes.length;
  const score = upvoteCount - downvoteCount;
  
  const hasUpvoted = currentUser ? topic.upvotes.includes(currentUser.id) : false;
  const hasDownvoted = currentUser ? topic.downvotes.includes(currentUser.id) : false;

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    upvoteTopic(topic.id);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    downvoteTopic(topic.id);
  };

  return (
    <Link
      to={`/topic/${topic.id}`}
      className={cn(
        "block p-4 rounded-lg bg-card border border-border",
        "hover:bg-card/80 transition-colors duration-200",
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
      )}
    >
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
            onClick={handleUpvote}
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
            onClick={handleDownvote}
            disabled={!currentUser}
          >
            <ArrowBigDown className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Content column */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground">{topic.title}</h3>
          
          <div className="text-muted-foreground text-sm mt-2 line-clamp-2">
            {topic.content}
          </div>
          
          <div className="flex items-center mt-3 text-xs text-muted-foreground">
            {author && (
              <>
                <div 
                  className={`w-5 h-5 rounded-full mr-1 ${author.avatarColor} flex items-center justify-center text-white font-bold text-xs`}
                >
                  {author.username.charAt(0).toUpperCase()}
                </div>
                <span>{author.username}</span>
                <span className="mx-2">•</span>
              </>
            )}
            <span>{formatDistanceToNow(topic.createdAt, { addSuffix: true })}</span>
            <div className="flex items-center ml-auto">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
