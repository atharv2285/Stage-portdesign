interface PortfolioItemProps {
  image: string;
  title: string;
  category: string;
}

export const PortfolioItem = ({ image, title, category }: PortfolioItemProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-portfolio opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm opacity-90">{category}</p>
        </div>
      </div>
    </div>
  );
};
