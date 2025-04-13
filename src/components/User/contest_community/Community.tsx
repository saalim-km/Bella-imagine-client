import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { 
  Camera, 
  Trophy, 
  Heart, 
  Upload, 
  Users, 
  Calendar,
  ArrowRight
} from "lucide-react";
import { useAllClientContestQuery } from "@/hooks/contest/useContest";

const Community = () => {
  const featuredPhotos = [
    {
      id: "1",
      title: "Mountain Majesty",
      imageUrl: "https://images.unsplash.com/photo-1546430783-fe4b9fad637c",
      photographer: {
        name: "James Wilson",
        avatarUrl: "https://i.pravatar.cc/150?img=3"
      },
      likes: 287,
      isWinner: true
    },
    {
      id: "2",
      title: "Love Eternal",
      imageUrl: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a",
      photographer: {
        name: "Isabella Clark",
        avatarUrl: "https://i.pravatar.cc/150?img=7"
      },
      likes: 512,
      isWinner: false
    },
    {
      id: "3",
      title: "Urban Vibes",
      imageUrl: "https://images.unsplash.com/photo-1605979753916-a91598543e65",
      photographer: {
        name: "Sophie Chen",
        avatarUrl: "https://i.pravatar.cc/150?img=1"
      },
      likes: 145,
      isWinner: false
    }
  ];
  
//   const activeContests = [
//     {
//       id: "weekly",
//       title: "Weekly Challenge: Street Photography",
//       description: "Capture the essence of urban life and street scenes.",
//       endsIn: "4 days",
//       participants: 32
//     },
//     {
//       id: "monthly",
//       title: "Photo of the Month: Nature",
//       description: "Show us your best nature shots - landscapes, wildlife, plants.",
//       endsIn: "15 days",
//       participants: 75
//     }
//   ];
  
  const {data : contests} = useAllClientContestQuery({status : 'active'})
  const activeContests = contests?.data || []
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 md:py-24 mt-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Bella Imagine Community
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our community of photographers, share your best shots, participate in contests, and get inspired.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link to="/community">
                    <Users className="mr-2 h-5 w-5" />
                    Explore Community
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/upload">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Your Photo
                  </Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto lg:ml-auto flex items-center justify-center"
            >
              <div className="relative w-full max-w-[500px] aspect-square">
                <div className="absolute top-0 left-0 w-[80%] h-[80%] overflow-hidden rounded-lg shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e"
                    alt="Nature Photography" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-[70%] h-[70%] overflow-hidden rounded-lg shadow-xl border-4 border-white dark:border-gray-800">
                  <img 
                    src="https://images.unsplash.com/photo-1537633552985-df8429e8048b"
                    alt="Wedding Photography" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-[40%] right-[15%] rounded-full bg-white dark:bg-gray-800 p-2 shadow-lg">
                  <Camera className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Photos Section */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Award-Winning Photos</h2>
              <p className="text-muted-foreground">
                Celebrating exceptional photography from our community contests.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/leaderboard">
                View All Winners
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {featuredPhotos.map((photo) => (
                <CarouselItem key={photo.id} className="basis-full md:basis-1/2 lg:basis-1/3 p-1">
                  <Card className="overflow-hidden h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={photo.imageUrl} 
                        alt={photo.title} 
                        className="object-cover w-full h-full"
                      />
                      {photo.isWinner && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-500">
                            <Trophy className="h-3 w-3 mr-1" />
                            Winner
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{photo.title}</h3>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-sm">{photo.likes}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={photo.photographer.avatarUrl} />
                          <AvatarFallback>{photo.photographer.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{photo.photographer.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>
      
      {/* Active Contests Section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Active Contests</h2>
              <p className="text-muted-foreground">
                Participate in our photography contests and showcase your skills.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/contests">
                View All Contests
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {activeContests.map((contest) => (
              <Card key={contest._id}>
                <CardHeader>
                  <CardTitle>{contest.title}</CardTitle>
                  <CardDescription>{contest.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ends in {Math.floor((new Date(contest.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{(contest?.clientParticipants?.length || 0) + (contest?.vendorParticipants?.length || 0)} participants</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/upload">
                      Submit Your Entry
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-center">Ready to showcase your photography?</CardTitle>
              <CardDescription className="text-center">
                Join our community of photographers and participate in our contests.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link to="/upload">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/community">
                    <Users className="mr-2 h-5 w-5" />
                    Explore Community
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Community;
