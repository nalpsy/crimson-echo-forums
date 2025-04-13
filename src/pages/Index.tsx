import { useForumStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { CategoryList } from "@/components/CategoryList";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const { currentUser } = useForumStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container py-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Crimson Echo Forums</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join the conversation across various topics and connect with others in this dark-themed community forum.
          </p>
        </div>
        
        <Separator className="mb-8" />
        
        <CategoryList />
      </div>
    </div>
  );
};

export default Index;
