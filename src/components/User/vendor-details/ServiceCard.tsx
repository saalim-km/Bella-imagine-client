import { Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { IServiceResponse, IWorkSampleResponse } from "@/types/interfaces/vendor"
import { ImageWithFallback } from "../ImageFallBack"

interface ServiceCardProps {
  service: IServiceResponse
  onViewDetails: (service: any) => void
  workSample: IWorkSampleResponse
}

export default function ServiceCard({ service, onViewDetails, workSample }: ServiceCardProps) {
  return (
    <div
      className="group cursor-pointer border border-border/10 rounded-lg overflow-hidden bg-muted dark:bg-black/5"
      onClick={() => onViewDetails(service)}
    >
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={workSample?.media[0]}
          alt={service.serviceTitle}
          className="object-cover w-full h-full"
          fallbackType="work"
        />
        <div className="absolute bottom-0 left-0 p-6 z-20">
          <h3 className="text-xl text-white mb-1">{service.serviceTitle}</h3>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">
              {service.yearsOfExperience} Years Experience
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-muted-foreground line-clamp-2">{service.serviceDescription}</p>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Starting at</div>
            <div className="text-xl text-foreground">
              ₹
              {service.sessionDurations.length > 0
                ? Math.min(...service.sessionDurations.map((s: any) => s.price)).toLocaleString()
                : "N/A"}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {service.sessionDurations.length > 0
                ? Math.min(...service.sessionDurations.map((s: any) => s.durationInHours))
                : "N/A"}{" "}
              hours minimum
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Style Specialties</div>
          <div className="flex flex-wrap gap-2">
            {service.styleSpecialty.slice(0, 3).map((style: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="bg-muted/30 text-foreground/80 hover:text-foreground">
                {style}
              </Badge>
            ))}
            {service.styleSpecialty.length > 3 && (
              <Badge variant="secondary" className="bg-muted/30 text-foreground/80 hover:text-foreground">
                +{service.styleSpecialty.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <div className="text-sm flex items-center gap-1 text-foreground group-hover:underline">
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}