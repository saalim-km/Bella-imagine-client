"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

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
    state: "West Bengal",
    count: 756,
    cities: [
      { name: "Kolkata", count: 289 },
      { name: "Siliguri", count: 67 },
      { name: "Durgapur", count: 43 },
      { name: "Asansol", count: 38 },
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
  {
    state: "Tamil Nadu",
    count: 890,
    cities: [
      { name: "Chennai", count: 156 },
      { name: "Coimbatore", count: 78 },
      { name: "Madurai", count: 65 },
      { name: "Salem", count: 42 },
    ],
  },
  {
    state: "Kerala",
    count: 567,
    cities: [
      { name: "Kochi", count: 51 },
      { name: "Thiruvananthapuram", count: 48 },
      { name: "Kozhikode", count: 39 },
      { name: "Thrissur", count: 35 },
    ],
  },
  {
    state: "Gujarat",
    count: 678,
    cities: [
      { name: "Ahmedabad", count: 123 },
      { name: "Surat", count: 89 },
      { name: "Vadodara", count: 67 },
      { name: "Rajkot", count: 45 },
    ],
  },
  {
    state: "Telangana",
    count: 543,
    cities: [
      { name: "Hyderabad", count: 145 },
      { name: "Warangal", count: 43 },
      { name: "Karimnagar", count: 28 },
    ],
  },
  {
    state: "Rajasthan",
    count: 456,
    cities: [
      { name: "Jaipur", count: 98 },
      { name: "Udaipur", count: 67 },
      { name: "Jodhpur", count: 54 },
      { name: "Ajmer", count: 32 },
    ],
  },
  {
    state: "Punjab",
    count: 345,
    cities: [
      { name: "Chandigarh", count: 87 },
      { name: "Amritsar", count: 65 },
      { name: "Ludhiana", count: 54 },
      { name: "Jalandhar", count: 43 },
    ],
  },
]

const images = [
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531304/unnamed_5_i7qnb7.webp",
    alt: "Wedding couple by the lake",
    caption: "Capture your special moments with professional photographers",
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_2_yjfx4l.webp",
    alt: "Family portrait in a garden",
    caption: "Create lasting memories with family photography sessions",
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_mnfmjo.webp",
    alt: "Engagement photoshoot at sunset",
    caption: "Find the perfect photographer for your engagement",
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_1_re5olq.webp",
    alt: "Traditional Indian wedding ceremony",
    caption: "Specialists in traditional and cultural ceremonies",
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_6_hsw1lx.webp",
    alt: "Traditional Indian wedding ceremony",
    caption: "Specialists in traditional and cultural ceremonies",
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_4_h0l0zp.webp",
    alt: "Traditional Indian wedding ceremony",
    caption: "Specialists in traditional and cultural ceremonies",
  },
]

export default function HomePhotographerSearch() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  // Rotate through images every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Image Carousel with Framer Motion */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${images[currentImageIndex].url})`,
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-3xl  sm:text-3xl md:text-3xl"
        >
          More than 45,000 wedding and family photographers
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-xl"
        >
          {images[currentImageIndex].caption}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-md"
        >
          <h2 className="mb-4 text-xl">Find the best photographers near me:</h2>
          <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for state or city..."
                    className="h-12 pl-10 text-white border-white"
                    onClick={() => setOpen(true)}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search for state or city..." value={value} onValueChange={setValue} />
                  <CommandList className="max-h-[300px] overflow-auto">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {locations.map((location) => (
                      <React.Fragment key={location.state}>
                        <CommandGroup heading={location.state}>
                          <CommandItem
                            onSelect={() => {
                              setValue(location.state)
                              setOpen(false)
                            }}
                            className="flex items-center justify-between"
                          >
                            <span>{location.state}</span>
                            <span className="text-sm text-muted-foreground">{location.count}</span>
                          </CommandItem>
                          {location.cities.map((city) => (
                            <CommandItem
                              key={city.name}
                              onSelect={() => {
                                setValue(`${city.name}, ${location.state}`)
                                setOpen(false)
                              }}
                              className="flex items-center justify-between pl-6"
                            >
                              <span>{city.name}</span>
                              <span className="text-sm text-muted-foreground">{city.count}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </React.Fragment>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button className="h-12 bg-blue-600 text-white hover:bg-blue-700">FIND A PHOTOGRAPHER</Button>
          </div>
        </motion.div>

        {/* Image indicators */}
        <div className="absolute bottom-8 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                currentImageIndex === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/80",
              )}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

