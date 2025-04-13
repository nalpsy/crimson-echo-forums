
import { Link } from "react-router-dom";
import { useForumStore, Category } from "@/lib/store";
import { Cpu, Film, Gamepad, MessageSquare, Music } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const getIconByName = (iconName: string) => {
  switch (iconName) {
    case 'message-square':
      return <MessageSquare className="h-6 w-6" />;
    case 'cpu':
      return <Cpu className="h-6 w-6" />;
    case 'gamepad-2':
      return <Gamepad className="h-6 w-6" />;
    case 'film':
      return <Film className="h-6 w-6" />;
    case 'music':
      return <Music className="h-6 w-6" />;
    default:
      return <MessageSquare className="h-6 w-6" />;
  }
};

export const CategoryList = () => {
  const { categories } = useForumStore();

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Categories</h2>
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

const CategoryCard = ({ category }: { category: Category }) => {
  const { getTopicsByCategory } = useForumStore();
  const topicsCount = getTopicsByCategory(category.id).length;

  return (
    <Link
      to={`/category/${category.id}`}
      className={cn(
        "block p-4 rounded-lg bg-card border border-border",
        "hover:bg-card/80 transition-colors duration-200",
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
      )}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4 bg-primary/10 p-3 rounded-lg text-primary">
          {getIconByName(category.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-card-foreground">{category.name}</h3>
          <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
        </div>
        <div className="flex-shrink-0 text-muted-foreground">
          <span className="bg-muted rounded-full px-2.5 py-0.5 text-xs">
            {topicsCount} {topicsCount === 1 ? 'topic' : 'topics'}
          </span>
        </div>
      </div>
    </Link>
  );
};
