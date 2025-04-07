import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllVendorsListQuery } from "@/hooks/client/useClient";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Users, 
  Calendar, 
  Building, 
  Heart, 
  Sparkles,
  Image,
  Video 
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  { icon: Camera, name: "Portrait", description: "Professional portrait photography" },
  { icon: Users, name: "Wedding", description: "Wedding and engagement shoots" },
  { icon: Calendar, name: "Events", description: "Corporate and social events" },
  { icon: Building, name: "Commercial", description: "Product and brand photography" },
  { icon: Heart, name: "Family", description: "Family and children portraits" },
  { icon: Sparkles, name: "Fashion", description: "Fashion and modeling shoots" },
  { icon: Image, name: "Real Estate", description: "Property and interior photography" },
  { icon: Video, name: "Videography", description: "Professional video services" },
];

const Landing = () => {
  const navigate = useNavigate();
  const { data: vendors } = useAllVendorsListQuery({ page: 1, limit: 4 });
  const photographers = vendors?.data || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
      className="relative min-h-[100vh] flex items-center justify-center"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/anm0kepbgfdwrnzuxxdx.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container relative z-10 px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
          Capture Your Perfect Moments
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
          Connect with professional photographers across India for your special occasions
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate("/vendors")}
            variant={"default"}
          >
            Find a Photographer
          </Button>
          <Button 
            size="lg" 
            variant={'outline'}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
    <section className="py-16 bg-muted/50 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Explore Categories
        </h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {categories.map((category,ind) => (
              <Card
                key={ind}
                onClick={() => navigate(`/categories/${category.name}/vendors`)}
                className="w-[200px] h-[100px] flex-shrink-0 transition-all duration-300 hover:bg-accent cursor-pointer"
              >
                <CardContent className="flex items-center justify-center p-6 h-full">
                  <span className="text-center font-medium">
                    {category.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>



      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 text-center">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription>Join Bella Imagine today</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => navigate("/register")}>
                Find a Photographer
              </Button>
              <Button variant="outline" onClick={() => navigate("/vendor/signup")}>
                Register as Photographer
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;