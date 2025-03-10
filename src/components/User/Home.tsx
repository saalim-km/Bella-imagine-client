import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

interface Photographer {
  name: string
  caption?: string
}

interface Photo {
  url: string
  alt: string
  photographer: Photographer
}

const photos: Photo[] = [
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741540897/unnamed_7_xd0xor.webp",
    alt: "Wedding dinner at night with string lights",
    photographer: {
      name: "John Doe",
      caption: "Magical evening reception",
    },
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741540897/unnamed_4_at4bgt.webp",
    alt: "Bride in lace dress near ruins",
    photographer: {
      name: "Jane Smith",
      caption: "Rustic romance",
    },
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531306/unnamed_3_lnywzl.webp",
    alt: "Night wedding setup by the water",
    photographer: {
      name: "Mike Johnson",
      caption: "Waterfront ceremony",
    },
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741540897/unnamed_vnfci0.webp",
    alt: "Black and white wedding photo",
    photographer: {
      name: "Sarah Williams",
      caption: "Timeless moments",
    },
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741540897/unnamed_1_vhfqzu.webp",
    alt: "Tropical wedding scene",
    photographer: {
      name: "David Brown",
      caption: "Paradise wedding",
    },
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741540898/unnamed_5_ohgwpq.webp",
    alt: "Sunset wedding portrait",
    photographer: {
      name: "Emily Davis",
      caption: "Golden hour magic",
    },
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741540898/unnamed_2_ocgmvv.webp",
    alt: "Wedding detail shots",
    photographer: {
      name: "Alex Turner",
      caption: "The little details",
    },
  },
  {
    url: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741540897/unnamed_3_vd6kto.webp",
    alt: "Mountain backdrop wedding",
    photographer: {
      name: "Lisa Anderson",
      caption: "Mountain majesty",
    },
  },
]

const tags = [
  "wedding",
  "portrait",
  "ceremony",
  "reception",
  "couple",
  "bride",
  "groom",
  "details",
  "venue",
  "destination",
  "photography",
  "moments",
  "love",
]

export default function Home() {
  return (
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
          
          <div className="aspect-[/3]" style={{marginTop: "-55px"}}>
            <PhotoCard photo={photos[4]} />
          </div>
          <div className="aspect-[4/6]" style={{marginTop: "-50%"}}>
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

          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-muted hover:bg-primary/10 text-foreground/80 cursor-pointer transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <button className="mx-auto flex items-center gap-2 p-3 rounded-full hover:bg-muted transition-colors">
            <Search className="h-4 w-4" />
            <span className="text-sm">Search collections</span>
          </button>
        </div>
      </main>
    </div>
  )
}

interface PhotoCardProps {
  photo: Photo
  featured?: boolean
  small?: boolean
}

function PhotoCard({ photo, featured, small }: PhotoCardProps) {
  return (
    <motion.div
      className={`relative w-full h-full group overflow-hidden rounded-lg ${
        featured ? 'shadow-lg' : 'shadow-md'
      }`}
      whileHover={{ scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <img
        src={photo.url}
        alt={photo.alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className={`font-medium ${featured ? 'text-xl' : 'text-lg'} ${small ? 'text-sm' : ''}`}>
            {photo.photographer.name}
          </p>
          {photo.photographer.caption && (
            <p className={`opacity-90 ${featured ? 'text-base' : 'text-sm'} ${small ? 'text-xs' : ''}`}>
              {photo.photographer.caption}
            </p>
          )}
        </div>
      </div>
      {featured && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm text-white">
            Featured
          </Badge>
        </div>
      )}
    </motion.div>
  )
}