
import { useParams, Link } from "react-router-dom";
import { useForumStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { TopicList } from "@/components/TopicList";
import { ChevronLeft } from "lucide-react";

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const { categories } = useForumStore();
  
  if (!id) {
    return <div>Category not found</div>;
  }
  
  const category = categories.find(c => c.id === id);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-10">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Category not found</h2>
            <Link to="/" className="text-primary hover:underline">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container py-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to categories
          </Link>
        </div>
        
        <TopicList categoryId={id} />
      </div>
    </div>
  );
};

export default Category;
