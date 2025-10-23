import { Badge } from "@/components/ui/badge";

interface PortfolioItemProps {
  image: string;
  title: string;
  category: string;
  tagline: string;
  techStack: string[];
  onClick: () => void;
}

export const PortfolioItem = ({ image, title, category, tagline, techStack, onClick }: PortfolioItemProps) => {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-card cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-portfolio opacity-0 group-hover:opacity-95 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-center text-white p-6 space-y-3">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-sm opacity-90">{tagline}</p>
          <div className="flex flex-wrap gap-1.5 justify-center mt-3">
            {techStack.slice(0, 3).map((tech, idx) => (
              <Badge key={idx} variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                {tech}
              </Badge>
            ))}
            {techStack.length > 3 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                +{techStack.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
