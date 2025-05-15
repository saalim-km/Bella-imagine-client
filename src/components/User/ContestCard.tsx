"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface Contest {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  status: string;
}

interface ContestCardProps {
  contest: Contest;
}

export default function ContestCard({ contest }: ContestCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="min-w-[350px] max-w-[350px] overflow-hidden rounded-lg bg-white/5 border border-white/10 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={contest.image || "/placeholder.svg"}
          alt={contest.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute top-4 right-4">
          <Badge
            variant={contest.status === "Trending" ? "default" : "secondary"}
            className="bg-white text-black hover:bg-white/90"
          >
            {contest.status}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="text-white text-xl font-serif mb-1">{contest.title}</h3>
          <p className="text-white/70 text-sm">
            {new Date(contest.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
            {new Date(contest.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-white/70 mb-6">
          Showcase your talent and compete with photographers from across the country.
        </p>

        <a
          href={`/contests/${contest.id}`}
          className="inline-flex items-center gap-2 text-white text-sm uppercase tracking-widest group/link"
        >
          <span>Participate Now</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}