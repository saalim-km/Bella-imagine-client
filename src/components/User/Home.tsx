"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import PhotoCard, { photos } from "@/utils/theme/Photocard";
import { useAllClientCategories } from "@/hooks/client/useClient";
import { Category } from "@/services/categories/categoryService";

const contests = [
  {
    id: 1,
    title: "Portrait Master 2025",
    startDate: "2025-04-10",
    endDate: "2025-04-30",
    image:
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531304/portrait.jpg",
    status: "New",
  },
  {
    id: 2,
    title: "Monsoon Magic",
    startDate: "2025-04-15",
    endDate: "2025-05-15",
    image:
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531304/monsoon.jpg",
    status: "Trending",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { data } = useAllClientCategories();
  const categories: Category[] = data?.data || [];
  console.log(categories);

  return (
    <div className="w-full">

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 bg-muted/50"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Explore Categories
          </h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
              {categories.map((category, ind) => (
                <Card
                  key={ind}
                  onClick={() => navigate(`/category/${category._id}`)}
                  className="w-[200px] h-[100px] flex-shrink-0 transition-all duration-300 hover:bg-accent cursor-pointer"
                >
                  <CardContent className="flex items-center justify-center p-6 h-full">
                    <span className="text-center font-medium">
                      {category.title}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </motion.section>

      <div className="min-h-screen  mx-40">
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured large image */}
            <div className="md:col-span-2 lg:col-span-2 aspect-[16/9]">
              <PhotoCard photo={photos[0]} featured />
            </div>

            {/* Regular grid items */}
            <div className="aspect-square">
              <PhotoCard photo={photos[1]} />
            </div>

            <div className="aspect-[9/5]">
              <PhotoCard photo={photos[2]} />
            </div>

            <div className="aspect-[9/9]">
              <PhotoCard photo={photos[3]} />
            </div>

            <div className="aspect-[/3]" style={{ marginTop: "-55px" }}>
              <PhotoCard photo={photos[4]} />
            </div>
            <div className="aspect-[4/6]" style={{ marginTop: "-45%" }}>
              <PhotoCard photo={photos[5]} />
            </div>

            <div className="aspect-[8/9]">
              <PhotoCard photo={photos[6]} />
            </div>

            <div className="aspect-square">
              <PhotoCard photo={photos[7]} />
            </div>
          </div>

          {/* Tags Section */}
          <div className="mt-12 text-center space-y-4">
            <p className="text-foreground text-lg">
              Discover more beautiful{" "}
              <a href="/photos" className="text-primary hover:underline">
                wedding moments
              </a>{" "}
              by category:
            </p>
            <button className="mx-auto flex items-center gap-2 p-3 rounded-full hover:bg-muted transition-colors">
              <Search className="h-4 w-4" />
              <span className="text-sm">Search collections</span>
            </button>
          </div>
        </main>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 bg-muted/50"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center  mb-8">
            Join Our Contests
          </h2>
          <ScrollArea className="w-full">
            <div className="flex space-x-4 p-4">
              {contests.map((contest) => (
                <Card
                  key={contest.id}
                  className="w-[300px] flex-shrink-0 rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-0">
                    <img
                      src={contest.image}
                      alt={contest.title}
                      className="w-full h-40 object-cover rounded-t-2xl"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <CardTitle className="text-lg">
                          {contest.title}
                        </CardTitle>
                        <Badge
                          variant={
                            contest.status === "Trending"
                              ? "default"
                              : "secondary"
                          }
                          className="rounded-full"
                        >
                          {contest.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {contest.startDate} - {contest.endDate}
                      </CardDescription>
                      <Button
                        className="mt-4 w-full  rounded-full"
                        onClick={() =>
                          navigate(`/contests/${contest.id}/upload`)
                        }
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
    </div>
  );
}
