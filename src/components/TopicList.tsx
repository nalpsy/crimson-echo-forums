
import { useForumStore } from "@/lib/store";
import { TopicCard } from "./TopicCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { CreateTopic } from "./CreateTopic";

type TopicListProps = {
  categoryId: string;
};

export const TopicList = ({ categoryId }: TopicListProps) => {
  const { getTopicsByCategory, categories } = useForumStore();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const topics = getTopicsByCategory(categoryId);
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
          <p className="text-muted-foreground mt-1">{category.description}</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)} 
          className="bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Topic
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <CreateTopic 
            categoryId={categoryId} 
            onClose={() => setShowCreateForm(false)} 
          />
        </div>
      )}

      {topics.length > 0 ? (
        <div className="space-y-4">
          {topics
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">No topics yet. Be the first to start a discussion!</p>
        </div>
      )}
    </div>
  );
};
