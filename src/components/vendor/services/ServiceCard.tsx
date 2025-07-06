import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IServiceResponse } from "@/types/interfaces/vendor";
import { Clock, MapPin, Tag, Calendar, Zap } from "lucide-react";

interface ServiceCardProps {
  service: IServiceResponse;
  onEdit: (service: IServiceResponse) => void;
  onDelete: (serviceId: string) => void;
}

const ServiceCard = ({ service, onEdit, onDelete }: ServiceCardProps) => {
  // Calculate average price if multiple session durations exist
  const averagePrice = service.sessionDurations.length > 0 
    ? service.sessionDurations.reduce((sum, session) => sum + session.price, 0) / service.sessionDurations.length
    : 0;

  // Format experience text
  const experienceText = service.yearsOfExperience > 0 
    ? `${service.yearsOfExperience}+ years experience` 
    : "No experience specified";

  return (
    <Card className="shadow-none h-full flex flex-col">
      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        <Badge
          variant="outline"
          className={`text-xs font-medium ${
            service.isPublished
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-yellow-100 text-yellow-800 border-yellow-200"
          }`}
        >
          {service.isPublished ? "Published" : "Draft"}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{service.serviceTitle}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <Zap className="h-4 w-4 mr-1" />
          <span>{experienceText}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-3">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {service.serviceDescription || "No description available"}
        </p>

        {/* Category and Pricing */}
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs">
            {service.category?.title || "Uncategorized"}
          </Badge>
          <div className="flex items-center">
            {service.sessionDurations.length > 1 ? (
              <>
                <span className="font-bold text-primary">
                  ₹{Math.round(averagePrice)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">avg/session</span>
              </>
            ) : (
              <>
                <span className="font-bold text-primary">
                  ₹{service.sessionDurations[0]?.price || "N/A"}
                </span>
                <span className="text-xs text-muted-foreground ml-1">/session</span>
              </>
            )}
          </div>
        </div>

        {/* Session Durations */}
        {service.sessionDurations.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Session Options:</h4>
            <div className="grid grid-cols-2 gap-2">
              {service.sessionDurations.map((session) => (
                <div key={session._id || session.durationInHours} className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{session.durationInHours} hrs</span>
                  <span className="ml-auto font-medium">₹{session.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {service.location && (
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <span className="truncate">{service.location.address}</span>
          </div>
        )}

        {/* Style Specialties */}
        {service.styleSpecialty && service.styleSpecialty.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Specializes in:</h4>
            <div className="flex flex-wrap gap-1">
              {service.styleSpecialty.slice(0, 3).map((style) => (
                <Badge key={style} variant="outline" className="text-xs">
                  {style}
                </Badge>
              ))}
              {service.styleSpecialty.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{service.styleSpecialty.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Next Available Date */}
        {service.availableDates && service.availableDates.length > 0 && (
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Next available: {new Date(service.availableDates[0].date).toLocaleDateString()}</span>
          </div>
        )}

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {service.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{service.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(service)}
          className="flex-1 mr-2"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(service._id!)}
          className="flex-1"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;