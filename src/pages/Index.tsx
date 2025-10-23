import { Header } from "@/components/Header";
import { ProfileHeader } from "@/components/ProfileHeader";
import { PortfolioItem } from "@/components/PortfolioItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const portfolioItems = [
  { id: 1, image: portfolio1, title: "Chat", category: "Mobile App" },
  { id: 2, image: portfolio2, title: "Shop", category: "E-commerce" },
  { id: 3, image: portfolio3, title: "AI OS", category: "Dashboard" },
  { id: 4, image: portfolio4, title: "Widget Dashboard", category: "iOS App" },
  { id: 5, image: portfolio5, title: "Music Player", category: "Streaming" },
  { id: 6, image: portfolio6, title: "Fitness Tracker", category: "Health & Wellness" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProfileHeader />
      
      <div className="border-b border-border">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="work" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="bg-transparent border-none h-auto p-0">
                <TabsTrigger 
                  value="work" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                >
                  Work
                </TabsTrigger>
                <TabsTrigger 
                  value="services"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                >
                  Services
                </TabsTrigger>
                <TabsTrigger 
                  value="collections"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                >
                  Collections
                </TabsTrigger>
                <TabsTrigger 
                  value="about"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                >
                  About
                </TabsTrigger>
              </TabsList>
              
              <Button variant="ghost" size="sm" className="gap-2">
                Featured Shots <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            <TabsContent value="work" className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                  <PortfolioItem
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    category={item.category}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="services" className="py-12">
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4">Services</h2>
                <p className="text-muted-foreground">Check out our design services and offerings.</p>
              </div>
            </TabsContent>

            <TabsContent value="collections" className="py-12">
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4">Collections</h2>
                <p className="text-muted-foreground">Curated collections of our best work.</p>
              </div>
            </TabsContent>

            <TabsContent value="about" className="py-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">About Geex Arts</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  We specialize in creating stunning mobile app designs that push the boundaries of creativity. 
                  Our mission is to visualize the craziest ideas and bring them to life through innovative design solutions.
                </p>
                <p className="text-lg text-muted-foreground">
                  With over 44,000 followers and thousands of likes, we've established ourselves as leaders in the 
                  digital design space, constantly exploring new design trends and technologies.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
