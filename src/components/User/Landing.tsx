import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, ThumbsUp } from "lucide-react";

// Sample contest data (replace with API hook)
const contests = [
  {
    id: 1,
    title: "Monsoon Moments",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    image: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/monsoon.jpg",
    status: "New",
  },
  {
    id: 2,
    title: "Urban Vibes",
    startDate: "2025-04-10",
    endDate: "2025-05-10",
    image: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/urban.jpg",
    status: "Trending",
  },
];

// Sample community photos (replace with API hook)
const communityPhotos = [
  {
    id: 1,
    thumbnail: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/photo1.jpg",
    user: { name: "Anita S.", avatar: "/avatars/anita.jpg" },
    category: "Portrait",
  },
  {
    id: 2,
    thumbnail: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/photo2.jpg",
    user: { name: "Rahul M.", avatar: "/avatars/rahul.jpg" },
    category: "Wedding",
  },
  {
    id: 3,
    thumbnail: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/photo3.jpg",
    user: { name: "Priya K.", avatar: "/avatars/priya.jpg" },
    category: "Events",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);

  // Simulate photo loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingPhotos(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-background">
      {/* 1. Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/anm0kepbgfdwrnzuxxdx.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        <div className="container relative z-10 px-4 text-center text-white">
          <Card className="bg-white/10 backdrop-blur-sm border-none rounded-xl p-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Join India’s Photography Community
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto">
              Share your photos, join contests, and connect with creatives.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/contests")}
              >
                Join a Contest
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/20"
                onClick={() => navigate("/community")}
              >
                Explore Photos
              </Button>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* 2. Featured Contest Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-12 bg-muted/20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Active Contests
          </h2>
          <ScrollArea className="w-full">
            <div className="flex space-x-4 p-4">
              {contests.map((contest) => (
                <Card
                  key={contest.id}
                  className="w-[280px] flex-shrink-0 rounded-xl overflow-hidden"
                >
                  <CardContent className="p-0">
                    <img
                      src={contest.image}
                      alt={contest.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">{contest.title}</h3>
                        <Badge>{contest.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {contest.startDate} - {contest.endDate}
                      </p>
                      <Button
                        className="mt-4 w-full "
                        onClick={() => navigate(`/contests/${contest.id}/upload`)}
                      >
                        Participate Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </motion.section>

      {/* 3. Community Gallery Preview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-12"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Community Creations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {isLoadingPhotos
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="w-full h-[200px] rounded-xl" />
                  ))
              : communityPhotos.map((photo) => (
                  <Card
                    key={photo.id}
                    className="rounded-xl overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <img
                        src={photo.thumbnail}
                        alt="Community photo"
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={photo.user.avatar} />
                            <AvatarFallback>{photo.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{photo.user.name}</span>
                        </div>
                        <Badge>{photo.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
          <div className="text-center mt-6">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/community")}
            >
              View More
            </Button>
          </div>
        </div>
      </motion.section>

      {/* 4. Join Now CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-12 bg-muted/20"
      >
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto rounded-xl p-6">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">
                Book, Create, Compete
              </CardTitle>
              <CardDescription>Join Bella Imagine today</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/vendors")}
              >
                Book a Photographer
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/contests/upload")}
              >
                Join a Contest
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;