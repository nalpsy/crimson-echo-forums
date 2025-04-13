
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useForumStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";

type CreateReplyProps = {
  topicId: string;
  onClose?: () => void;
  initialContent?: string;
};

export const CreateReply = ({ topicId, onClose, initialContent = "" }: CreateReplyProps) => {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addReply, currentUser } = useForumStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to reply",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Missing content",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newReply = addReply(content.trim(), topicId);
      
      if (newReply) {
        toast({
          title: "Reply added",
          description: "Your reply has been added successfully",
        });
        
        setContent("");
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding your reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-card">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4">
          <Textarea
            placeholder="Write your reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] bg-background"
          />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {onClose && (
            <Button 
              variant="outline" 
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
          >
            Post Reply
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
