
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForumStore } from "@/lib/store";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type CreateTopicProps = {
  categoryId: string;
  onClose: () => void;
};

export const CreateTopic = ({ categoryId, onClose }: CreateTopicProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTopic, currentUser } = useForumStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to create a topic",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newTopic = addTopic(title.trim(), content.trim(), categoryId);
      
      if (newTopic) {
        toast({
          title: "Topic created",
          description: "Your topic has been created successfully",
        });
        
        // Navigate to the new topic
        navigate(`/topic/${newTopic.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your topic",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Card className="border-primary/20 bg-card">
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Create New Topic</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Topic title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] bg-background"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !title.trim() || !content.trim()}
          >
            Create Topic
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
