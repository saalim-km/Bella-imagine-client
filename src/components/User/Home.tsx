"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CategoryCard from "./CategoryCard";
import ContestCard from "./ContestCard";
import PhotoCard from "./PhotoCard";

// Sample data (would come from API in real implementation)
const categories = [
  { _id: "1", title: "Wedding" },
  { _id: "2", title: "Portrait" },
  { _id: "3", title: "Family" },
  { _id: "4", title: "Events" },
  { _id: "5", title: "Fashion" },
  { _id: "6", title: "Travel" },
  { _id: "7", title: "Architecture" },
  { _id: "8", title: "Food" },
];

const photos = [
  {
    id: "1",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531304/unnamed_5_i7qnb7.webp",
    alt: "Wedding couple by the lake",
    photographer: "Anita Sharma",
    category: "Wedding",
  },
  {
    id: "2",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_2_yjfx4l.webp",
    alt: "Family portrait in a garden",
    photographer: "Rahul Mehta",
    category: "Family",
  },
  {
    id: "3",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_mnfmjo.webp",
    alt: "Engagement photoshoot at sunset",
    photographer: "Priya Kapoor",
    category: "Engagement",
  },
  {
    id: "4",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_1_re5olq.webp",
    alt: "Traditional Indian wedding ceremony",
    photographer: "Vikram Singh",
    category: "Wedding",
  },
  {
    id: "5",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_6_hsw1lx.webp",
    alt: "Bride preparation",
    photographer: "Meera Patel",
    category: "Wedding",
  },
  {
    id: "6",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_4_h0l0zp.webp",
    alt: "Couple portrait",
    photographer: "Arjun Reddy",
    category: "Portrait",
  },
  {
    id: "7",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/photo1.jpg",
    alt: "Portrait session",
    photographer: "Neha Gupta",
    category: "Portrait",
  },
  {
    id: "8",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/photo2.jpg",
    alt: "Wedding celebration",
    photographer: "Sanjay Kumar",
    category: "Wedding",
  },
];

const contests = [
  {
    id: 1,
    title: "Portrait Master 2025",
    startDate: "2025-04-10",
    endDate: "2025-04-30",
    image: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531304/portrait.jpg",
    status: "New",
  },
  {
    id: 2,
    title: "Monsoon Magic",
    startDate: "2025-04-15",
    endDate: "2025-05-15",
    image: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531304/monsoon.jpg",
    status: "Trending",
  },
  {
    id: 3,
    title: "Urban Vibes",
    startDate: "2025-05-01",
    endDate: "2025-05-30",
    image: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1743234985/urban.jpg",
    status: "Popular",
  },
];

