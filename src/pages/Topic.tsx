
import { useParams, Link } from "react-router-dom";
import { useForumStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { ReplyList } from "@/components/ReplyList";
import { CreateReply } from "@/components/CreateReply";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigDown, ArrowBigUp, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const Topic = () => {
  const { id } = useParams<{ id: string }>();
  const { getTopicById, getUserById, categories, upvoteTopic, downvoteTopic, currentUser } = useForumStore();
  
  if (!id) {
    return <div>Topic not found</div>;
  }
  
  const topic = getTopicById(id);
  
  if (!topic) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-10">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
            <Link to="/" className="text-primary hover:underline">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const author = getUserById(topic.authorId);
  const category = categories.find(c => c.id === topic.categoryId);
  
  const upvoteCount = topic.upvotes.length;
  const downvoteCount = topic.downvotes.length;
  const score = upvoteCount - downvoteCount;
  
  const hasUpvoted = currentUser ? topic.upvotes.includes(currentUser.id) : false;
  const hasDownvoted = currentUser ? topic.downvotes.includes(currentUser.id) : false;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container py-6">
        <div className="mb-6">
          <Link to={`/category/${topic.categoryId}`} className="inline-flex items-center text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {category ? category.name : 'Back to category'}
          </Link>
        </div>
        
        <Card className="border-primary/20 mb-8">
          <div className="p-6">
            <div className="flex">
              {/* Vote column */}
              <div className="flex flex-col items-center mr-6 space-y-2">
                <Button
                  variant={hasUpvoted ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-10 w-10",
                    hasUpvoted && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => upvoteTopic(topic.id)}
                  disabled={!currentUser}
                >
                  <ArrowBigUp className="h-6 w-6" />
                </Button>
                
                <span className={cn(
                  "text-lg font-medium",
                  score > 0 ? "text-primary" : score < 0 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {score}
                </span>
                
                <Button
                  variant={hasDownvoted ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-10 w-10",
                    hasDownvoted && "bg-destructive text-destructive-foreground"
                  )}
                  onClick={() => downvoteTopic(topic.id)}
                  disabled={!currentUser}
                >
                  <ArrowBigDown className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Content column */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-4">{topic.title}</h1>
                
                <div className="flex items-center mb-6 text-sm text-muted-foreground">
                  {author && (
                    <>
                      <div 
                        className={`w-6 h-6 rounded-full mr-2 ${author.avatarColor} flex items-center justify-center text-white font-bold text-xs`}
                      >
                        {author.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{author.username}</span>
                      <span className="mx-2">•</span>
                    </>
                  )}
                  <span>{formatDistanceToNow(topic.createdAt, { addSuffix: true })}</span>
                </div>
                
                <div className="text-foreground whitespace-pre-line text-lg">
                  {topic.content}
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span>Replies</span>
          </h2>
          
          {currentUser && (
            <div className="mb-6">
              <CreateReply topicId={topic.id} />
            </div>
          )}
          
          <ReplyList topicId={topic.id} />
        </div>
      </div>
    </div>
  );
};

export default Topic;