const locations = [
  {
    state: "Maharashtra",
    count: 1245,
    cities: [
      { name: "Mumbai", count: 355 },
      { name: "Pune", count: 210 },
      { name: "Nagpur", count: 98 },
      { name: "Nashik", count: 67 },
    ],
  },
  {
    state: "Karnataka",
    count: 987,
    cities: [
      { name: "Bangalore", count: 172 },
      { name: "Mysore", count: 89 },
      { name: "Hubli", count: 45 },
      { name: "Mangalore", count: 62 },
    ],
  },
  {
    state: "Delhi",
    count: 678,
    cities: [
      { name: "New Delhi", count: 193 },
      { name: "Noida", count: 87 },
      { name: "Gurgaon", count: 112 },
    ],
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationValue, setLocationValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Parallax effect for hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Rotate through images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative">
      {/* Hero Section with Photographer Search */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div style={{ opacity, scale, y }} className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="h-full w-full"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${photos[currentImageIndex].src})`,
                }}
              >
                <div className="absolute inset-0" />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center ">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 text-white"
          >
            Extraordinary Moments, <br />
            <span className="italic">Artfully Captured</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl /80 mb-10 max-w-xl text-white"
          >
            Connect with over 45,000 visionary photographers across India
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="w-full max-w-md"
          >
            <div className="flex flex-col gap-3">
              <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 /60 text-white"/>
                    <Input
                      placeholder="Search for state or city..."
                      className="h-12 pl-10  /10 border-white/20 focus:border-white/50 transition-colors"
                      onClick={() => setLocationOpen(true)}
                      value={locationValue}
                      onChange={(e) => setLocationValue(e.target.value)}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command className=" ">
                    <CommandInput
                      placeholder="Search for state or city..."
                      value={locationValue}
                      onValueChange={setLocationValue}
                      className=" placeholder:/40"
                    />
                    <CommandList className="max-h-[300px] overflow-auto">
                      <CommandEmpty className="/60">No results found.</CommandEmpty>
                      {locations.map((location) => (
                        <CommandGroup key={location.state} heading={location.state} className="/80">
                          <CommandItem
                            onSelect={() => {
                              setLocationValue(location.state);
                              setLocationOpen(false);
                            }}
                            className="flex items-center justify-between  "
                          >
                            <span>{location.state}</span>
                            <span className="text-sm /60">{location.count}</span>
                          </CommandItem>
                          {location.cities.map((city) => (
                            <CommandItem
                              key={city.name}
                              onSelect={() => {
                                setLocationValue(`${city.name}, ${location.state}`);
                                setLocationOpen(false);
                              }}
                              className="flex items-center justify-between pl-6  "
                            >
                              <span>{city.name}</span>
                              <span className="text-sm /60">{city.count}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <a href="/photographers">
                <Button className="h-12 w-full  transition-colors text-sm uppercase tracking-widest">
                  Find a Photographer
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Image indicators */}
          <div className="absolute bottom-8 flex gap-2">
            {photos.slice(0, 6).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  currentImageIndex === index ? " w-8" : "/40 w-4 hover:/60",
                )}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-md mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl  mb-6">Explore Categories</h2>
            <p className="/60">Discover photographers specializing in your desired style and occasion</p>
          </motion.div>

          <ScrollArea className="w-full pb-6">
            <div className="flex space-x-4">
              <CategoryCard
                key="all"
                title="All"
                isActive={activeCategory === "All"}
                onClick={() => setActiveCategory("All")}
              />
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  title={category.title}
                  isActive={activeCategory === category.title}
                  onClick={() => setActiveCategory(category.title)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-24 ">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8"
          >
            <div className="max-w-md">
              <h2 className="font-serif text-3xl md:text-4xl  mb-6">Featured Work</h2>
              <p className="/60">
                A curated selection of exceptional photography from our community of artists
              </p>
            </div>

            <a
              href="/gallery"
              className="inline-flex items-center gap-2  text-sm uppercase tracking-widest group"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Featured large image */}
            <div className="md:col-span-8 aspect-[16/9]">
              <PhotoCard photo={photos[0]} featured />
            </div>

            {/* Regular grid items */}
            <div className="md:col-span-4 aspect-square">
              <PhotoCard photo={photos[1]} />
            </div>

            <div className="md:col-span-4 aspect-[3/4]">
              <PhotoCard photo={photos[2]} />
            </div>

            <div className="md:col-span-4 aspect-square">
              <PhotoCard photo={photos[3]} />
            </div>

            <div className="md:col-span-4 aspect-[4/3]">
              <PhotoCard photo={photos[4]} />
            </div>

            <div className="md:col-span-6 aspect-[16/9]">
              <PhotoCard photo={photos[5]} />
            </div>

            <div className="md:col-span-6 aspect-[16/9]">
              <PhotoCard photo={photos[6]} />
            </div>
          </div>

          {/* Tags Section */}
          <div className="mt-16 text-center">
            <p className="/60 text-lg mb-6">Discover more by category:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Wedding", "Portrait", "Family", "Events", "Fashion", "Travel"].map((tag) => (
                <a
                  key={tag}
                  href={`/category/${tag.toLowerCase()}`}
                  className="px-4 py-2 /5  border  rounded-full transition-colors"
                >
                  {tag}
                </a>
              ))}
              <button className="px-4 py-2 /5  border  rounded-full transition-colors inline-flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Search all</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contests Section */}
      <section className="py-24 ">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8"
          >
            <div className="max-w-md">
              <h2 className="font-serif text-3xl md:text-4xl  mb-6">Current Contests</h2>
              <p className="/60">
                Showcase your talent and win recognition through our curated photography contests
              </p>
            </div>

            <a
              href="/contests"
              className="inline-flex items-center gap-2  text-sm uppercase tracking-widest group"
            >
              <span>View All Contests</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          <ScrollArea className="w-full pb-6">
            <div className="flex space-x-6">
              {contests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 ">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-serif text-3xl md:text-5xl  mb-8">
              Ready to Capture Your <span className="italic">Extraordinary</span> Moments?
            </h2>
            <p className="/60 text-lg mb-12 max-w-2xl mx-auto">
              Join our community of visionary photographers or find the perfect artist to bring your vision to life
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/photographers"
                className="px-8 py-4   text-sm uppercase tracking-wides transition-colors"
              >
                Find a Photographer
              </a>
              <a
                href="/join"
                className="px-8 py-4 border border-white/30  text-sm uppercase tracking-widest  transition-colors"
              >
                Join as Photographer
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}